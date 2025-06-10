from sqlalchemy import Column, String, Enum, Integer, DateTime, Text
from datetime import datetime
from database import Base

class BlogArticle(Base):
    __tablename__ = "blog_articles"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
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
    date = Column(String, nullable=False)
    authorName = Column(String, nullable=False)
    authorInitials = Column(String, nullable=False)
    imageSrc = Column(String, nullable=False)
    link = Column(String, nullable=False)

    sections = Column(Text, nullable=True)  # Store JSON string or delimited string
    viewCount = Column(Integer, default=0)
    likeCount = Column(Integer, default=0)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
