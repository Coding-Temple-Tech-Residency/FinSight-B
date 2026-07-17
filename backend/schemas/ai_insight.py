from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from enums.insight_type import InsightType
from enums.sentiment import Sentiment


class AIInsightCreate(BaseModel):
    portfolio_id: Optional[int] = None
    stock_id: Optional[int] = None

    insight_type: InsightType

    summary: str = Field(
        ...,
        min_length=1,
        max_length=5000,
    )

    sentiment: Optional[Sentiment] = None
    source: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    expires_at: Optional[datetime] = None


class AIInsightUpdate(BaseModel):
    portfolio_id: Optional[int] = None
    stock_id: Optional[int] = None

    insight_type: Optional[InsightType] = None

    summary: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=5000,
    )

    sentiment: Optional[Sentiment] = None
    source: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    expires_at: Optional[datetime] = None


class AIInsightResponse(BaseModel):
    id: int
    user_id: int

    portfolio_id: Optional[int] = None
    stock_id: Optional[int] = None

    insight_type: InsightType
    summary: str
    sentiment: Optional[Sentiment] = None
    source: Optional[str] = None
    expires_at: Optional[datetime] = None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True