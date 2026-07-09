from datetime import datetime, date
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel


# Shape of data expected when adding a holding to portfolio
class HoldingCreate(BaseModel):
    symbol: str
    shares: Decimal
    average_buy_price: Decimal
    purchased_at: Optional[date] = None


# Shape of data expected when updating a holding
class HoldingUpdate(BaseModel):
    # All fields optional — user can update just one field
    shares: Optional[Decimal] = None
    average_buy_price: Optional[Decimal] = None
    purchased_at: Optional[date] = None


# Shape of data returned to the frontend
class HoldingResponse(BaseModel):
    id: int
    portfolio_id: int
    stock_id: int
    symbol: str
    company_name: str
    shares: Decimal
    average_buy_price: Decimal
    latest_price: Optional[Decimal] = None
    purchased_at: Optional[date] = None
    created_at: datetime

    class Config:
        from_attributes = True