from pydantic import BaseModel
from typing import Literal

class FAQItemBase(BaseModel):
    question: str
    answer: str
    colorVariant: Literal['pink', 'blue', 'purple']

class FAQItemCreate(FAQItemBase):
    id: str

class FAQItemUpdate(FAQItemBase):
    pass

class FAQItemResponse(FAQItemBase):
    id: str

    class Config:
        orm_mode = True
