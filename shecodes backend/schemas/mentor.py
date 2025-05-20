from pydantic import BaseModel
from typing import Optional

class MentorBase(BaseModel):
    name: str
    occupation: str
    description: str
    imageSrc: str
    story: str

class MentorCreate(MentorBase):
    pass

class MentorUpdate(MentorBase):
    pass

class MentorResponse(MentorBase):
    id: int

    class Config:
        orm_mode = True
