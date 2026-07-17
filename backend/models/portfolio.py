from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    currency = Column(String(10), default="USD")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    user = relationship("User", back_populates="portfolios")

    # One portfolio has many holdings
    holdings = relationship(
        "Holding",
        back_populates="portfolio",
        cascade="all, delete-orphan"
    )
    
    #One portfolio can have many AI insights
    ai_insights = relationship(
    "AIInsight",
    back_populates="portfolio",
    cascade="all, delete-orphan",
    )