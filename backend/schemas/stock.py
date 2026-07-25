from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class StockResponse(BaseModel):
    """
    Complete stock information returned by FinSight.
    """

    id: int
    symbol: str
    company_name: str

    company_logo_url: str | None = None
    exchange: str | None = None
    sector: str | None = None
    industry: str | None = None
    currency: str | None = None

    latest_price: Decimal | None = None
    last_refreshed_at: datetime | None = None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True