from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

# Load secret keys from .env file
load_dotenv()

SECRET     = os.getenv("JWT_SECRET")
ALGORITHM  = os.getenv("JWT_ALGORITHM", "HS256")
EXPIRE_MIN = int(os.getenv("JWT_EXPIRE_MINUTES", 60))

# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Convert plain password to hashed version — used on register
def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)

# Compare plain password with hashed version — used on login
def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# Create a JWT token with user data and expiry time
def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRE_MIN)
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)

# Decode and verify a JWT token — used in protected routes
def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET, algorithms=[ALGORITHM])