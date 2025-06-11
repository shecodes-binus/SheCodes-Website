from fastapi import APIRouter, HTTPException, Depends, File, Form, UploadFile, status
from sqlalchemy.orm import Session
from typing import List, Optional

import crud
from models import alumni as alumni_model, user as user_model
from schemas import alumni as alumni_schema
from database import get_db
from core.security import get_current_user
from core.storage_service import upload_file_to_supabase, delete_file_from_supabase

router = APIRouter(
    prefix="/alumni",
    tags=["Alumni"]
)

@router.post("/upload", response_model=alumni_schema.AlumniResponse, status_code=status.HTTP_201_CREATED)
def create_alumni_with_upload(
    name: str = Form(...),
    batch: int = Form(...),
    story: str = Form(...),
    university: str = Form(None),
    instagram: str = Form(None),
    linkedin: str = Form(None),
    email: str = Form(None),
    phone: str = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # Protected
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File is not an image.")
        
    # Use the new service to upload to Supabase
    image_url = upload_file_to_supabase(image)

    # Create the schema object to pass to the CRUD function
    alumni_data = alumni_schema.AlumniCreate(
        name=name,
        batch=batch,
        story=story,
        university=university,
        instagram=instagram,
        linkedin=linkedin,
        email=email,
        phone=phone,
        image_src=image_url # Use the public URL from Supabase
    )
    
    return crud.create_alumni(db=db, alumni=alumni_data)

@router.get("/", response_model=List[alumni_schema.AlumniResponse])
def get_all_alumni(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # This endpoint is public. To protect, uncomment the line below.
    # current_user: user_model.User = Depends(get_current_user)
    return crud.get_all_alumni(db=db, skip=skip, limit=limit)

@router.get("/{alumni_id}", response_model=alumni_schema.AlumniResponse)
def get_alumni_by_id(alumni_id: int, db: Session = Depends(get_db)):
    db_alumni = crud.get_alumni(db, alumni_id=alumni_id)
    if not db_alumni:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alumni not found")
    return db_alumni

@router.put("/update/{alumni_id}", response_model=alumni_schema.AlumniResponse)
def update_alumni(
    alumni_id: int,
    name: str = Form(...),
    batch: int = Form(...),
    story: str = Form(...),
    university: str = Form(None),
    instagram: str = Form(None),
    linkedin: str = Form(None),
    email: str = Form(None),
    phone: str = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_alumni = crud.get_alumni(db, alumni_id=alumni_id)
    if not db_alumni:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alumni not found")

    new_image_url = db_alumni.imageSrc

    if image:
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
        delete_file_from_supabase(db_alumni.imageSrc)
        new_image_url = upload_file_to_supabase(image)

    alumni_update_data = alumni_schema.AlumniUpdate(
        name=name, batch=batch, story=story, university=university, instagram=instagram,
        linkedin=linkedin, email=email, phone=phone, image_src=new_image_url
    )
    return crud.update_alumni(db=db, db_alumni=db_alumni, alumni_in=alumni_update_data)

@router.delete("/{alumni_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alumni(
    alumni_id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_alumni = crud.get_alumni(db, alumni_id=alumni_id)
    if not db_alumni:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alumni not found")

    delete_file_from_supabase(db_alumni.imageSrc)
    crud.delete_alumni(db, alumni_id=alumni_id)
    return {"message": "Alumni and associated image deleted successfully"}