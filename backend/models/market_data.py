from sqlalchemy import Column, Integer, String, DateTime, Numeric, BigInteger, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class MarketData(Base):
    __tablename__ = "market_data"

    id = Column(Integer, primary_key=True, index=True)

    stock_id = Column(
        Integer,
        ForeignKey("stocks.id", ondelete="CASCADE"),
        nullable=False
    )

    timeframe = Column(String(20), nullable=False)

    open_price = Column(Numeric(12, 2), nullable=False)
    high_price = Column(Numeric(12, 2), nullable=False)
    low_price = Column(Numeric(12, 2), nullable=False)
    close_price = Column(Numeric(12, 2), nullable=False)

    volume = Column(BigInteger, nullable=False)

    price_timestamp = Column(DateTime(timezone=True), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    stock = relationship("Stock", back_populates="market_data")