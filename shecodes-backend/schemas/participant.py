from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from .event import EventResponse

class ParticipantBase(BaseModel):
    event_id: int
    member_id: str # Should be string to match User.id
    status: Optional[str] = "registered"
    
    certificate_url: Optional[str] = None
    feedback: Optional[str] = None

class ParticipantCreate(ParticipantBase):
    # Add a default factory for the registration date
    registration_date: datetime = Field(default_factory=datetime.utcnow)

class ParticipantUpdate(BaseModel):
    status: str

class ParticipantResponse(ParticipantBase):
    id: int
    registration_date: datetime
    event: EventResponse
    
    model_config = ConfigDict(from_attributes=True)