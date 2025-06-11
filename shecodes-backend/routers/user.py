# /shecodes-backend/routers/user.py

from fastapi import APIRouter, HTTPException, Depends, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional

import crud
from models import user as user_model
from schemas import user as user_schema
from database import get_db
from core.security import get_current_user
from core.storage_service import upload_file_to_supabase, delete_file_from_supabase

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.put("/me", response_model=user_schema.UserResponse)
def update_my_profile(
    name: str = Form(...),
    # You might not want users to change their own role, so it's commented out
    # role: RoleEnum = Form(...), 
    picture: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    """
    Allows the currently logged-in user to update their name and profile picture.
    """
    new_picture_url = current_user.profile_picture

    if picture:
        if not picture.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
        # Delete the old picture if it exists
        delete_file_from_supabase(current_user.profile_picture)
        new_picture_url = upload_file_to_supabase(picture)

    user_update_data = user_schema.UserUpdate(
        name=name,
        profile_picture=new_picture_url
    )
    return crud.update_user(db=db, db_user=current_user, user_in=user_update_data)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    """
    Deletes a user. Should be restricted to admins or the user themselves.
    """
    # Authorization check: only an admin or the user themselves can delete the account.
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this user")

    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    delete_file_from_supabase(db_user.profile_picture)
    crud.delete_user(db, user_id=user_id)
    return {"message": "User and associated data deleted successfully"}



@router.get("/me", response_model=user_schema.UserResponse)
def read_current_user(current_user: user_model.User = Depends(get_current_user)):
    return current_user

# Note: The endpoint below is for demonstration. 
# In a real app, you'd likely want to restrict this to admin users.
@router.get("/", response_model=List[user_schema.UserResponse])
def read_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    # current_user: user_model.User = Depends(get_current_user) # Uncomment to protect this endpoint
):
    """Retrieve all users. (Admin access recommended)."""
    users = crud.get_all_users(db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=user_schema.UserResponse)
def read_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
    # current_user: user_model.User = Depends(get_current_user) # Uncomment to protect
):
    """Retrieve a specific user by their ID."""
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user