# /shecodes-backend/routers/faq.py
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List

import crud
from models import faq as faq_model, user as user_model
from schemas import faq as faq_schema
from database import get_db
from core.security import get_current_user

router = APIRouter(
    prefix="/faqs",
    tags=["FAQs"]
)

# Using generic CRUD functions
@router.post("/", response_model=faq_schema.FAQItemResponse, status_code=status.HTTP_201_CREATED)
def create_faq(
    faq: faq_schema.FAQItemCreate, 
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    # The ID is part of the create schema for this model, so we can't use the generic create
    db_faq = faq_model.FAQItem(**faq.model_dump())
    db.add(db_faq)
    db.commit()
    db.refresh(db_faq)
    return db_faq

@router.get("/", response_model=List[faq_schema.FAQItemResponse])
def get_all_faqs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_generic_items(db, model=faq_model.FAQItem, skip=skip, limit=limit)

@router.get("/{faq_id}", response_model=faq_schema.FAQItemResponse)
def get_faq_by_id(faq_id: str, db: Session = Depends(get_db)):
    db_faq = crud.get_generic_item(db, model=faq_model.FAQItem, item_id=faq_id)
    if not db_faq:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ not found")
    return db_faq

@router.put("/{faq_id}", response_model=faq_schema.FAQItemResponse)
def update_faq(
    faq_id: str, 
    faq_in: faq_schema.FAQItemUpdate, 
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_faq = crud.get_generic_item(db, model=faq_model.FAQItem, item_id=faq_id)
    if not db_faq:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ not found")
    return crud.update_generic_item(db, db_item=db_faq, schema_in=faq_in)

@router.delete("/{faq_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_faq(
    faq_id: str, 
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    deleted_item = crud.delete_generic_item(db, model=faq_model.FAQItem, item_id=faq_id)
    if not deleted_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ not found")
    return {"message": "FAQ deleted successfully"}