from sqlalchemy import Column, Integer, String, Text
from database import Base

class PortfolioProject(Base):
    __tablename__ = "portfolio_projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    imageUrl = Column(String, nullable=False)
    projectUrl = Column(String, nullable=True)