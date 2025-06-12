# /shecodes-backend/schemas/user.py (Modified for Simple Registration)

from pydantic import BaseModel, EmailStr, Field, ConfigDict
from enum import Enum
from typing import Optional, List
from datetime import datetime, date
from .participant import ParticipantResponse

# --- User Role Definition ---
class RoleEnum(str, Enum):
    mentor = "mentor"
    admin = "admin"
    member = "member"
    alumni = "alumni"

# --- Main User Schemas ---
class UserBase(BaseModel):
    """
    Defines all user fields, most of which are optional for profile completion later.
    """
    email: EmailStr
    name: str
    
    # These fields are optional and can be filled in after registration
    role: RoleEnum = RoleEnum.member # Default role for new sign-ups
    about_me: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    occupation: Optional[str] = None
    cv_link: Optional[str] = None
    linkedin: Optional[str] = None
    profile_picture: Optional[str] = None

class UserCreate(BaseModel):
    """
    Schema for creating a new user. ONLY requires the essentials.
    This schema is what the /auth/register endpoint will expect.
    """
    email: EmailStr
    name: str
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    """
    Schema for updating a user's profile. All fields are optional.
    """
    name: Optional[str] = None
    role: Optional[RoleEnum] = None # Admins might be able to change this
    about_me: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    occupation: Optional[str] = None
    cv_link: Optional[str] = None
    linkedin: Optional[str] = None
    # Note: Updating profile picture is handled by a separate endpoint.

# --- Password Reset Schemas ---
class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str = Field(..., description="The password reset token from the email link.")
    new_password: str = Field(..., min_length=8)

# --- Response Schema ---
# This remains the same, as it shows the full user object from the database.
class UserResponse(UserBase):
    id: str
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    participations: List[ParticipantResponse] = [] 
    model_config = ConfigDict(from_attributes=True)
    
class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)