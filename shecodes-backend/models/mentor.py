from sqlalchemy import Column, Integer, String, Text, Enum
from database import Base
from sqlalchemy.orm import relationship

class Mentor(Base):
    __tablename__ = "mentors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    occupation = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    imageSrc = Column(String, nullable=False)
    story = Column(Text, nullable=False)

    instagram = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    status = Column(Enum("active", "inactive", name="mentor_status_enum"), default="active", nullable=False)
    
    events = relationship("Event", secondary="event_mentor_association", back_populates="mentors")