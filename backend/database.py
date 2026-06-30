from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from config import config

# Create SQLAlchemy engine
engine = create_engine(
    config.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base class for all models
Base = declarative_base()


# Dependency used in FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()