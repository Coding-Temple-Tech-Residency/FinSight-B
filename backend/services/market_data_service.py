import os
from datetime import datetime, timezone
from decimal import Decimal

import requests
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models.stock import Stock
from models.market_data import MarketData



ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
BASE_URL = "https://www.alphavantage.co/query"


import time
import requests
from fastapi import HTTPException, status


def fetch_daily_history(symbol: str) -> dict:
    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": symbol.strip().upper(),
        "outputsize": "compact",
        "apikey": ALPHA_VANTAGE_API_KEY,
    }

    last_error = None

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
            last_error = error

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

    stock = db.query(Stock).filter(
        Stock.symbol == symbol
    ).first()

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

        existing_record = db.query(MarketData).filter(
            MarketData.stock_id == stock.id,
            MarketData.timeframe == "daily",
            MarketData.price_timestamp == price_timestamp,
        ).first()

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