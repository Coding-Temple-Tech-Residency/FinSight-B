import os
import time
from datetime import datetime, timezone
from decimal import Decimal
from threading import Lock

import requests
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models.market_data import MarketData
from models.stock import Stock

from schemas.trending import (
    TrendingStock,
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
    force_refresh: bool = False,
) -> TrendingStocksResponse:
    """
    Retrieves top gainers, top losers, and most actively traded US stocks.

    Cache behavior:
    - If a valid cached result exists, it is returned immediately.
    - If the cache is empty or expired, Alpha Vantage is called once.
    - force_refresh=True bypasses the cache, but should be used sparingly.

    Args:
        force_refresh:
            When True, requests fresh provider data even when a valid
            cached result exists.

    Returns:
        TrendingStocksResponse:
            A normalized response suitable for the frontend.

    Raises:
        HTTPException:
            500 if the API key is missing.
            429 if Alpha Vantage reports a request limit.
            502 if the provider cannot be contacted or sends invalid data.
    """

    if not ALPHA_VANTAGE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Alpha Vantage API key is not configured",
        )

    current_time = time.time()

    cached_data = _trending_cache["data"]
    cache_expires_at = float(_trending_cache["expires_at"])

    # Return cached data before acquiring the lock whenever possible.
    if (
        not force_refresh
        and cached_data is not None
        and current_time < cache_expires_at
    ):
        return cached_data

    with _trending_cache_lock:
        # Another request may have populated the cache while this request
        # was waiting to acquire the lock, so check it again.
        current_time = time.time()
        cached_data = _trending_cache["data"]
        cache_expires_at = float(_trending_cache["expires_at"])

        if (
            not force_refresh
            and cached_data is not None
            and current_time < cache_expires_at
        ):
            return cached_data

        params = {
            "function": "TOP_GAINERS_LOSERS",
            "apikey": ALPHA_VANTAGE_API_KEY,
        }

        print(
            "ALPHA VANTAGE REQUEST:",
            params["function"],
        )

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
                detail=(
                    "The market data provider took too long to respond."
                ),
            ) from error

        except requests.RequestException as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "Unable to retrieve trending market information."
                ),
            ) from error

        # Alpha Vantage may return HTTP 200 while placing the rate-limit
        # explanation inside an Information or Note property.
        if "Information" in data or "Note" in data:
            print(
                "Alpha Vantage trending limit response:",
                data.get("Information") or data.get("Note"),
            )

            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=(
                    "Trending market information is temporarily "
                    "unavailable because the provider request limit "
                    "was reached."
                ),
            )

        if "Error Message" in data:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="The market data provider rejected the request.",
            )

        # Validate that the response contains at least one expected group.
        if not any(
            key in data
            for key in (
                "top_gainers",
                "top_losers",
                "most_actively_traded",
            )
        ):
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "The market data provider returned an unexpected "
                    "trending-market response."
                ),
            )

        normalized_response = TrendingStocksResponse(
            last_updated=data.get("last_updated"),
            metadata=data.get("metadata"),
            top_gainers=[
                TrendingStock(**item)
                for item in data.get("top_gainers", [])
            ],
            top_losers=[
                TrendingStock(**item)
                for item in data.get("top_losers", [])
            ],
            most_actively_traded=[
                TrendingStock(**item)
                for item in data.get(
                    "most_actively_traded",
                    [],
                )
            ],
        )

        # Cache the normalized result, not the raw provider dictionary.
        _trending_cache["data"] = normalized_response
        _trending_cache["expires_at"] = (
            time.time() + TRENDING_CACHE_SECONDS
        )

        return normalized_response

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