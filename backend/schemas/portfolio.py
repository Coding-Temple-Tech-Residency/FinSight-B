from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PortfolioCreate(BaseModel):
    name: str
    description: Optional[str] = None
    currency: str = "USD"


class PortfolioUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    currency: str = "USD"


class PortfolioResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str] = None
    currency: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True