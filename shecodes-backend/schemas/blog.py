from enum import Enum
from pydantic import BaseModel, ConfigDict
from typing import Literal, Optional, List
from datetime import datetime

class ArticleCategoryEnum(str, Enum):
    TECH_TRENDS = 'Tech Trends'
    CAREER_GROWTH = 'Career Growth'
    COMMUNITY = 'Community'
    EVENT = 'Event'
    OTHERS = 'Others'
    TECH_INNOVATION = 'Tech & Innovation'
    SUCCESS_STORIES = 'Success Stories'

class BlogArticleBase(BaseModel):
    slug: str
    title: str
    excerpt: Optional[str] = None
    sections: Optional[List[str]] = None
    featuredImageUrl: str
    category: ArticleCategoryEnum
    authorName: str
    authorAvatarUrl: Optional[str] = None
    publishedAt: datetime

class BlogArticleCreate(BlogArticleBase):
    pass

class BlogArticleUpdate(BlogArticleBase):
    pass

class BlogArticleResponse(BlogArticleBase):
    id: int
    viewCount: int
    likeCount: int
    createdAt: datetime
    updatedAt: datetime
    model_config = ConfigDict(from_attributes=True)