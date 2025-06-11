from pydantic import BaseModel, ConfigDict
from typing import Optional

class ChampionBase(BaseModel):
    name: str
    position: str
    imageSrc: str
    description: Optional[str] = None

class ChampionCreate(ChampionBase):
    pass

class ChampionUpdate(ChampionBase):
    pass

class ChampionResponse(ChampionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)