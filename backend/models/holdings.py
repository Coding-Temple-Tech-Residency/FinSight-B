from sqlalchemy import Column, Integer, BigInteger, Numeric, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

# Holdings model — mirrors the holdings table in Supabase
class Holding(Base):
    __tablename__ = "holdings"

    # Primary key
    id = Column(BigInteger, primary_key=True, autoincrement=True)

    # Foreign key to portfolios table
    portfolio_id = Column(
        BigInteger,
        ForeignKey("portfolios.id", ondelete="CASCADE"),
        nullable=False
    )

    # Foreign key to stocks table
    stock_id = Column(
        BigInteger,
        ForeignKey("stocks.id", ondelete="CASCADE"),
        nullable=False
    )

    # Number of shares owned
    shares = Column(Numeric(12, 4), nullable=False)

    # Average price paid per share
    average_buy_price = Column(Numeric(12, 2), nullable=False)

    # Date the stock was purchased
    purchased_at = Column(Date, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    portfolio = relationship("Portfolio", back_populates="holdings")
    stock = relationship("Stock", back_populates="holdings")