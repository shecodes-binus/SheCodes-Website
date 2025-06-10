from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum
from datetime import datetime
from database import Base
from sqlalchemy.orm import relationship

class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    registration_date = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum("registered", "attended", "cancelled", name="participant_status_enum"), default="registered")

    event = relationship("Event", backref="participants")
    member = relationship("Member", backref="participations")