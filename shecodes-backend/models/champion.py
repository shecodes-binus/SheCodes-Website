from sqlalchemy import Column, Integer, String, Text
from database import Base

class Champion(Base):
    __tablename__ = "champions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    position = Column(String, nullable=False)
    image_src = Column(String, nullable=False)
    description = Column(Text, nullable=True)