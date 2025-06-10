from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    discussion_id = Column(String, nullable=False)
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True)

    author = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    avatar = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    likes = Column(Integer, default=0)

    replies = relationship("Comment", backref="parent", remote_side=[id])
