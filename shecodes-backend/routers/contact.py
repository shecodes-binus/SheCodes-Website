# /shecodes-backend/routers/contact.py
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List

import crud
from models import contact as contact_model, user as user_model
from schemas import contact as contact_schema
from database import get_db
from core.security import get_current_user

router = APIRouter(
    prefix="/contacts",
    tags=["Contact Cards"]
)

# Using generic CRUD functions for simple models
@router.post("/", response_model=contact_schema.ContactCardInfoResponse, status_code=status.HTTP_201_CREATED)
def create_contact(
    contact: contact_schema.ContactCardInfoCreate, 
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    return crud.create_generic_item(db, model=contact_model.ContactCardInfo, schema=contact)

@router.get("/", response_model=List[contact_schema.ContactCardInfoResponse])
def get_all_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_generic_items(db, model=contact_model.ContactCardInfo, skip=skip, limit=limit)

@router.get("/{contact_id}", response_model=contact_schema.ContactCardInfoResponse)
def get_contact_by_id(contact_id: int, db: Session = Depends(get_db)):
    db_contact = crud.get_generic_item(db, model=contact_model.ContactCardInfo, item_id=contact_id)
    if not db_contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact card not found")
    return db_contact

@router.put("/{contact_id}", response_model=contact_schema.ContactCardInfoResponse)
def update_contact(
    contact_id: int, 
    contact_in: contact_schema.ContactCardInfoUpdate, 
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_contact = crud.get_generic_item(db, model=contact_model.ContactCardInfo, item_id=contact_id)
    if not db_contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact card not found")
    return crud.update_generic_item(db, db_item=db_contact, schema_in=contact_in)

@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(
    contact_id: int, 
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    deleted_item = crud.delete_generic_item(db, model=contact_model.ContactCardInfo, item_id=contact_id)
    if not deleted_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact card not found")
    return {"message": "Contact card deleted successfully"}