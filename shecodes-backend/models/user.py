# /shecodes-backend/models/user.py (Corrected)

from sqlalchemy import Column, String, Enum, Boolean, DateTime, Text, Date
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    # Core Auth Fields
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False) # Hashed password
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Synced with Frontend `Member` and `User` types
    name = Column(String, nullable=False)
    role = Column(Enum("mentor", "admin", "member", "alumni", name="role_enum"), nullable=False, default="member")
    about_me = Column(Text, nullable=True)
    birth_date = Column(Date, nullable=True)
    gender = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    occupation = Column(String, nullable=True)
    cv_link = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    
    # Relationships
    participations = relationship("Participant", back_populates="user")