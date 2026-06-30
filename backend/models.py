from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    Text,
    DateTime,
    Numeric,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    portfolios = relationship("Portfolio", back_populates="user")
    watchlist_items = relationship("Watchlist", back_populates="user")
    ai_insights = relationship("AIInsight", back_populates="user")


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    name = Column(String(100), nullable=False)
    description = Column(Text)
    currency = Column(String(10), default="USD")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    user = relationship("User", back_populates="portfolios")
    holdings = relationship(
        "Holding",
        back_populates="portfolio",
        cascade="all, delete-orphan",
    )


class Holding(Base):
    __tablename__ = "holdings"

    id = Column(Integer, primary_key=True, index=True)

    portfolio_id = Column(
        Integer,
        ForeignKey("portfolios.id", ondelete="CASCADE"),
        nullable=False,
    )

    symbol = Column(String(20), nullable=False)
    company_name = Column(String(255), nullable=False)
    company_logo_url = Column(Text)

    shares = Column(Numeric(12, 4), nullable=False)
    average_buy_price = Column(Numeric(12, 2), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    portfolio = relationship("Portfolio", back_populates="holdings")


class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    symbol = Column(String(20), nullable=False)
    company_name = Column(String(255), nullable=False)
    company_logo_url = Column(Text)

    alert_price = Column(Numeric(12, 2))

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="watchlist_items")


class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    portfolio_id = Column(
        Integer,
        ForeignKey("portfolios.id", ondelete="CASCADE"),
        nullable=True,
    )

    symbol = Column(String(20))

    insight_type = Column(String(100))
    summary = Column(Text)

    sentiment = Column(String(50))
    source = Column(String(255))

    expires_at = Column(DateTime(timezone=True))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    user = relationship("User", back_populates="ai_insights")