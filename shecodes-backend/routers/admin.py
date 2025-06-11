from fastapi import APIRouter, Depends, Form, File, UploadFile, status, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import crud
from schemas import admin as admin_schema
from models import admin as admin_model, user as user_model
from database import get_db
from core.security import get_current_user
from core.storage_service import upload_file_to_supabase, delete_file_from_supabase

router = APIRouter(prefix="/admins", tags=["Site Admins"])

@router.post("/upload", response_model=admin_schema.AdminResponse, status_code=status.HTTP_201_CREATED)
def create_admin(
    name: str = Form(...),
    email: str = Form(...),
    phone: Optional[str] = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    if current_user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can create other admins.")
    image_url = upload_file_to_supabase(image)
    admin_data = admin_schema.AdminCreate(name=name, email=email, phone=phone, imageSrc=image_url)
    return crud.create_generic_item(db, model=admin_model.Admin, schema=admin_data)

@router.get("/", response_model=List[admin_schema.AdminResponse])
def get_all_admins(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_generic_items(db, model=admin_model.Admin, skip=skip, limit=limit)