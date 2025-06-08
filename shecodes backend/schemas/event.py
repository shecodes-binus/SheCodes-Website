from pydantic import BaseModel
from enum import Enum
from datetime import datetime

class EventTypeEnum(str, Enum):
    Workshop = "Workshop"
    Seminar = "Seminar"
    Webinar = "Webinar"

class EventBase(BaseModel):
    title: str
    description: str
    event_type: EventTypeEnum
    location: str
    date: datetime

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    pass

class EventResponse(EventBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

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
