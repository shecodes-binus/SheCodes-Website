from sqlalchemy import Column, Integer, String, Enum, Boolean, DateTime
from ..database import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    role = Column(Enum("mentor", "admin", "member", "alumni", name="role_enum"), nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    verification_code = Column(Integer, nullable=True)
    is_verified = Column(Boolean, default=False)
    verification_expires = Column(DateTime, nullable=True)
    refresh_token = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)

# SUBJECT TO CHANGE