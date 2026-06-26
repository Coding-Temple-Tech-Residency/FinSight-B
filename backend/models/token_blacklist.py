from sqlalchemy import Column, String, DateTime, Integer
from database import Base
from datetime import datetime

# Token blacklist — stores invalidated JWT tokens on logout
class TokenBlacklist(Base):
    __tablename__ = "token_blacklist"

    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)

    # The invalidated JWT token
    token = Column(String, unique=True, nullable=False)

    # When the token was blacklisted
    blacklisted_at = Column(DateTime, default=datetime.utcnow)