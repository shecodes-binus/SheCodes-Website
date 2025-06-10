from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/contacts",
    tags=["Contact Cards"]
)

@router.post("/", response_model=schemas.ContactCardInfoResponse)
def create_contact(contact: schemas.ContactCardInfoCreate, db: Session = Depends(get_db)):
    new_contact = models.ContactCardInfo(**contact.dict())
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact

@router.get("/", response_model=List[schemas.ContactCardInfoResponse])
def get_contacts(db: Session = Depends(get_db)):
    return db.query(models.ContactCardInfo).all()

@router.get("/{contact_id}", response_model=schemas.ContactCardInfoResponse)
def get_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(models.ContactCardInfo).filter(models.ContactCardInfo.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

@router.put("/{contact_id}", response_model=schemas.ContactCardInfoResponse)
def update_contact(contact_id: int, contact: schemas.ContactCardInfoUpdate, db: Session = Depends(get_db)):
    db_contact = db.query(models.ContactCardInfo).filter(models.ContactCardInfo.id == contact_id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    for key, value in contact.dict(exclude_unset=True).items():
        setattr(db_contact, key, value)
    
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.delete("/{contact_id}", response_model=dict)
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    db_contact = db.query(models.ContactCardInfo).filter(models.ContactCardInfo.id == contact_id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    db.delete(db_contact)
    db.commit()
    return {"message": "Contact deleted successfully"}
