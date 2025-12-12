"""Pydantic models for authentication API."""

from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    """Request model for user signup."""

    email: EmailStr = Field(..., description="User's email address")
    name: str = Field(..., min_length=1, max_length=100, description="User's display name")
    password: str = Field(
        ..., min_length=8, description="Password (min 8 chars, 1 upper, 1 lower, 1 number)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "email": "sarah@example.com",
                "name": "Sarah Johnson",
                "password": "SecurePass123!",
            }
        }


class SigninRequest(BaseModel):
    """Request model for user signin."""

    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")

    class Config:
        json_schema_extra = {"example": {"email": "sarah@example.com", "password": "SecurePass123!"}}


class AuthResponse(BaseModel):
    """Response model for authentication (includes JWT token)."""

    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    user_id: str = Field(..., description="User's UUID")
    email: str = Field(..., description="User's email")
    name: str = Field(..., description="User's display name")

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "sarah@example.com",
                "name": "Sarah Johnson",
            }
        }
