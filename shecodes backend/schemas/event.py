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
