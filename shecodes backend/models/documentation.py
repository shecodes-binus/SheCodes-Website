from sqlalchemy import Column, Integer, String
from ..database import Base

class Documentation(Base):
    __tablename__ = "documentations"

    id = Column(Integer, primary_key=True, index=True)
    image_src = Column(String, nullable=False)