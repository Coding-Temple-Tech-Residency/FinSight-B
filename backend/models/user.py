from sqlalchemy import Column, String, Boolean, DateTime, BigInteger
from database import Base
from datetime import datetime

# User model — mirrors the users table in Supabase exactly
class User(Base):
    __tablename__ = "users"

    # Primary key — bigint to match Supabase int8
    id = Column(BigInteger, primary_key=True, autoincrement=True)

    # User's full name
    full_name = Column(String, nullable=False)

    # Email must be unique — no duplicate accounts
    email = Column(String, unique=True, nullable=False)

    # Stores the hashed password — never plain text
    password = Column(String, nullable=False)

    # Soft delete — False means account is deactivated not deleted
    is_active = Column(Boolean, default=True)

    # Automatically set when the account is created
    created_at = Column(DateTime, default=datetime.utcnow)

    # Automatically updates when account details change
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)