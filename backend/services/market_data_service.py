import os
import time
from datetime import datetime, timezone
from decimal import Decimal

import requests
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models.market_data import MarketData
from models.stock import Stock


ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
BASE_URL = "https://www.alphavantage.co/query"


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


def get_or_update_stock(
    db: Session,
    symbol: str,
    time_series: dict | None = None,
) -> Stock:
    symbol = symbol.strip().upper()

    if time_series is None:
        time_series = fetch_daily_history(symbol)

    latest_timestamp = max(time_series.keys())
    latest_values = time_series[latest_timestamp]
    latest_price = Decimal(latest_values["4. close"])

    stock = (
        db.query(Stock)
        .filter(Stock.symbol == symbol)
        .first()
    )

    if stock:
        stock.latest_price = latest_price
        stock.last_refreshed_at = datetime.now(timezone.utc)
    else:
        stock = Stock(
            symbol=symbol,
            company_name=symbol,
            latest_price=latest_price,
            last_refreshed_at=datetime.now(timezone.utc),
        )
        db.add(stock)

    db.commit()
    db.refresh(stock)

    return stock


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