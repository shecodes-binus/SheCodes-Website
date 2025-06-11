# /shecodes-backend/routers/comment.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import crud
from models import user as user_model
from schemas import comment as comment_schema
from database import get_db
from core.security import get_current_user

router = APIRouter(
    prefix="/comments", 
    tags=["Comments"]
)

@router.post("/", response_model=comment_schema.CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    comment: comment_schema.CommentCreate, 
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # Protected
):
    return crud.create_comment(db=db, comment=comment)

@router.get("/{discussion_id}", response_model=List[comment_schema.CommentResponse])
def get_comments_for_discussion(discussion_id: str, db: Session = Depends(get_db)):
    return crud.get_comments_by_discussion(db, discussion_id=discussion_id)

@router.patch("/{comment_id}/like", response_model=comment_schema.CommentResponse)
def like_comment(comment_id: int, db: Session = Depends(get_db)):
    # Liking can often be public or require a user session, depending on business logic
    # current_user: user_model.User = Depends(get_current_user) # Optional protection
    db_comment = crud.get_comment(db, comment_id=comment_id)
    if not db_comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    return crud.increment_comment_like(db=db, db_comment=db_comment)

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int, 
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # Protected
):
    # Add logic here to check if current_user is the author or an admin
    deleted_comment = crud.delete_comment(db, comment_id=comment_id)
    if not deleted_comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    return {"message": "Comment deleted successfully"}