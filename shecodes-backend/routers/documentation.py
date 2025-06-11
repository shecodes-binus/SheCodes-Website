# /shecodes-backend/routers/documentation.py (Fully Modified)

from fastapi import APIRouter, HTTPException, Depends, status, File, UploadFile
from sqlalchemy.orm import Session
from typing import List

import crud
from models import documentation as doc_model, user as user_model
from schemas import documentation as doc_schema
from database import get_db
from core.security import get_current_user
from core.storage_service import upload_file_to_supabase, delete_file_from_supabase

router = APIRouter(
    prefix="/documentations",
    tags=["Documentations"]
)

@router.post("/", response_model=doc_schema.DocumentationResponse, status_code=status.HTTP_201_CREATED)
def create_documentation(
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
    image_url = upload_file_to_supabase(image)
    doc_data = doc_schema.DocumentationCreate(image_src=image_url)
    return crud.create_generic_item(db, model=doc_model.Documentation, schema=doc_data)

@router.put("/{doc_id}", response_model=doc_schema.DocumentationResponse)
def update_documentation(
    doc_id: int,
    image: UploadFile = File(...), # Image is required for an update
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_doc = crud.get_generic_item(db, model=doc_model.Documentation, item_id=doc_id)
    if not db_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Documentation not found")

    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
        
    delete_file_from_supabase(db_doc.image_src)
    new_image_url = upload_file_to_supabase(image)

    doc_update_data = doc_schema.DocumentationUpdate(image_src=new_image_url)
    return crud.update_generic_item(db, db_item=db_doc, schema_in=doc_update_data)

@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_documentation(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_doc = crud.get_generic_item(db, model=doc_model.Documentation, item_id=doc_id)
    if not db_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Documentation not found")

    delete_file_from_supabase(db_doc.image_src)
    crud.delete_generic_item(db, model=doc_model.Documentation, item_id=doc_id)
    return {"message": "Documentation and associated image deleted successfully"}

# --- GET endpoints remain the same ---
@router.get("/", response_model=List[doc_schema.DocumentationResponse])
def get_all_documentations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_generic_items(db, model=doc_model.Documentation, skip=skip, limit=limit)

@router.get("/{doc_id}", response_model=doc_schema.DocumentationResponse)
def get_documentation_by_id(doc_id: int, db: Session = Depends(get_db)):
    db_doc = crud.get_generic_item(db, model=doc_model.Documentation, item_id=doc_id)
    if not db_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Documentation not found")
    return db_doc