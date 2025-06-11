from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any, Literal
from enum import Enum
from datetime import datetime
from .mentor import MentorResponse

class SkillBase(BaseModel):
    title: str
    description: str

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class BenefitBase(BaseModel):
    title: str
    text: str

class BenefitCreate(BenefitBase):
    pass

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

class SessionResponse(SessionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class EventTypeEnum(str, Enum):
    Workshop = "Workshop"
    Seminar = "Seminar"
    Webinar = "Webinar"
    Mentorship = "Mentorship"

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
    status: EventStatusEnum
    imageSrc: Optional[str] = None
    image_alt: Optional[str] = None
    tags: Optional[List[str]] = None
    longDescription: Optional[str] = None
    registerLink: Optional[str] = None
    tools: Optional[List[Any]] = None
    key_points: Optional[List[str]] = None
    groupLink: Optional[str] = None

class EventCreate(EventBase):
    mentors: List[int] = []
    skills: List[SkillCreate] = []
    benefits: List[BenefitCreate] = []
    sessions: List[SessionCreate] = []

class EventUpdate(EventBase):
    pass

class EventResponse(EventBase):
    id: int
    created_at: datetime
    mentors: List[MentorResponse] = []
    skills: List[SkillResponse] = []
    benefits: List[BenefitResponse] = []
    sessions: List[SessionResponse] = []
    model_config = ConfigDict(from_attributes=True)