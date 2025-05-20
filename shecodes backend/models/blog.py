from sqlalchemy import Column, String, Enum
from ..database import Base

class BlogArticle(Base):
    __tablename__ = "blog_articles"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(Enum('Tech Trends', 'Career Growth', 'Community', name="blog_category"), nullable=False)
    date = Column(String, nullable=False)
    authorName = Column(String, nullable=False)
    authorInitials = Column(String, nullable=False)
    imageSrc = Column(String, nullable=False)
    link = Column(String, nullable=False)
