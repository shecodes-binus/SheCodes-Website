from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class ParticipantBase(BaseModel):
    event_id: int
    member_id: str # Should be string to match User.id
    status: Optional[str] = "registered"

class ParticipantCreate(ParticipantBase):
    # Add a default factory for the registration date
    registration_date: datetime = Field(default_factory=datetime.utcnow)

class ParticipantUpdate(BaseModel):
    status: str

class ParticipantResponse(ParticipantBase):
    id: int
    registration_date: datetime
    
    model_config = ConfigDict(from_attributes=True)