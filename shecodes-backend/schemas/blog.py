from enum import Enum
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
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
    featured_image_url: str
    category: ArticleCategoryEnum
    author_name: str
    author_avatar_url: Optional[str] = None
    published_at: datetime

class BlogArticleCreate(BlogArticleBase):
    pass

class BlogArticleUpdate(BlogArticleBase):
    pass

class BlogArticleResponse(BlogArticleBase):
    id: int
    view_count: int
    like_count: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)