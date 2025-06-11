# /shecodes-backend/routers/partner.py (Modified)

from fastapi import APIRouter, HTTPException, Depends, status, Form, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional

import crud
from models import partner as partner_model, user as user_model
from schemas import partner as partner_schema
from database import get_db
from core.security import get_current_user
from core.storage_service import upload_file_to_supabase, delete_file_from_supabase

router = APIRouter(
    prefix="/partners",
    tags=["Partners"]
)

@router.post("/upload", response_model=partner_schema.PartnerResponse, status_code=status.HTTP_201_CREATED)
def create_partner_with_upload(
    name: str = Form(...),
    logo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # Protected
):
    """
    Creates a new partner by uploading their name and logo file.
    """
    if not logo.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")

    logo_url = upload_file_to_supabase(logo)

    partner_data = partner_schema.PartnerCreate(
        name=name,
        logoSrc=logo_url
    )
    return crud.create_generic_item(db, model=partner_model.Partner, schema=partner_data)

@router.get("/", response_model=List[partner_schema.PartnerResponse])
def get_all_partners(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_generic_items(db, model=partner_model.Partner, skip=skip, limit=limit)

@router.get("/{partner_id}", response_model=partner_schema.PartnerResponse)
def get_partner_by_id(partner_id: int, db: Session = Depends(get_db)):
    db_partner = crud.get_generic_item(db, model=partner_model.Partner, item_id=partner_id)
    if not db_partner:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partner not found")
    return db_partner

@router.put("/update/{partner_id}", response_model=partner_schema.PartnerResponse)
def update_partner(
    partner_id: int,
    name: str = Form(...),
    logo: Optional[UploadFile] = File(None), # Logo is now optional
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_partner = crud.get_generic_item(db, model=partner_model.Partner, item_id=partner_id)
    if not db_partner:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partner not found")

    new_logo_url = db_partner.logoSrc # Keep the old URL by default

    if logo: # If a new logo was uploaded
        if not logo.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
        
        # Delete the old logo from Supabase before uploading the new one
        delete_file_from_supabase(db_partner.logoSrc)
        new_logo_url = upload_file_to_supabase(logo)

    partner_update_data = partner_schema.PartnerUpdate(name=name, logoSrc=new_logo_url)
    return crud.update_generic_item(db, db_item=db_partner, schema_in=partner_update_data)

@router.delete("/{partner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_partner(
    partner_id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_partner = crud.get_generic_item(db, model=partner_model.Partner, item_id=partner_id)
    if not db_partner:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partner not found")

    # Delete the image from Supabase first
    delete_file_from_supabase(db_partner.logoSrc)
    
    # Then delete the database record
    crud.delete_generic_item(db, model=partner_model.Partner, item_id=partner_id)
    return {"message": "Partner and associated logo deleted successfully"}
