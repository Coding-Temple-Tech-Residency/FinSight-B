from sqlalchemy import Column, Integer, String, Text, DateTime, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)

    symbol = Column(String(20), unique=True, nullable=False, index=True)
    company_name = Column(String(255), nullable=False)
    company_logo_url = Column(Text, nullable=True)

    exchange = Column(String(50), nullable=True)
    sector = Column(String(100), nullable=True)
    industry = Column(String(100), nullable=True)

    latest_price = Column(Numeric(12, 2), nullable=True)
    last_refreshed_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    market_data = relationship(
        "MarketData",
        back_populates="stock",
        cascade="all, delete-orphan"
    )

    watchlist = relationship(
        "Watchlist",
        back_populates="stock",
        cascade="all, delete-orphan"
    )