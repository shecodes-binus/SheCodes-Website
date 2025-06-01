from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CommentBase(BaseModel):
    discussion_id: str
    parent_id: Optional[int] = None
    author: str
    text: str
    avatar: Optional[str] = None

class CommentCreate(CommentBase):
    pass

class CommentUpdate(BaseModel):
    text: Optional[str] = None

class CommentResponse(CommentBase):
    id: int
    date: datetime
    likes: int

    class Config:
        orm_mode = True
