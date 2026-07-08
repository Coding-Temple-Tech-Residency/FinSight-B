from sqlalchemy import Column, Integer, BigInteger, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

# Watchlist model — mirrors the watchlist table in Supabase
class Watchlist(Base):
    __tablename__ = "watchlist"

    # Primary key
    id = Column(BigInteger, primary_key=True, autoincrement=True)

    # Foreign key to users table
    user_id = Column(
        BigInteger,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    # Foreign key to stocks table
    stock_id = Column(
        BigInteger,
        ForeignKey("stocks.id", ondelete="CASCADE"),
        nullable=False
    )

    # Optional price alert for the stock
    alert_price = Column(Numeric(12, 2), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    # Relationships
    user = relationship("User", back_populates="watchlist")
    stock = relationship("Stock", back_populates="watchlist")