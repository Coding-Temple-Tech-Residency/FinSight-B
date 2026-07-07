from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from jose import JWTError, ExpiredSignatureError
from database import get_db
from models.user import User
from models.token_blacklist import TokenBlacklist
from utils.security import decode_token

security = HTTPBearer()

# The security guard function — used on any protected route
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    # Check if token has been blacklisted — invalidated on logout
    blacklisted = db.query(TokenBlacklist).filter(
        TokenBlacklist.token == token
    ).first()

    if blacklisted:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been invalidated — please log in again"
        )

    try:
        # Decode and verify the token using our secret key
        payload = decode_token(token)

        # Get the user ID from the token payload
        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token — no user ID found"
            )

    except ExpiredSignatureError:
        # Token exists but has expired
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired — please log in again"
        )

    except JWTError:
        # Token is invalid or has been tampered with
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token — please log in again"
        )

    # Find the user in the database
    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    # Check if account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is logged out"
        )

    return user