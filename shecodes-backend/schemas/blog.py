from pydantic import BaseModel, Field
from typing import Literal, Optional, List
from datetime import datetime

class BlogArticleBase(BaseModel):
    title: str
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
    slug: str
    createdAt: datetime
    updatedAt: datetime
    featuredImageUrl: str = Field(..., alias="imageSrc")
    excerpt: str = Field(..., alias="description")

    class Config:
        orm_mode = True
        allow_population_by_field_name = True