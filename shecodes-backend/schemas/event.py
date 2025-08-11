# /shecodes-backend/schemas/event.py

from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from enum import Enum
from datetime import datetime
from .mentor import MentorResponse

class SkillBase(BaseModel):
    title: str
    description: str

class SkillCreate(SkillBase):
    pass

class SkillUpdate(SkillBase):
    id: Optional[int] = None # ID is needed for updates

class SkillResponse(SkillBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class BenefitBase(BaseModel):
    title: str
    text: str

class BenefitCreate(BenefitBase):
    pass

class BenefitUpdate(BenefitBase):
    id: Optional[int] = None # ID is needed for updates

class BenefitResponse(BenefitBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class SessionBase(BaseModel):
    topic: str
    description: str
    start: datetime
    end: datetime

class SessionCreate(SessionBase):
    pass

class SessionUpdate(SessionBase):
    id: Optional[int] = None # ID is needed for updates

class SessionResponse(SessionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class EventTypeEnum(str, Enum):
    Workshop = "Workshop"
    Seminar = "Seminar"
    Webinar = "Webinar"
    Mentorship = "Mentorship"
    # Added values from the frontend to ensure consistency
    Conference = "Conference"
    Hackathon = "Hackathon"

class EventStatusEnum(str, Enum):
    upcoming = "upcoming"
    past = "past"
    ongoing = "ongoing"

class EventBase(BaseModel):
    title: str
    description: str
    event_type: EventTypeEnum
    location: str
    start_date: datetime
    end_date: datetime
    status: EventStatusEnum = EventStatusEnum.upcoming
    
    image_src: Optional[str] = None
    image_alt: Optional[str] = None
    tags: Optional[List[str]] = None
    long_description: Optional[str] = None
    register_link: Optional[str] = None
    tools: Optional[List[Any]] = None # This will accept the frontend payload
    key_points: Optional[List[str]] = None
    group_link: Optional[str] = None

class EventCreate(EventBase):
    tools: Optional[List[str]] = []
    mentors: List[int] = [] # List of mentor IDs
    skills: List[SkillCreate] = []
    benefits: List[BenefitCreate] = []
    sessions: List[SessionCreate] = []

class EventUpdate(EventBase):
    # For updating, relationships are handled separately
    tools: Optional[List[str]] = None
    mentors: Optional[List[int]] = None
    skills: Optional[List[SkillUpdate]] = None
    benefits: Optional[List[BenefitUpdate]] = None
    sessions: Optional[List[SessionUpdate]] = None

class EventResponse(EventBase):
    id: int
    created_at: datetime
    mentors: List[MentorResponse] = []
    skills: List[SkillResponse] = []
    benefits: List[BenefitResponse] = []
    sessions: List[SessionResponse] = []
    
    model_config = ConfigDict(from_attributes=True)