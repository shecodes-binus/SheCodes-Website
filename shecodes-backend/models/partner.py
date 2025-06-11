from sqlalchemy import Column, Integer, String
from database import Base

class Partner(Base):
    __tablename__ = "partners"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    logo_src = Column(String, nullable=False)