from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get the database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the connection to the database
engine = create_engine(DATABASE_URL)

# Create a session factory — each request gets its own session
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Base class that all models will inherit from
Base = declarative_base()

# Dependency — opens a database session and closes it after each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()