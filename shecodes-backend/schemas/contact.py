from pydantic import BaseModel
from typing import Literal

class ContactCardInfoBase(BaseModel):
    platform_name: str
    logo_src: str
    description: str
    link_url: str
    color_variant: Literal['pink', 'blue']

class ContactCardInfoCreate(ContactCardInfoBase):
    pass

class ContactCardInfoUpdate(ContactCardInfoBase):
    pass

class ContactCardInfoResponse(ContactCardInfoBase):
    id: int

    class Config:
        orm_mode = True
