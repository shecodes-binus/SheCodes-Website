# /shecodes-backend/routers/comment.py (Updated)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

import crud
from models import user as user_model
from schemas import comment as comment_schema
from database import get_db
from core.security import get_current_user, get_current_user_optional

router = APIRouter(
    prefix="/comments", 
    tags=["Comments"]
)

@router.post("/", response_model=comment_schema.CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    # Use the new request schema
    comment_in: comment_schema.CommentCreateRequest, 
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # Protected
):
    # Create the full data object for the CRUD function, using the authenticated user's details
    comment_data = comment_schema.CommentCreate(
        **comment_in.model_dump(),
        author=current_user.name,
        avatar=current_user.profile_picture
    )
    return crud.create_comment(db=db, comment=comment_data)

@router.get("/{discussion_id}", response_model=List[comment_schema.CommentResponse])
def get_comments_for_discussion(
    discussion_id: str, 
    db: Session = Depends(get_db),
    # Make current_user optional: if they are logged in, we can tell them which comments they've liked
    current_user: Optional[user_model.User] = Depends(get_current_user_optional) # <-- You'll need to create this dependency
):
    comments = crud.get_comments_by_discussion(db, discussion_id=discussion_id)
    
    liked_ids = set()
    if current_user:
        liked_ids = set(crud.get_liked_comment_ids_by_user(db, user_id=current_user.id))

    # Process comments to add the `is_liked_by_current_user` flag
    for comment in comments:
        comment.is_liked_by_current_user = comment.id in liked_ids
        
    return comments

# Endpoint for the frontend to know which comments are liked by the current user
@router.get("/me/likes", response_model=List[int])
def get_my_liked_comment_ids(
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    return crud.get_liked_comment_ids_by_user(db, user_id=current_user.id)


@router.put("/{comment_id}/like", response_model=comment_schema.CommentResponse)
def toggle_like_on_comment(
    comment_id: int, 
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_comment = crud.get_comment(db, comment_id=comment_id)
    if not db_comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")

    updated_comment = crud.toggle_comment_like(db=db, comment_id=comment_id, user_id=current_user.id)
    
    # Manually set the flag for the response
    updated_comment.is_liked_by_current_user = True # If we just liked it, it's true. If we unliked, we'll fix on frontend.
    
    return updated_comment

# DELETE endpoint remains the same, but ensure you add authorization in a real app
@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int, 
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # Protected
):
    db_comment = crud.get_comment(db, comment_id=comment_id)
    if not db_comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    
    # Example authorization:
    if db_comment.author != current_user.name and current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")

    crud.delete_comment(db, comment_id=comment_id)
    return {"message": "Comment deleted successfully"}