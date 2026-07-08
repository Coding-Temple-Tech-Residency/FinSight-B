from pydantic import BaseModel, EmailStr, model_validator

# Shape of data expected when a user registers
class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    confirm_password: str

    # Validate that both passwords match before registering
    @model_validator(mode='after')
    def passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError('Passwords do not match')
        return self

# Shape of data expected when a user logs in
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Shape of data returned after successful login
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"