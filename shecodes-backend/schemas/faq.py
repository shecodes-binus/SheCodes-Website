from pydantic import BaseModel
from typing import Literal

class FAQItemBase(BaseModel):
    question: str
    answer: str
    color_variant: Literal['pink', 'blue', 'purple']

class FAQItemCreate(FAQItemBase):
    id: int

class FAQItemUpdate(FAQItemBase):
    pass

class FAQItemResponse(FAQItemBase):
    id: int

    class Config:
        orm_mode = True
