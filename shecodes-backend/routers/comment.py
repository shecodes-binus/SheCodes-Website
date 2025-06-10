from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
from database import get_db
from schemas.comment import CommentCreate, CommentResponse, CommentUpdate

router = APIRouter(prefix="/comments", tags=["Comments"])

@router.post("/", response_model=CommentResponse)
def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    db_comment = models.Comment(**comment.dict())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/{discussion_id}", response_model=List[CommentResponse])
def get_comments(discussion_id: str, db: Session = Depends(get_db)):
    return db.query(models.Comment).filter(models.Comment.discussion_id == discussion_id).order_by(models.Comment.date).all()

@router.put("/{comment_id}/like", response_model=CommentResponse)
def toggle_like(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    comment.likes += 1
    db.commit()
    db.refresh(comment)
    return comment

@router.delete("/{comment_id}", response_model=dict)
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"}
