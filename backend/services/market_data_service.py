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

# Fetches the latest stock quote for a given symbol from the Alpha Vantage API
def fetch_global_quote(symbol: str) -> dict:
    params = {
        "function": "GLOBAL_QUOTE",
        "symbol": symbol.upper(),
        "apikey": ALPHA_VANTAGE_API_KEY,
    }

    response = requests.get(BASE_URL, params=params, timeout=10)
    data = response.json()

    quote = data.get("Global Quote")

    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock quote not found"
        )

    return quote

# Retrieves an existing stock from the database or fetches and updates it if not present
def get_or_update_stock(db: Session, symbol: str) -> Stock:
    symbol = symbol.upper()

    quote = fetch_global_quote(symbol)

    stock = db.query(Stock).filter(
        Stock.symbol == symbol
    ).first()

    latest_price = Decimal(quote["05. price"])

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

# Fetches intraday market history for a given stock symbol and interval from the Alpha Vantage API
def fetch_intraday_history(symbol: str, interval: str = "5min") -> dict:
    params = {
        "function": "TIME_SERIES_INTRADAY",
        "symbol": symbol.upper(),
        "interval": interval,
        "outputsize": "compact",
        "apikey": ALPHA_VANTAGE_API_KEY,
    }

    response = requests.get(BASE_URL, params=params, timeout=10)
    data = response.json()

    time_series_key = f"Time Series ({interval})"
    time_series = data.get(time_series_key)

    if not time_series:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Market history not found"
        )

    return time_series

# Saves intraday market history for a given stock in the database
def save_intraday_history(
    db: Session,
    stock: Stock, 
    symbol: str,
    interval: str = "5min"
):
    time_series = fetch_intraday_history(symbol, interval)

    saved_records = []

    for timestamp, values in time_series.items():
        market_data = MarketData(
            stock_id=stock.id,
            timeframe="intraday",
            open_price=Decimal(values["1. open"]),
            high_price=Decimal(values["2. high"]),
            low_price=Decimal(values["3. low"]),
            close_price=Decimal(values["4. close"]),
            volume=int(values["5. volume"]),
            price_timestamp=datetime.fromisoformat(timestamp),
        )

        db.add(market_data)
        saved_records.append(market_data)

    db.commit()

    return saved_records