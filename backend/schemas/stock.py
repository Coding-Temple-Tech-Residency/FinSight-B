from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel



class StockResponse(BaseModel):
    id: int
    symbol: str
    company_name: str
    company_logo_url: Optional[str] = None
    exchange: Optional[str] = None
    sector: Optional[str] = None
    industry: Optional[str] = None
    latest_price: Optional[Decimal] = None
    last_refreshed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True