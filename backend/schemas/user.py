from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


# Shape of data returned to the frontend for user profile
class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Shape of data expected when updating user profile
class UserUpdate(BaseModel):
    # All fields optional — user can update just one field
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None