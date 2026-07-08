from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel


# Shape of data expected when adding a stock to watchlist
class WatchlistCreate(BaseModel):
    symbol: str
    alert_price: Optional[Decimal] = None


# Shape of data expected when updating watchlist item
class WatchlistUpdate(BaseModel):
    alert_price: Optional[Decimal] = None


# Shape of data returned to the frontend
class WatchlistResponse(BaseModel):
    id: int
    user_id: int
    stock_id: int
    symbol: str
    company_name: str
    alert_price: Optional[Decimal] = None
    latest_price: Optional[Decimal] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True