from pydantic import BaseModel
from typing import Literal

class ContactCardInfoBase(BaseModel):
    platformName: str
    logoSrc: str
    description: str
    linkUrl: str
    colorVariant: Literal['pink', 'blue']

class ContactCardInfoCreate(ContactCardInfoBase):
    pass

class ContactCardInfoUpdate(ContactCardInfoBase):
    pass

class ContactCardInfoResponse(ContactCardInfoBase):
    id: int

    class Config:
        orm_mode = True
