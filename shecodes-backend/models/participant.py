from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum, String
from datetime import datetime
from database import Base
from sqlalchemy.orm import relationship

class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    member_id = Column(String, ForeignKey("users.id"), nullable=False) 
    registration_date = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum("registered", "attended", "cancelled", name="participant_status_enum"), default="registered")
    
    certificate_url = Column(String, nullable=True) 
    feedback = Column(String, nullable=True)

    event = relationship("Event", back_populates="participants")
    user = relationship("User", back_populates="participations")