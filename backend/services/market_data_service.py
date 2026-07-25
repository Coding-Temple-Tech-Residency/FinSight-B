import os
import time

from datetime import datetime, timedelta, timezone
from decimal import Decimal, InvalidOperation
from uuid import uuid4
from zoneinfo import ZoneInfo

import requests
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from models.market_data import MarketData
from models.stock import Stock
from models.trending_stock import TrendingStock

from schemas.trending import (
    TrendingStock as TrendingStockSchema,
    TrendingStocksResponse,
)

from services.finnhub_service import (
    fetch_finnhub_company_profile,
    fetch_finnhub_quote,
    search_finnhub_symbols,
)


# =========================================================================
# EXTERNAL PROVIDER CONFIGURATION
# =========================================================================

# Alpha Vantage remains responsible only for:
#
# - historical daily stock candles;
# - top gainers;
# - top losers;
# - most actively traded stocks.
#
# Company search, company metadata, logos, native currency, exchange,
# industry, and current quotes are now retrieved from Finnhub.
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

ALPHA_VANTAGE_BASE_URL = (
    "https://www.alphavantage.co/query"
)


# =========================================================================
# CACHE AND REFRESH CONFIGURATION
# =========================================================================

# A Finnhub quote is considered fresh for this amount of time.
#
# Reopening the same stock during this period will use the stored price
# instead of making another Finnhub request.
STOCK_QUOTE_CACHE_DURATION = timedelta(minutes=15)


# Maximum number of complete stocks returned and saved during one search.
#
# A complete search result normally requires:
#
#     1 Finnhub search request
#     1 Finnhub company-profile request per result
#     1 Finnhub quote request per result
#
# Therefore, a search returning ten complete results may require:
#
#     1 + 10 + 10 = 21 Finnhub requests
#
# Limiting the result count prevents one broad search from producing
# hundreds of provider calls.
FULL_SEARCH_RESULT_LIMIT = 10


# Small pause between processing Finnhub search matches.
#
# This is intentionally conservative. If your Finnhub request helper
# already enforces rate limiting globally, this delay may be reduced or
# removed.
FINNHUB_SEARCH_REQUEST_DELAY_SECONDS = 1.05


# =========================================================================
# GENERAL STOCK HELPERS
# =========================================================================


def normalize_symbol(symbol: str) -> str:
    """
    Cleans and normalizes a stock symbol.

    Examples:
        " aapl " -> "AAPL"
        "msft"   -> "MSFT"

    Raises:
        HTTPException:
            When the symbol is empty after trimming whitespace.
    """

    clean_symbol = symbol.strip().upper()

    if not clean_symbol:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stock symbol cannot be empty",
        )

    return clean_symbol


def decimal_or_none(value) -> Decimal | None:
    """
    Safely converts a provider value into Decimal.

    Returns None when:
    - the value is missing;
    - the value is empty;
    - the value cannot be converted;
    - the numeric value is zero or negative.

    Finnhub commonly returns zero-valued quote fields when no usable
    quote is available for a symbol.
    """

    if value in (None, ""):
        return None

    try:
        decimal_value = Decimal(str(value))

    except (InvalidOperation, ValueError, TypeError):
        return None

    if decimal_value <= 0:
        return None

    return decimal_value


def stock_profile_is_complete(
    stock: Stock,
) -> bool:
    """
    Determines whether the important Finnhub profile fields are stored.

    Finnhub Company Profile 2 provides:
    - company name;
    - exchange;
    - native currency;
    - Finnhub industry;
    - company logo.

    Finnhub does not provide a separate sector field through Profile 2.
    For that reason, `sector` is not required for Finnhub profile
    completeness.
    """

    return all(
        (
            stock.company_name,
            stock.company_name != stock.symbol,
            stock.exchange,
            stock.currency,
            stock.industry,
        )
    )


def stock_quote_is_fresh(
    stock: Stock,
) -> bool:
    """
    Returns True when the stock has a valid recently refreshed quote.
    """

    if stock.latest_price is None:
        return False

    if stock.last_refreshed_at is None:
        return False

    refreshed_at = stock.last_refreshed_at

    # PostgreSQL timezone-aware columns should normally return aware
    # datetimes. This safeguard handles older naive rows.
    if refreshed_at.tzinfo is None:
        refreshed_at = refreshed_at.replace(
            tzinfo=timezone.utc
        )

    expiration_time = (
        datetime.now(timezone.utc)
        - STOCK_QUOTE_CACHE_DURATION
    )

    return refreshed_at >= expiration_time


def apply_finnhub_profile_to_stock(
    stock: Stock,
    profile: dict,
) -> None:
    """
    Maps Finnhub Company Profile 2 data into the correct Stock columns.

    Finnhub-to-database field mapping:

        profile["name"]
            -> stock.company_name

        profile["exchange"]
            -> stock.exchange

        profile["currency"]
            -> stock.currency

        profile["finnhubIndustry"]
            -> stock.industry

        profile["logo"]
            -> stock.company_logo_url

    Important:
        Finnhub Profile 2 does not provide a separate sector field.
        Existing sector information is therefore preserved rather than
        replaced with an inaccurate value.
    """

    company_name = str(
        profile.get("name") or ""
    ).strip()

    exchange = str(
        profile.get("exchange") or ""
    ).strip()

    currency = str(
        profile.get("currency") or ""
    ).strip().upper()

    industry = str(
        profile.get("finnhubIndustry") or ""
    ).strip()

    logo_url = str(
        profile.get("logo") or ""
    ).strip()

    if company_name:
        stock.company_name = company_name

    if exchange:
        stock.exchange = exchange

    if currency:
        stock.currency = currency

    if industry:
        stock.industry = industry

    if logo_url:
        stock.company_logo_url = logo_url


def apply_finnhub_quote_to_stock(
    stock: Stock,
    quote: dict,
) -> None:
    """
    Maps a Finnhub quote into the Stock price fields.

    Finnhub quote fields:

        c
            Current price.

        t
            Provider Unix timestamp.

    When Finnhub does not provide a usable timestamp, the current UTC
    time is used as the refresh timestamp.
    """

    latest_price = decimal_or_none(
        quote.get("c")
    )

    if latest_price is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                f"A current market quote is not available for "
                f"{stock.symbol}"
            ),
        )

    provider_timestamp = quote.get("t")

    if provider_timestamp:
        try:
            refreshed_at = datetime.fromtimestamp(
                int(provider_timestamp),
                tz=timezone.utc,
            )

        except (TypeError, ValueError, OSError):
            refreshed_at = datetime.now(timezone.utc)

    else:
        refreshed_at = datetime.now(timezone.utc)

    stock.latest_price = latest_price
    stock.last_refreshed_at = refreshed_at


def get_stock_from_database(
    db: Session,
    symbol: str,
) -> Stock | None:
    """
    Retrieves one stock without contacting any external provider.
    """

    clean_symbol = normalize_symbol(symbol)

    return (
        db.query(Stock)
        .filter(Stock.symbol == clean_symbol)
        .first()
    )

def get_or_create_stock_row(
    db: Session,
    symbol: str,
) -> Stock:
    """
    Returns the existing Stock row or safely creates it.

    This helper handles concurrent requests such as:

        GET /api/stocks/AAPL
        GET /api/stocks/AAPL/history

    Both requests may arrive before either transaction commits. The
    database unique constraint decides which request creates the row.
    The losing request catches the duplicate error and reloads the
    already-created row.
    """

    clean_symbol = normalize_symbol(symbol)

    existing_stock = (
        db.query(Stock)
        .filter(Stock.symbol == clean_symbol)
        .first()
    )

    if existing_stock is not None:
        return existing_stock

    candidate_stock = Stock(
        symbol=clean_symbol,
        company_name=clean_symbol,
        exchange=None,
        sector=None,
        industry=None,
        currency=None,
        company_logo_url=None,
        latest_price=None,
        last_refreshed_at=None,
    )

    try:
        # A nested transaction creates a savepoint.
        #
        # If another request inserts the same symbol first, only this
        # savepoint is rolled back instead of invalidating the entire
        # SQLAlchemy session.
        with db.begin_nested():
            db.add(candidate_stock)
            db.flush()

        return candidate_stock

    except IntegrityError:
        # Another request inserted the same symbol between our SELECT
        # and INSERT.
        db.expire_all()

        existing_stock = (
            db.query(Stock)
            .filter(Stock.symbol == clean_symbol)
            .first()
        )

        if existing_stock is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    f"{clean_symbol} was created by another request, "
                    "but the record could not be loaded."
                ),
            )

        return existing_stock

# =========================================================================
# FINNHUB COMPANY AND QUOTE INTEGRATION
# =========================================================================

def get_or_update_stock(
    db: Session,
    symbol: str,
    time_series: dict | None = None,
    force_quote_refresh: bool = False,
) -> Stock:
    """
    Retrieves, creates, or enriches one stock safely, even when multiple
    requests for the same symbol arrive simultaneously.
    """

    clean_symbol = normalize_symbol(symbol)

    stock = get_or_create_stock_row(
        db=db,
        symbol=clean_symbol,
    )

    needs_profile = not stock_profile_is_complete(stock)

    needs_quote = (
        force_quote_refresh
        or not stock_quote_is_fresh(stock)
    )

    try:
        if needs_profile:
            profile = fetch_finnhub_company_profile(
                clean_symbol
            )

            apply_finnhub_profile_to_stock(
                stock=stock,
                profile=profile,
            )

        if time_series:
            latest_timestamp = max(time_series.keys())
            latest_values = time_series[latest_timestamp]

            latest_close = decimal_or_none(
                latest_values.get("4. close")
            )

            if latest_close is not None:
                stock.latest_price = latest_close
                stock.last_refreshed_at = datetime.now(
                    timezone.utc
                )

        elif needs_quote:
            quote = fetch_finnhub_quote(
                clean_symbol
            )

            apply_finnhub_quote_to_stock(
                stock=stock,
                quote=quote,
            )

        if not stock_profile_is_complete(stock):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    f"Complete company information is not "
                    f"available for {clean_symbol}"
                ),
            )

        if stock.latest_price is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    f"Current price information is not "
                    f"available for {clean_symbol}"
                ),
            )

        db.commit()
        db.refresh(stock)

        return stock

    except Exception:
        db.rollback()
        raise

def build_full_stock_search_result(
    stock: Stock,
    original_match: dict,
) -> dict:
    """
    Builds one complete search response using the saved Stock record.

    All returned rows have:
    - a real company name;
    - exchange;
    - native currency;
    - industry;
    - latest price.

    Sector may remain null because Finnhub Profile 2 does not expose a
    distinct sector field.
    """

    return {
        "id": stock.id,
        "symbol": stock.symbol,
        "display_symbol": (
            original_match.get("display_symbol")
            or stock.symbol
        ),
        "name": stock.company_name,
        "company_name": stock.company_name,
        "asset_type": original_match.get(
            "asset_type"
        ),
        "exchange": stock.exchange,
        "sector": stock.sector,
        "industry": stock.industry,
        "currency": stock.currency,
        "logo_url": stock.company_logo_url,
        "company_logo_url": stock.company_logo_url,
        "latest_price": (
            str(stock.latest_price)
            if stock.latest_price is not None
            else None
        ),
        "last_refreshed_at": (
            stock.last_refreshed_at.isoformat()
            if stock.last_refreshed_at
            else None
        ),
        "is_enriched": True,
    }


def search_stock_symbols(
    db: Session,
    keywords: str,
) -> list[dict]:
    """
    Searches Finnhub and saves only fully enriched Stock records.

    Workflow:
        1. Make one Finnhub symbol-search request.
        2. Deduplicate results by complete provider symbol.
        3. Limit processing to the first ten matches.
        4. Retrieve the Finnhub company profile for each result.
        5. Retrieve the Finnhub current quote for each result.
        6. Save or update the complete Stock row.
        7. Return only results that were successfully enriched.

    No partial Stock rows are created by this function.

    A symbol is omitted from the response when Finnhub cannot provide:
        - a complete company profile; or
        - a usable current quote.
    """

    clean_keywords = keywords.strip()

    if len(clean_keywords) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Enter at least two characters",
        )

    raw_matches = search_finnhub_symbols(
        keywords=clean_keywords,
    )

    # Deduplicate by Finnhub's complete provider symbol.
    #
    # The complete symbol may include an exchange suffix, allowing
    # listings from different markets to coexist.
    unique_matches: dict[str, dict] = {}

    for match in raw_matches:
        symbol = str(
            match.get("symbol") or ""
        ).strip().upper()

        if not symbol:
            continue

        if symbol not in unique_matches:
            unique_matches[symbol] = match

    selected_matches = list(
        unique_matches.values()
    )[:FULL_SEARCH_RESULT_LIMIT]

    completed_results: list[dict] = []

    for index, match in enumerate(
        selected_matches
    ):
        symbol = str(
            match.get("symbol") or ""
        ).strip().upper()

        if not symbol:
            continue

        try:
            # Search results must be complete. Therefore, force a current
            # Finnhub quote rather than returning a stale or empty value.
            stock = get_or_update_stock(
                db=db,
                symbol=symbol,
                force_quote_refresh=True,
            )

        except HTTPException as error:
            # Do not create or return partial results.
            #
            # Certain symbols returned by search may be:
            # - warrants;
            # - funds;
            # - indexes;
            # - inactive instruments;
            # - foreign instruments without free quote access.
            print(
                "Skipping incomplete Finnhub search result:",
                symbol,
                error.detail,
            )

            continue

        completed_results.append(
            build_full_stock_search_result(
                stock=stock,
                original_match=match,
            )
        )

        # Spread calls during multi-result search enrichment.
        if index < len(selected_matches) - 1:
            time.sleep(
                FINNHUB_SEARCH_REQUEST_DELAY_SECONDS
            )

    if not completed_results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "No complete stock results were available "
                "for this search"
            ),
        )

    return completed_results


# =========================================================================
# ALPHA VANTAGE DAILY MARKET HISTORY
# =========================================================================


def fetch_daily_history(
    symbol: str,
) -> dict:
    """
    Fetches compact daily candle history from Alpha Vantage.

    This is the only regular stock-history operation in this service that
    still consumes an Alpha Vantage request.
    """

    clean_symbol = normalize_symbol(symbol)

    if not ALPHA_VANTAGE_API_KEY:
        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Alpha Vantage API key is not configured"
            ),
        )

    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": clean_symbol,
        "outputsize": "compact",
        "apikey": ALPHA_VANTAGE_API_KEY,
    }

    for attempt in range(3):

        try:
            response = requests.get(
                ALPHA_VANTAGE_BASE_URL,
                params=params,
                timeout=20,
            )

            response.raise_for_status()
            data = response.json()

            break

        except requests.Timeout as error:
            if attempt < 2:
                time.sleep(1.5)
                continue

            raise HTTPException(
                status_code=(
                    status.HTTP_504_GATEWAY_TIMEOUT
                ),
                detail=(
                    "Alpha Vantage took too long to respond"
                ),
            ) from error

        except requests.RequestException as error:
            if attempt < 2:
                time.sleep(1.5)
                continue

            raise HTTPException(
                status_code=(
                    status.HTTP_502_BAD_GATEWAY
                ),
                detail=(
                    "Unable to contact Alpha Vantage "
                    "after multiple attempts"
                ),
            ) from error

    if "Error Message" in data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid stock symbol",
        )

    if "Note" in data or "Information" in data:


        raise HTTPException(
            status_code=(
                status.HTTP_429_TOO_MANY_REQUESTS
            ),
            detail=(
                "Historical market data is temporarily "
                "unavailable because the provider request "
                "limit was reached."
            ),
        )

    time_series = data.get(
        "Time Series (Daily)"
    )

    if not time_series:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Daily market history not found",
        )

    return time_series


def save_daily_history(
    db: Session,
    stock: Stock,
    time_series: dict,
) -> list[MarketData]:
    """
    Saves daily Alpha Vantage candles that do not already exist.

    Existing rows are preserved, preventing duplicate daily records.
    """

    saved_records: list[MarketData] = []

    try:
        for timestamp, values in (
            time_series.items()
        ):
            price_timestamp = (
                datetime.fromisoformat(timestamp)
            )

            existing_record = (
                db.query(MarketData)
                .filter(
                    MarketData.stock_id
                    == stock.id,
                    MarketData.timeframe
                    == "daily",
                    MarketData.price_timestamp
                    == price_timestamp,
                )
                .first()
            )

            if existing_record:
                continue

            market_data = MarketData(
                stock_id=stock.id,
                timeframe="daily",
                open_price=Decimal(
                    values["1. open"]
                ),
                high_price=Decimal(
                    values["2. high"]
                ),
                low_price=Decimal(
                    values["3. low"]
                ),
                close_price=Decimal(
                    values["4. close"]
                ),
                volume=int(
                    values["5. volume"]
                ),
                price_timestamp=price_timestamp,
            )

            db.add(market_data)
            saved_records.append(market_data)

        db.commit()

        for record in saved_records:
            db.refresh(record)

        return saved_records

    except Exception:
        db.rollback()
        raise


def get_cached_market_history(
    db: Session,
    stock_id: int,
    timeframe: str,
) -> list[MarketData]:
    """
    Returns stored market history ordered from oldest to newest.
    """

    return (
        db.query(MarketData)
        .filter(
            MarketData.stock_id == stock_id,
            MarketData.timeframe == timeframe,
        )
        .order_by(
            MarketData.price_timestamp.asc()
        )
        .all()
    )


def refresh_market_data(
    db: Session,
    symbol: str,
) -> Stock:
    """
    Refreshes daily historical data for one symbol.

    Workflow:
        1. Fetch Alpha Vantage daily candles once.
        2. Use the newest closing price to update the Stock.
        3. Use Finnhub only when company metadata is missing.
        4. Save new historical candles.
    """

    clean_symbol = normalize_symbol(symbol)

    time_series = fetch_daily_history(
        clean_symbol
    )

    stock = get_or_update_stock(
        db=db,
        symbol=clean_symbol,
        time_series=time_series,
    )

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
    Returns historical market data from PostgreSQL when available.

    Alpha Vantage is contacted only when no saved history exists.
    """

    clean_symbol = normalize_symbol(symbol)

    if timeframe != "daily":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Only the daily timeframe is "
                "currently supported"
            ),
        )

    stock = get_stock_from_database(
        db=db,
        symbol=clean_symbol,
    )

    if stock is not None:
        existing_history = (
            get_cached_market_history(
                db=db,
                stock_id=stock.id,
                timeframe=timeframe,
            )
        )

        if existing_history:
            return existing_history

    stock = refresh_market_data(
        db=db,
        symbol=clean_symbol,
    )

    return get_cached_market_history(
        db=db,
        stock_id=stock.id,
        timeframe=timeframe,
    )


# =========================================================================
# TRENDING MARKET DATA
# =========================================================================


def parse_percentage(
    value: str,
) -> Decimal:
    """
    Converts an Alpha Vantage percentage string into Decimal.

    Example:
        "3.45%" -> Decimal("3.45")
    """

    cleaned_value = (
        str(value)
        .strip()
        .replace("%", "")
    )

    try:
        return Decimal(cleaned_value)

    except InvalidOperation as error:
        raise HTTPException(
            status_code=(
                status.HTTP_502_BAD_GATEWAY
            ),
            detail=(
                "The market data provider returned "
                "an invalid percentage value."
            ),
        ) from error


def parse_provider_timestamp(
    value: str | None,
) -> datetime | None:
    """
    Converts Alpha Vantage's trending timestamp into an aware datetime.

    Examples:
        2026-07-24 16:15:59 US/Eastern
        2026-07-24 20:15:59 UTC
    """

    if not value:
        return None

    clean_value = value.strip()

    timezone_value = timezone.utc

    if clean_value.endswith(
        " US/Eastern"
    ):
        clean_value = clean_value.replace(
            " US/Eastern",
            "",
        )

        timezone_value = ZoneInfo(
            "America/New_York"
        )

    elif clean_value.endswith(" UTC"):
        clean_value = clean_value.replace(
            " UTC",
            "",
        )

        timezone_value = timezone.utc

    formats = (
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d %H:%M",
    )

    for date_format in formats:
        try:
            parsed_datetime = datetime.strptime(
                clean_value,
                date_format,
            )

            return parsed_datetime.replace(
                tzinfo=timezone_value
            )

        except ValueError:
            continue

    return None


def save_trending_snapshot(
    db: Session,
    data: dict,
) -> str:
    """
    Saves a complete Alpha Vantage trending snapshot.

    Gainers, losers, and active stocks from the same provider response
    share one snapshot UUID.
    """

    snapshot_id = str(uuid4())

    provider_updated_at = (
        parse_provider_timestamp(
            data.get("last_updated")
        )
    )

    category_mapping = {
        "top_gainers": "GAINER",
        "top_losers": "LOSER",
        "most_actively_traded": "ACTIVE",
    }

    try:
        for (
            provider_key,
            category,
        ) in category_mapping.items():
            provider_items = data.get(
                provider_key,
                [],
            )

            for item in provider_items:
                trending_row = TrendingStock(
                    ticker=str(
                        item["ticker"]
                    ).strip().upper(),
                    category=category,
                    price=Decimal(
                        str(item["price"])
                    ),
                    change_amount=Decimal(
                        str(
                            item[
                                "change_amount"
                            ]
                        )
                    ),
                    change_percentage=(
                        parse_percentage(
                            item[
                                "change_percentage"
                            ]
                        )
                    ),
                    volume=int(
                        item["volume"]
                    ),
                    provider_updated_at=(
                        provider_updated_at
                    ),
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
    """

    latest_row = (
        db.query(TrendingStock)
        .order_by(
            TrendingStock.created_at.desc()
        )
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
        .order_by(
            TrendingStock.id.asc()
        )
        .all()
    )

    top_gainers: list[
        TrendingStockSchema
    ] = []

    top_losers: list[
        TrendingStockSchema
    ] = []

    most_active: list[
        TrendingStockSchema
    ] = []

    for row in snapshot_rows:
        response_item = TrendingStockSchema(
            ticker=row.ticker,
            price=str(row.price),
            change_amount=str(
                row.change_amount
            ),
            change_percentage=(
                f"{row.change_percentage}%"
            ),
            volume=str(row.volume),
        )

        if row.category == "GAINER":
            top_gainers.append(
                response_item
            )

        elif row.category == "LOSER":
            top_losers.append(
                response_item
            )

        elif row.category == "ACTIVE":
            most_active.append(
                response_item
            )

    return TrendingStocksResponse(
        last_updated=(
            latest_row.provider_updated_at.isoformat()
            if latest_row.provider_updated_at
            else latest_row.created_at.isoformat()
        ),
        metadata=(
            "Latest trending-market snapshot "
            "stored by FinSight."
        ),
        top_gainers=top_gainers,
        top_losers=top_losers,
        most_actively_traded=most_active,
    )


def fetch_trending_stocks(
    db: Session,
    force_refresh: bool = False,
) -> TrendingStocksResponse:
    """
    Returns persisted trending data when available.

    Alpha Vantage is contacted only when:
    - no saved snapshot exists; or
    - force_refresh=True.
    """

    if not force_refresh:
        saved_snapshot = (
            get_latest_trending_snapshot(db)
        )

        if saved_snapshot is not None:
            return saved_snapshot

    if not ALPHA_VANTAGE_API_KEY:
        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Alpha Vantage API key is not configured"
            ),
        )

    params = {
        "function": "TOP_GAINERS_LOSERS",
        "apikey": ALPHA_VANTAGE_API_KEY,
    }



    try:
        response = requests.get(
            ALPHA_VANTAGE_BASE_URL,
            params=params,
            timeout=20,
        )

        response.raise_for_status()
        data = response.json()

    except requests.Timeout as error:
        saved_snapshot = (
            get_latest_trending_snapshot(db)
        )

        if saved_snapshot is not None:
            return saved_snapshot

        raise HTTPException(
            status_code=(
                status.HTTP_504_GATEWAY_TIMEOUT
            ),
            detail=(
                "The trending-market provider "
                "took too long to respond."
            ),
        ) from error

    except requests.RequestException as error:
        saved_snapshot = (
            get_latest_trending_snapshot(db)
        )

        if saved_snapshot is not None:
            return saved_snapshot

        raise HTTPException(
            status_code=(
                status.HTTP_502_BAD_GATEWAY
            ),
            detail=(
                "Unable to retrieve trending "
                "market information."
            ),
        ) from error

    if "Information" in data or "Note" in data:
        saved_snapshot = (
            get_latest_trending_snapshot(db)
        )

        if saved_snapshot is not None:
            return saved_snapshot

        raise HTTPException(
            status_code=(
                status.HTTP_429_TOO_MANY_REQUESTS
            ),
            detail=(
                "Trending market information is "
                "temporarily unavailable."
            ),
        )

    if "Error Message" in data:
        raise HTTPException(
            status_code=(
                status.HTTP_502_BAD_GATEWAY
            ),
            detail=(
                "The trending-market provider "
                "rejected the request."
            ),
        )

    expected_keys = (
        "top_gainers",
        "top_losers",
        "most_actively_traded",
    )

    if not any(
        key in data
        for key in expected_keys
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_502_BAD_GATEWAY
            ),
            detail=(
                "The market data provider returned "
                "an unexpected trending response."
            ),
        )

    save_trending_snapshot(
        db=db,
        data=data,
    )

    return TrendingStocksResponse(
        last_updated=data.get(
            "last_updated"
        ),
        metadata=data.get("metadata"),
        top_gainers=[
            TrendingStockSchema(**item)
            for item in data.get(
                "top_gainers",
                [],
            )
        ],
        top_losers=[
            TrendingStockSchema(**item)
            for item in data.get(
                "top_losers",
                [],
            )
        ],
        most_actively_traded=[
            TrendingStockSchema(**item)
            for item in data.get(
                "most_actively_traded",
                [],
            )
        ],
    )