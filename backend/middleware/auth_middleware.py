from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, ExpiredSignatureError
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from auth import decode_token

# This tells FastAPI to look for a Bearer token in the Authorization header
security = HTTPBearer()

# The security guard function — used on any protected route
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    # Extract the token from the Authorization header
    token = credentials.credentials

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
        # Token exists but has expired after 60 minutes
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

    # Find the user in the database using the ID from the token
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is logged out"
        )

    # Return the user object to the route that requested it
    return user