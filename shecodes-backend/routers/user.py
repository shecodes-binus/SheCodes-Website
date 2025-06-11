# /shecodes-backend/routers/user.py (Final and Complete)

from fastapi import APIRouter, HTTPException, Depends, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

import crud
from models import user as user_model
from schemas import user as user_schema
from schemas.user import RoleEnum # Import RoleEnum for type hinting
from database import get_db
from core.security import get_current_user
from core.storage_service import upload_file_to_supabase, delete_file_from_supabase

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.put("/me", response_model=user_schema.UserResponse)
def update_my_profile(
    # Use Form with default=None for all optional fields
    name: str = Form(...), # Keep name as required for this endpoint
    about_me: Optional[str] = Form(None),
    birth_date: Optional[date] = Form(None),
    gender: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    occupation: Optional[str] = Form(None),
    cv_link: Optional[str] = Form(None),
    linkedin: Optional[str] = Form(None),
    picture: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    """
    Allows the currently logged-in user to update their full profile.
    """
    new_picture_url = current_user.profile_picture

    if picture:
        if not picture.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
        # Delete the old picture if it exists before uploading the new one
        delete_file_from_supabase(current_user.profile_picture)
        new_picture_url = upload_file_to_supabase(picture)

    # Create the Pydantic schema object with all the form data
    user_update_data = user_schema.UserUpdate(
        name=name,
        about_me=about_me,
        birth_date=birth_date,
        gender=gender,
        phone=phone,
        occupation=occupation,
        cv_link=cv_link,
        linkedin=linkedin,
        profile_picture=new_picture_url
    )
    
    # The CRUD function will handle updating the user in the database
    return crud.update_user(db=db, db_user=current_user, user_in=user_update_data)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    """
    Deletes a user. Restricted to admins or the user themselves.
    """
    if current_user.role != RoleEnum.admin and current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this user")

    db_user_to_delete = crud.get_user(db, user_id=user_id)
    if not db_user_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    delete_file_from_supabase(db_user_to_delete.profile_picture)
    crud.delete_user(db, user_id=user_id)
    return {"message": "User and associated data deleted successfully"}

@router.get("/me", response_model=user_schema.UserResponse)
def read_current_user(current_user: user_model.User = Depends(get_current_user)):
    """
    Get details for the currently logged-in user.
    """
    return current_user

@router.get("/", response_model=List[user_schema.UserResponse])
def read_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    """
    Retrieve all users. (Admin access only).
    """
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view all users")
    users = crud.get_all_users(db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=user_schema.UserResponse)
def read_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    """
    Retrieve a specific user by their ID. (Admin access recommended).
    """
    if current_user.role != RoleEnum.admin and current_user.id != user_id:
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this user")

    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user