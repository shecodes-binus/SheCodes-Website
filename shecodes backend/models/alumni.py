from sqlalchemy import Column, Integer, String, Text
from ..database import Base

class Alumni(Base):
    __tablename__ = "alumni"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    batch = Column(Integer, nullable=False)
    imageSrc = Column(String, nullable=False)
    story = Column(Text, nullable=False)
