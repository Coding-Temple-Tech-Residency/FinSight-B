import os
import time
import requests

from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from threading import Lock
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models.market_data import MarketData
from models.stock import Stock
from models.trending_stock import TrendingStock

from schemas.trending import (
    TrendingStock as TrendingStockSchema,
    TrendingStocksResponse,
)



ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
BASE_URL = "https://www.alphavantage.co/query"

# -------------------------------------------------------------------------
# TRENDING-MARKET CACHE
# -------------------------------------------------------------------------
#
# Alpha Vantage's free plan has a very small daily request allowance.
# The trending response should therefore not be fetched every time the
# frontend refreshes, rerenders, changes routes, or opens a new browser tab.
#
# This in-memory cache is suitable for local development and a single
# backend process.
#
# Important production note:
# - It is cleared whenever Uvicorn reloads.
# - It is not shared between multiple backend containers.
#
# For production, this can later be replaced by Redis or a database table.
_trending_cache: dict[str, object] = {
    "data": None,
    "expires_at": 0.0,
}

# Prevent two simultaneous requests from both calling Alpha Vantage before
# the first one has had time to populate the cache.
_trending_cache_lock = Lock()

# The default Alpha Vantage response is generally end-of-day information,
# so a one-hour cache is already conservative.
#
# You could safely increase this to several hours if necessary.
TRENDING_CACHE_SECONDS = 60 * 60

def fetch_trending_stocks(
    db: Session,
    force_refresh: bool = False,
) -> TrendingStocksResponse:
    """
    Returns trending stocks from PostgreSQL when available.

    Alpha Vantage is called only when:
    - no snapshot exists; or
    - force_refresh is explicitly requested.
    """

    if not force_refresh:
        saved_snapshot = get_latest_trending_snapshot(db)

        if saved_snapshot is not None:
            return saved_snapshot

    params = {
        "function": "TOP_GAINERS_LOSERS",
        "apikey": ALPHA_VANTAGE_API_KEY,
    }

    try:
        response = requests.get(
            BASE_URL,
            params=params,
            timeout=20,
        )

        response.raise_for_status()
        data = response.json()

    except requests.RequestException as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to retrieve trending market information.",
        ) from error

    if "Information" in data or "Note" in data:
        # If the provider is unavailable but a saved snapshot exists,
        # return the saved data instead of failing the frontend.
        saved_snapshot = get_latest_trending_snapshot(db)

        if saved_snapshot is not None:
            return saved_snapshot

        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=(
                "Trending market information is temporarily unavailable."
            ),
        )

    save_trending_snapshot(
        db=db,
        data=data,
    )

    return TrendingStocksResponse(
        last_updated=data.get("last_updated"),
        metadata=data.get("metadata"),
        top_gainers=[
            TrendingStockSchema(**item)
            for item in data.get("top_gainers", [])
        ],
        top_losers=[
            TrendingStockSchema(**item)
            for item in data.get("top_losers", [])
        ],
        most_actively_traded=[
            TrendingStockSchema(**item)
            for item in data.get(
                "most_actively_traded",
                [],
            )
        ],
    )

def fetch_daily_history(symbol: str) -> dict:
    if not ALPHA_VANTAGE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Alpha Vantage API key is not configured",
        )

    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": symbol.strip().upper(),
        "outputsize": "compact",
        "apikey": ALPHA_VANTAGE_API_KEY,
    }

    for attempt in range(3):
        print(
            "ALPHA VANTAGE REQUEST:",
            params.get("function"),
            params.get("symbol"),
        )
        try:
            response = requests.get(
                BASE_URL,
                params=params,
                timeout=20,
            )
            response.raise_for_status()
            data = response.json()
            break

        except requests.RequestException as error:
            if attempt < 2:
                time.sleep(1.5)
            else:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Unable to contact Alpha Vantage after multiple attempts",
                ) from error

    if "Error Message" in data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid stock symbol",
        )

    if "Note" in data or "Information" in data:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=data.get("Note") or data.get("Information"),
        )

    time_series = data.get("Time Series (Daily)")

    if not time_series:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Daily market history not found",
        )

    return time_series

def fetch_company_overview(symbol: str) -> dict:
    """
    Fetches descriptive company metadata from Alpha Vantage.

    The response may include:
    - company name;
    - exchange;
    - quote currency;
    - sector;
    - industry.
    """

    if not ALPHA_VANTAGE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Alpha Vantage API key is not configured",
        )

    params = {
        "function": "OVERVIEW",
        "symbol": symbol.strip().upper(),
        "apikey": ALPHA_VANTAGE_API_KEY,
    }

    try:
        print(
    "ALPHA VANTAGE REQUEST:",
    params.get("function"),
    params.get("symbol"),
)   

        response = requests.get(
            BASE_URL,
            params=params,
            timeout=20,
        )
        response.raise_for_status()
        data = response.json()

    except requests.RequestException as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to retrieve company information",
        ) from error

    if "Note" in data or "Information" in data:
        print(
            "Alpha Vantage overview rate-limit response:",
            data.get("Note") or data.get("Information"),
        )

        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=(
                "Company information is temporarily unavailable because "
                "the market data provider request limit was reached."
            ),
        )

    if "Error Message" in data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid stock symbol",
        )

    if not data or not data.get("Symbol"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company information was not found",
        )

    return data

def get_or_update_stock(
    db: Session,
    symbol: str,
    time_series: dict | None = None,
) -> Stock:
    """
    Returns cached stock data whenever it is complete.

    Alpha Vantage is called only when:
    - the stock does not exist;
    - its price is missing; or
    - its descriptive metadata is missing.
    """

    symbol = symbol.strip().upper()

    stock = (
        db.query(Stock)
        .filter(Stock.symbol == symbol)
        .first()
    )

    needs_price = (
        stock is None
        or stock.latest_price is None
    )

    needs_overview = (
        stock is None
        or stock.company_name in (None, "", symbol)
        or stock.exchange is None
        or stock.sector is None
        or stock.industry is None
        or stock.currency is None
    )

    # Only fetch daily history when no cached price exists.
    if needs_price:
        if time_series is None:
            time_series = fetch_daily_history(symbol)

        latest_timestamp = max(time_series.keys())
        latest_values = time_series[latest_timestamp]
        latest_price = Decimal(latest_values["4. close"])
    else:
        latest_price = stock.latest_price

    # Only fetch descriptive metadata when it is missing.
    if needs_overview:
        overview = fetch_company_overview(symbol)
    else:
        overview = None

    if stock is None:
        stock = Stock(
            symbol=symbol,
            company_name=overview.get("Name") or symbol,
            exchange=overview.get("Exchange"),
            sector=overview.get("Sector"),
            industry=overview.get("Industry"),
            currency=overview.get("Currency") or "USD",
            company_logo_url=None,
            latest_price=latest_price,
            last_refreshed_at=datetime.now(timezone.utc),
        )

        db.add(stock)

    else:
        if needs_price:
            stock.latest_price = latest_price
            stock.last_refreshed_at = datetime.now(timezone.utc)

        if overview:
            stock.company_name = (
                overview.get("Name")
                or stock.company_name
            )
            stock.exchange = (
                overview.get("Exchange")
                or stock.exchange
            )
            stock.sector = (
                overview.get("Sector")
                or stock.sector
            )
            stock.industry = (
                overview.get("Industry")
                or stock.industry
            )
            stock.currency = (
                overview.get("Currency")
                or stock.currency
                or "USD"
            )

    try:
        db.commit()
        db.refresh(stock)
        return stock

    except Exception:
        db.rollback()
        raise

def save_daily_history(
    db: Session,
    stock: Stock,
    time_series: dict,
) -> list[MarketData]:
    saved_records = []

    for timestamp, values in time_series.items():
        price_timestamp = datetime.fromisoformat(timestamp)

        existing_record = (
            db.query(MarketData)
            .filter(
                MarketData.stock_id == stock.id,
                MarketData.timeframe == "daily",
                MarketData.price_timestamp == price_timestamp,
            )
            .first()
        )

        if existing_record:
            continue

        market_data = MarketData(
            stock_id=stock.id,
            timeframe="daily",
            open_price=Decimal(values["1. open"]),
            high_price=Decimal(values["2. high"]),
            low_price=Decimal(values["3. low"]),
            close_price=Decimal(values["4. close"]),
            volume=int(values["5. volume"]),
            price_timestamp=price_timestamp,
        )

        db.add(market_data)
        saved_records.append(market_data)

    db.commit()

    for record in saved_records:
        db.refresh(record)

    return saved_records

def get_cached_market_history(
    db: Session,
    stock_id: int,
    timeframe: str,
) -> list[MarketData]:
    """
    Returns stored market history for a stock and timeframe.

    Keeping this query in one helper avoids repeating the same
    filtering and ordering logic throughout the service.
    """

    return (
        db.query(MarketData)
        .filter(
            MarketData.stock_id == stock_id,
            MarketData.timeframe == timeframe,
        )
        .order_by(MarketData.price_timestamp.asc())
        .all()
    )

def refresh_market_data(
    db: Session,
    symbol: str,
) -> Stock:
    """
    Fetches current daily market history from Alpha Vantage,
    creates or updates the related Stock record, and stores any
    new MarketData records.

    This function centralizes the full external refresh workflow so
    Stocks, Market Data, AI Insights, Holdings, and Watchlist features
    can reuse the same logic.
    """

    clean_symbol = symbol.strip().upper()

    # Retrieve the most recent daily time series from Alpha Vantage.
    time_series = fetch_daily_history(clean_symbol)

    # Create the Stock if it does not exist, or update its latest
    # closing price and last-refreshed timestamp if it already exists.
    stock = get_or_update_stock(
        db=db,
        symbol=clean_symbol,
        time_series=time_series,
    )

    # Store only market records that are not already in the database.
    save_daily_history(
        db=db,
        stock=stock,
        time_series=time_series,
    )

    return stock

def get_stock_market_history(
    db: Session,
    symbol: str,
    timeframe: str = "daily",
) -> list[MarketData]:
    """
    Returns historical market data for a stock.

    The database is checked first. Alpha Vantage is only called when
    the stock or its requested market history is missing.
    """

    clean_symbol = symbol.strip().upper()

    # FinSight currently supports daily market history only.
    if timeframe != "daily":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only the daily timeframe is currently supported",
        )

    # Find an existing stock record without calling the external API.
    stock = (
        db.query(Stock)
        .filter(Stock.symbol == clean_symbol)
        .first()
    )

    if stock:
        # Return cached data immediately when available.
        existing_history = get_cached_market_history(
            db=db,
            stock_id=stock.id,
            timeframe=timeframe,
        )

        if existing_history:
            return existing_history

    # The stock or its history is missing, so fetch and persist it.
    stock = refresh_market_data(
        db=db,
        symbol=clean_symbol,
    )

    # Return the newly stored data using the same reusable query helper.
    return get_cached_market_history(
        db=db,
        stock_id=stock.id,
        timeframe=timeframe,
    )

def parse_percentage(value: str) -> Decimal:
    """
    Converts a provider percentage string into a Decimal.

    Example:
        "3.45%" -> Decimal("3.45")

    A controlled exception is raised when the provider returns an
    unexpected value.
    """

    cleaned_value = str(value).strip().replace("%", "")

    try:
        return Decimal(cleaned_value)

    except InvalidOperation as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "The market data provider returned an invalid "
                "percentage value."
            ),
        ) from error


def parse_provider_timestamp(
    value: str | None,
) -> datetime | None:
    """
    Attempts to convert the provider's last_updated value into a Python
    datetime.

    The Alpha Vantage timestamp may include additional timezone text,
    so this function safely returns None when it cannot parse it.

    The raw provider metadata may still be returned to the frontend.
    """

    if not value:
        return None

    formats = (
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d %H:%M",
    )

    # Remove common trailing timezone labels before parsing.
    cleaned_value = (
        value.replace(" US/Eastern", "")
        .replace(" UTC", "")
        .strip()
    )

    for date_format in formats:
        try:
            return datetime.strptime(
                cleaned_value,
                date_format,
            )

        except ValueError:
            continue

    return None


def save_trending_snapshot(
    db: Session,
    data: dict,
) -> str:
    """
    Persists one complete trending-market response.

    All gainers, losers, and active stocks receive the same snapshot ID,
    allowing the application to retrieve the complete latest dataset.

    Args:
        db:
            Current SQLAlchemy session.

        data:
            Raw provider response containing the trending categories.

    Returns:
        str:
            The UUID identifying the saved snapshot.
    """

    snapshot_id = str(uuid4())

    provider_updated_at = parse_provider_timestamp(
        data.get("last_updated")
    )

    category_mapping = {
        "top_gainers": "GAINER",
        "top_losers": "LOSER",
        "most_actively_traded": "ACTIVE",
    }

    try:
        for provider_key, category in category_mapping.items():
            provider_items = data.get(provider_key, [])

            for item in provider_items:
                trending_row = TrendingStock(
                    ticker=str(item["ticker"]).strip().upper(),
                    category=category,
                    price=Decimal(str(item["price"])),
                    change_amount=Decimal(
                        str(item["change_amount"])
                    ),
                    change_percentage=parse_percentage(
                        item["change_percentage"]
                    ),
                    volume=int(item["volume"]),
                    provider_updated_at=provider_updated_at,
                    snapshot_id=snapshot_id,
                    source="alpha_vantage",
                )

                db.add(trending_row)

        db.commit()

        return snapshot_id

    except Exception:
        db.rollback()
        raise

def get_latest_trending_snapshot(
    db: Session,
) -> TrendingStocksResponse | None:
    """
    Loads the most recently saved trending snapshot from PostgreSQL.

    Returns None when no saved snapshot exists.
    """

    latest_row = (
        db.query(TrendingStock)
        .order_by(TrendingStock.created_at.desc())
        .first()
    )

    if latest_row is None:
        return None

    snapshot_rows = (
        db.query(TrendingStock)
        .filter(
            TrendingStock.snapshot_id
            == latest_row.snapshot_id
        )
        .order_by(TrendingStock.id.asc())
        .all()
    )

    top_gainers: list[TrendingStockSchema] = []
    top_losers: list[TrendingStockSchema] = []
    most_active: list[TrendingStockSchema] = []

    for row in snapshot_rows:
        response_item = TrendingStockSchema(
            ticker=row.ticker,
            price=str(row.price),
            change_amount=str(row.change_amount),
            change_percentage=(
                f"{row.change_percentage}%"
            ),
            volume=str(row.volume),
        )

        if row.category == "GAINER":
            top_gainers.append(response_item)

        elif row.category == "LOSER":
            top_losers.append(response_item)

        elif row.category == "ACTIVE":
            most_active.append(response_item)

    return TrendingStocksResponse(
        last_updated=(
            latest_row.provider_updated_at.isoformat()
            if latest_row.provider_updated_at
            else latest_row.created_at.isoformat()
        ),
        metadata="Latest trending-market snapshot stored by FinSight.",
        top_gainers=top_gainers,
        top_losers=top_losers,
        most_actively_traded=most_active,
    )

def search_stock_symbols(
    db: Session,
    keywords: str,
) -> list[dict]:
    """
    Searches for stocks and supported assets using a partial ticker
    symbol or company name.

    This function:
    1. Validates the search text.
    2. Calls Alpha Vantage's SYMBOL_SEARCH endpoint.
    3. Normalizes the provider response.
    4. Saves each result as a partial Stock record.
    5. Returns the normalized matches to the frontend.

    Search results are saved without requesting price history or a full
    company overview. A stock is fully populated later when the user
    selects it.
    """

    clean_keywords = keywords.strip()

    if len(clean_keywords) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Enter at least two characters",
        )

    if not ALPHA_VANTAGE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Alpha Vantage API key is not configured",
        )

    params = {
        "function": "SYMBOL_SEARCH",
        "keywords": clean_keywords,
        "apikey": ALPHA_VANTAGE_API_KEY,
    }

    try:
        response = requests.get(
            BASE_URL,
            params=params,
            timeout=20,
        )

        response.raise_for_status()
        data = response.json()

    except requests.Timeout as error:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="The stock search provider took too long to respond",
        ) from error

    except requests.RequestException as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to search for stocks",
        ) from error

    # Alpha Vantage may return HTTP 200 while including the rate-limit
    # message inside one of these properties.
    if "Information" in data or "Note" in data:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=(
                "Stock search is temporarily unavailable due to the "
                "provider request limit."
            ),
        )

    if "Error Message" in data:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The stock search provider rejected the request",
        )

    # Alpha Vantage stores search matches inside the bestMatches list.
    raw_matches = data.get("bestMatches", [])

    normalized_matches = [
        {
            "symbol": item.get("1. symbol", "").strip().upper(),
            "name": item.get("2. name", "").strip(),
            "asset_type": item.get("3. type"),
            "region": item.get("4. region"),
            "market_open": item.get("5. marketOpen"),
            "market_close": item.get("6. marketClose"),
            "timezone": item.get("7. timezone"),
            "currency": item.get("8. currency"),
            "match_score": (
                float(item["9. matchScore"])
                if item.get("9. matchScore")
                else None
            ),
        }
        for item in raw_matches
        if item.get("1. symbol")
    ]

    # Save all returned results as partial Stock rows.
    #
    # This does not fetch daily history or company overview data.
    save_stock_search_results(
        db=db,
        matches=normalized_matches,
    )

    return normalized_matches

def save_stock_search_results(
    db: Session,
    matches: list[dict],
) -> list[Stock]:
    """
    Saves stock-search matches as partial Stock records.

    A SYMBOL_SEARCH request may return several matching securities.
    Saving those matches allows future searches to use the local database
    and gradually populates the stocks table without making one external
    API request per result.

    Important:
    - Search results do not contain market prices, sectors, or industries.
    - Existing complete Stock records are not overwritten with null values.
    - New records remain partially populated until the user selects them
      and get_or_update_stock() retrieves their price and overview.
    """

    saved_stocks: list[Stock] = []

    try:
        for match in matches:
            symbol = str(match.get("symbol", "")).strip().upper()

            # Ignore malformed results that have no symbol.
            if not symbol:
                continue

            company_name = (
                str(match.get("name", "")).strip()
                or symbol
            )

            currency = (
                str(match.get("currency", "")).strip().upper()
                or "USD"
            )

            stock = (
                db.query(Stock)
                .filter(Stock.symbol == symbol)
                .first()
            )

            if stock is None:
                # Create a partial Stock row.
                #
                # Price and detailed metadata remain empty because the
                # SYMBOL_SEARCH endpoint does not provide those fields.
                stock = Stock(
                    symbol=symbol,
                    company_name=company_name,
                    currency=currency,
                    latest_price=None,
                    exchange=None,
                    sector=None,
                    industry=None,
                    company_logo_url=None,
                    last_refreshed_at=None,
                )

                db.add(stock)
                saved_stocks.append(stock)

            else:
                # Improve incomplete metadata without replacing existing,
                # more complete values with empty search-result values.
                if (
                    not stock.company_name
                    or stock.company_name == stock.symbol
                ):
                    stock.company_name = company_name

                if not stock.currency:
                    stock.currency = currency

                saved_stocks.append(stock)

        # Commit once after processing all matches instead of committing
        # once per search result.
        db.commit()

        for stock in saved_stocks:
            db.refresh(stock)

        return saved_stocks

    except Exception:
        db.rollback()
        raise