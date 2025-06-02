from pydantic import BaseModel
from typing import Literal, Optional, List
from datetime import datetime

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
    sections: Optional[List[str]] = []
    viewCount: int = 0
    likeCount: int = 0


class BlogArticleCreate(BlogArticleBase):
    id: str

class BlogArticleUpdate(BlogArticleBase):
    pass

class BlogArticleResponse(BlogArticleBase):
    id: str
    createdAt: datetime
    updatedAt: datetime


    class Config:
        orm_mode = True
