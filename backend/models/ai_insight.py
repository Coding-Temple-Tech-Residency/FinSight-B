from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from enums.insight_type import InsightType
from enums.sentiment import Sentiment
from database import Base


class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(
    Integer,
    primary_key=True,
    index=True,
    autoincrement=True,
)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    portfolio_id = Column(
        Integer,
        ForeignKey("portfolios.id"),
        nullable=True,
    )

    stock_id = Column(
        Integer,
        ForeignKey("stocks.id"),
        nullable=True,
    )

    insight_type = Column(
    Enum(InsightType),
    nullable=False,
    )

    summary = Column(
        Text,
        nullable=False,
    )

    sentiment = Column(
        Enum(Sentiment),
        nullable=True,
    )

    source = Column(
        String(100),
        nullable=True,
    )

    expires_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    user = relationship(
        "User",
        back_populates="ai_insights",
    )

    portfolio = relationship(
        "Portfolio",
        back_populates="ai_insights",
    )

    stock = relationship(
        "Stock",
        back_populates="ai_insights",
    )