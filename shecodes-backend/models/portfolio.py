from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class PortfolioProject(Base):
    __tablename__ = "portfolio_projects"

    id = Column(Integer, primary_key=True, index=True)
    
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="portfolio_projects")
    
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=False)
    project_url = Column(String, nullable=True)