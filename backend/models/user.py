from sqlalchemy import Column, String, Boolean, DateTime, BigInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

# User model — mirrors the users table in Supabase exactly
class User(Base):
    __tablename__ = "users"

    # Primary key — bigint to match Supabase int8
    id = Column(BigInteger, primary_key=True, autoincrement=True)

    # User's first name
    first_name = Column(String, nullable=False)

    # User's last name
    last_name = Column(String, nullable=False)

    # Email must be unique — no duplicate accounts
    email = Column(String, unique=True, nullable=False)

    # Stores the hashed password — never plain text
    password = Column(String, nullable=False)

    # Soft delete — False means account is deactivated not deleted
    is_active = Column(Boolean, default=True)

    # Automatically set when the account is created
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Automatically updates when account details change
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    portfolios = relationship("Portfolio", back_populates="user")

    watchlist = relationship(
        "Watchlist",
        back_populates="user",
        cascade="all, delete-orphan"
    )