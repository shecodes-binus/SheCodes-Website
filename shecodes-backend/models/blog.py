from sqlalchemy import Column, String, Enum, Integer, DateTime, Text, func
from datetime import datetime
from database import Base
from custom_types import JsonEncodedList

class BlogArticle(Base):
    __tablename__ = "blog_articles"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, nullable=False)
    excerpt = Column(String, nullable=False)
    title = Column(String, nullable=False)
    category = Column(Enum(
        'Tech Trends',
        'Career Growth',
        'Community',
        'Event',
        'Others',
        'Tech & Innovation',
        'Success Stories',
        name="blog_category"
    ), nullable=False)
    published_at = Column(DateTime, default=datetime.utcnow, nullable=False, server_default=func.now())
    author_name = Column(String, nullable=False)
    author_avatar_url = Column(String, nullable=False)
    image_src = Column(String, nullable=False)
    featured_image_url = Column(String, nullable=False)

    sections = Column(JsonEncodedList, nullable=False) 
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, server_default=func.now())