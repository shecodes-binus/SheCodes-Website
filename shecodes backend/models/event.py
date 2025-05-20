from sqlalchemy import Column, Integer, String, Enum, DateTime, Text
from ..database import Base
from datetime import datetime

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    event_type = Column(Enum("Workshop", "Seminar", "Webinar", name="event_type_enum"), nullable=False)
    date = Column(DateTime, nullable=False)
    location = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
