from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class Stock(Base):
    __tablename__ = "stocks"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # Stock ticker used by the market-data provider.
    #
    # Examples:
    # - AAPL
    # - MSFT
    # - BMW.DEX
    symbol = Column(
        String(20),
        unique=True,
        nullable=False,
        index=True,
    )

    # Full official company or asset name.
    #
    # Examples:
    # - Apple Inc.
    # - Microsoft Corporation
    company_name = Column(
        String(255),
        nullable=False,
    )

    company_logo_url = Column(
        Text,
        nullable=True,
    )

    exchange = Column(
        String(50),
        nullable=True,
    )

    sector = Column(
        String(100),
        nullable=True,
    )

    industry = Column(
        String(100),
        nullable=True,
    )

    # Native currency in which this stock's market price is quoted.
    #
    # Examples:
    # - AAPL -> USD
    # - BMW.DEX -> EUR
    # - SHOP.TRT -> CAD
    #
    # This is separate from a holding's purchase_currency. A user may,
    # for example, record an AAPL purchase in EUR even though AAPL itself
    # is quoted in USD.
    currency = Column(
        String(3),
        nullable=False,
        default="USD",
        server_default="USD",
    )

    # Latest price in the stock's native currency.
    latest_price = Column(
        Numeric(12, 2),
        nullable=True,
    )

    last_refreshed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    market_data = relationship(
        "MarketData",
        back_populates="stock",
        cascade="all, delete-orphan",
    )

    watchlist = relationship(
        "Watchlist",
        back_populates="stock",
        cascade="all, delete-orphan",
    )

    # One stock can appear in holdings across many portfolios.
    holdings = relationship(
        "Holding",
        back_populates="stock",
        cascade="all, delete-orphan",
    )

    # One stock can have many AI-generated insights.
    ai_insights = relationship(
        "AIInsight",
        back_populates="stock",
        cascade="all, delete-orphan",
    )