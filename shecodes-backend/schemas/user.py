from pydantic import BaseModel
from enum import Enum
from typing import Optional
from datetime import datetime

class RoleEnum(str, Enum):
    mentor = "mentor"
    admin = "admin"
    member = "member"
    alumni = "alumni"

class UserBase(BaseModel):
    name: str
    role: RoleEnum
    email: str
    profile_picture: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserResponse(UserBase):
    id: str
    is_verified: bool
    created_at: datetime

    class Config:
        orm_mode = True