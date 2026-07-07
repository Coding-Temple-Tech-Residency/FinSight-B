from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.user import UserResponse, UserUpdate

# Group all user routes under /api/users
router = APIRouter(prefix="/api/users", tags=["Users"])

# Issue #77 — Get current user profile
@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    # Returns the logged in user's profile information
    return current_user

# Issue #78 — Update current user profile
@router.put("/me", response_model=UserResponse)
def update_current_user(
    body: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Update only fields that were provided
    if body.first_name is not None:
        current_user.first_name = body.first_name
    if body.last_name is not None:
        current_user.last_name = body.last_name
    if body.email is not None:
        # Check if new email is already taken by another user
        existing = db.query(User).filter(
            User.email == body.email,
            User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already in use"
            )
        current_user.email = body.email

    db.commit()
    db.refresh(current_user)
    return current_user

# Issue #79 — Delete current user account
@router.delete("/me", status_code=status.HTTP_200_OK)
def delete_current_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Soft delete — set is_active to False instead of removing from database
    current_user.is_active = False
    db.commit()
    return {"message": "Account deleted successfully"}