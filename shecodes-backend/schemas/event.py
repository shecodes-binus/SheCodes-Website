from pydantic import BaseModel
from typing import Optional, List
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
    class Config:
        orm_mode = True

class BenefitBase(BaseModel):
    title: str
    text: str

class BenefitCreate(BenefitBase):
    pass

class BenefitResponse(BenefitBase):
    id: int
    class Config:
        orm_mode = True

class SessionBase(BaseModel):
    topic: str
    description: str
    start: datetime
    end: datetime

class SessionCreate(SessionBase):
    pass

class SessionResponse(SessionBase):
    id: int
    class Config:
        orm_mode = True


class EventTypeEnum(str, Enum):
    Workshop = "Workshop"
    Seminar = "Seminar"
    Webinar = "Webinar"

class EventBase(BaseModel):
    title: str
    description: str
    event_type: EventTypeEnum
    location: str
    start_date: datetime
    end_date: datetime
    tools: str
    key_points: str

class EventCreate(EventBase):
    mentors: List[int]
    skills: List[SkillCreate]
    benefits: List[BenefitCreate]
    sessions: List[SessionCreate]

class EventUpdate(EventBase):
    title: Optional[str]
    description: Optional[str]
    event_type: Optional[EventTypeEnum]
    location: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    tools: Optional[str]
    key_points: Optional[str]

class EventResponse(EventBase):
    id: int
    created_at: datetime
    mentors: List[MentorResponse]
    skills: List[SkillResponse]
    benefits: List[BenefitResponse]
    sessions: List[SessionResponse]

    class Config:
        orm_mode = True