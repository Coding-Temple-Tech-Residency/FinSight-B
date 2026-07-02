from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class MarketDataCreate(BaseModel):
    stock_id: int
    timeframe: str
    open_price: Decimal
    high_price: Decimal
    low_price: Decimal
    close_price: Decimal
    volume: int
    price_timestamp: datetime


class MarketDataResponse(BaseModel):
    id: int
    stock_id: int
    timeframe: str
    open_price: Decimal
    high_price: Decimal
    low_price: Decimal
    close_price: Decimal
    volume: int
    price_timestamp: datetime
    created_at: datetime

    class Config:
        from_attributes = True