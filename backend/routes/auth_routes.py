from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.user import RegisterRequest, LoginRequest, TokenResponse
from auth import hash_password, verify_password, create_token
from middleware.auth_middleware import get_current_user


# Group all auth routes under /api/auth
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Issue #7 — User Registration
@router.post("/register", status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    # Check if email already exists — reject duplicates
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user with hashed password — never store plain text
    user = User(
        full_name=body.full_name,
        email=body.email,
        password=hash_password(body.password)
    )
    db.add(user)
    db.commit()
    return {"message": "Account created successfully"}

# Issue #8 — User Login
@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    # Find user by email
    user = db.query(User).filter(User.email == body.email).first()
    
    # Reject if user not found or password is wrong
    if not user or not verify_password(body.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate JWT token with user info
    token = create_token({"sub": str(user.id), "email": user.email})
    return {"access_token": token, "token_type": "bearer"}

# Issue #9 — Logout
@router.post("/logout")
def logout():
    # JWT is stateless — client deletes the token on their side
    return {"message": "Logged out successfully"}

# Test protected route — proves middleware works — Issue #9
@router.get("/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    # Only reaches here if JWT token is valid
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "is_active": current_user.is_active
    }