from pydantic import BaseModel, EmailStr, Field, ConfigDict
from enum import Enum
from typing import Optional
from datetime import datetime, date

class RoleEnum(str, Enum):
    mentor = "mentor"
    admin = "admin"
    member = "member"
    alumni = "alumni"

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: RoleEnum = RoleEnum.member
    about_me: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    occupation: Optional[str] = None
    cv_link: Optional[str] = None
    linkedin: Optional[str] = None
    profile_picture: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[RoleEnum] = None
    about_me: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    occupation: Optional[str] = None
    cv_link: Optional[str] = None
    linkedin: Optional[str] = None
    profile_picture: Optional[str] = None

class UserResponse(UserBase):
    id: str
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)