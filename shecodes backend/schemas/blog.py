from pydantic import BaseModel
from typing import Literal

class BlogArticleBase(BaseModel):
    title: str
    description: str
    category: Literal[
        'Tech Trends',
        'Career Growth',
        'Community',
        'Event',
        'Others',
        'Tech & Innovation',
        'Success Stories'
    ]
    date: str
    authorName: str
    authorInitials: str
    imageSrc: str
    link: str

class BlogArticleCreate(BlogArticleBase):
    id: str

class BlogArticleUpdate(BlogArticleBase):
    pass

class BlogArticleResponse(BlogArticleBase):
    id: str

    class Config:
        orm_mode = True
