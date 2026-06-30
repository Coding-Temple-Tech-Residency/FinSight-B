import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()


class Config:
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL")

    # JWT
    JWT_SECRET = os.getenv("JWT_SECRET")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 60))

    # Alpha Vantage
    ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

    # Environment
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")


config = Config()