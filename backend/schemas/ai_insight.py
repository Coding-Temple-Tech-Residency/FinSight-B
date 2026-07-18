from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from enums.insight_type import InsightType
from enums.sentiment import Sentiment


class AIChatRequest(BaseModel):
    """
    Request body for the general FinSight chat.

    The frontend sends only the user's message.
    Portfolio data is loaded securely by the backend from the database.
    """

    message: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="The user's question for the FinSight assistant.",
        examples=[
            "How could I improve the diversification of my portfolios?"
        ],
    )


class AIInsightCreate(BaseModel):
    """
    Request schema for manually creating an AI insight record.

    This can remain available for testing or administrative workflows,
    but it is not used by the automated OpenAI generation endpoints.
    """

    # A general insight may not belong to any portfolio.
    portfolio_id: Optional[int] = None

    # A portfolio or market insight may not belong to one stock.
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
    """
    Request schema for partially updating an existing insight.

    Every field is optional because the endpoint supports partial
    changes through model_dump(exclude_unset=True).
    """

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
    """
    Standard response returned for stored AI insights.
    """

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
        # Allows Pydantic to serialize SQLAlchemy model instances.
        from_attributes = True