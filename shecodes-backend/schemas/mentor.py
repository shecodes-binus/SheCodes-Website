from pydantic import BaseModel, ConfigDict
from typing import Optional, Literal

class MentorBase(BaseModel):
    name: str
    occupation: str
    description: str
    imageSrc: str
    story: str
    instagram: Optional[str] = None
    linkedin: Optional[str] = None
    status: Literal['active', 'inactive']

class MentorCreate(MentorBase):
    pass

class MentorUpdate(MentorBase):
    pass

class MentorResponse(MentorBase):
    id: int
    model_config = ConfigDict(from_attributes=True)