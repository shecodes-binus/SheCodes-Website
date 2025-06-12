# shecodes-backend/schemas/comment.py (Updated)

from pydantic import BaseModel, computed_field
from typing import Optional, List
from datetime import datetime

# This is what the frontend will send
class CommentCreateRequest(BaseModel):
    discussion_id: str
    parent_id: Optional[int] = None
    text: str

# This is used internally by the backend after adding user info
class CommentCreate(BaseModel):
    discussion_id: str
    parent_id: Optional[int] = None
    author: str
    text: str
    avatar: Optional[str] = None

class CommentUpdate(BaseModel):
    text: Optional[str] = None

class CommentResponse(BaseModel): # <-- Updated this to be self-contained
    id: int
    discussion_id: str
    parent_id: Optional[int] = None
    author: str
    text: str
    avatar: Optional[str] = None
    date: datetime
    likes: int
    # We will calculate replies on the frontend, so no need for a 'replies' field here

    class Config:
        orm_mode = True
        
class CommentResponse(BaseModel):
    id: int
    discussion_id: str
    parent_id: Optional[int] = None
    author: str
    text: str
    avatar: Optional[str] = None
    date: datetime

    # This field will be populated by the backend relationship
    comment_likes: List[BaseModel] = [] 
    
    # This field tells the frontend if the currently authenticated user liked this comment
    is_liked_by_current_user: bool = False 

    @computed_field
    @property
    def like_count(self) -> int:
        return len(self.comment_likes)

    class Config:
        orm_mode = True