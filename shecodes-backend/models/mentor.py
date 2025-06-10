from sqlalchemy import Column, Integer, String, Text
from database import Base

class Mentor(Base):
    __tablename__ = "mentors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    occupation = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    imageSrc = Column(String, nullable=False)
    story = Column(Text, nullable=False)
