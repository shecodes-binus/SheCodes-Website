from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, PrimaryKeyConstraint, func
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

# New table to track likes
class CommentLike(Base):
    __tablename__ = "comment_likes"

    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    comment_id = Column(Integer, ForeignKey("comments.id", ondelete="CASCADE"), primary_key=True)

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    discussion_id = Column(String, nullable=False)
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True)

    author = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    avatar = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    
    replies = relationship(
        "Comment", 
        backref="parent", 
        remote_side=[id], 
        cascade="all, delete-orphan",
        single_parent=True  # <-- ADD THIS FLAG
    )
    
    comment_likes = relationship("CommentLike", back_populates="comment", cascade="all, delete-orphan")

CommentLike.comment = relationship("Comment", back_populates="comment_likes")