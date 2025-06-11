from pydantic import BaseModel, ConfigDict
from typing import Optional

class PortfolioProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    imageUrl: str
    projectUrl: Optional[str] = None

class PortfolioProjectCreate(PortfolioProjectBase):
    pass

class PortfolioProjectUpdate(PortfolioProjectBase):
    pass

class PortfolioProjectResponse(PortfolioProjectBase):
    id: int
    model_config = ConfigDict(from_attributes=True)