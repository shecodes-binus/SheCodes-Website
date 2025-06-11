# /shecodes-backend/routers/mentor.py

from fastapi import APIRouter, HTTPException, Depends, status, Form, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional

import crud
from models import mentor as mentor_model, user as user_model
from schemas import mentor as mentor_schema
from database import get_db
from core.security import get_current_user
from core.storage_service import upload_file_to_supabase, delete_file_from_supabase

router = APIRouter(
    prefix="/mentors",
    tags=["Mentors"]
)

@router.post("/upload", response_model=mentor_schema.MentorResponse, status_code=status.HTTP_201_CREATED)
def create_mentor_with_upload(
    name: str = Form(...),
    occupation: str = Form(...),
    description: str = Form(...),
    story: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # Protected
):
    """
    Creates a new mentor by uploading their details and profile image.
    """
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")

    image_url = upload_file_to_supabase(image)

    mentor_data = mentor_schema.MentorCreate(
        name=name,
        occupation=occupation,
        description=description,
        story=story,
        imageSrc=image_url
    )
    return crud.create_generic_item(db, model=mentor_model.Mentor, schema=mentor_data)

@router.get("/", response_model=List[mentor_schema.MentorResponse])
def get_all_mentors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_generic_items(db, model=mentor_model.Mentor, skip=skip, limit=limit)

@router.get("/{mentor_id}", response_model=mentor_schema.MentorResponse)
def get_mentor_by_id(mentor_id: int, db: Session = Depends(get_db)):
    db_mentor = crud.get_generic_item(db, model=mentor_model.Mentor, item_id=mentor_id)
    if not db_mentor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor not found")
    return db_mentor

@router.put("/update/{mentor_id}", response_model=mentor_schema.MentorResponse)
def update_mentor(
    mentor_id: int,
    name: str = Form(...),
    occupation: str = Form(...),
    description: str = Form(...),
    story: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_mentor = crud.get_generic_item(db, model=mentor_model.Mentor, item_id=mentor_id)
    if not db_mentor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor not found")

    new_image_url = db_mentor.imageSrc

    if image:
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
        delete_file_from_supabase(db_mentor.imageSrc)
        new_image_url = upload_file_to_supabase(image)

    mentor_update_data = mentor_schema.MentorUpdate(
        name=name, occupation=occupation, description=description, story=story, imageSrc=new_image_url
    )
    return crud.update_generic_item(db, db_item=db_mentor, schema_in=mentor_update_data)

@router.delete("/{mentor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_mentor(
    mentor_id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_mentor = crud.get_generic_item(db, model=mentor_model.Mentor, item_id=mentor_id)
    if not db_mentor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor not found")

    delete_file_from_supabase(db_mentor.imageSrc)
    crud.delete_generic_item(db, model=mentor_model.Mentor, item_id=mentor_id)
    return {"message": "Mentor and associated image deleted successfully"}