from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/faqs",
    tags=["FAQs"]
)

@router.post("/", response_model=schemas.FAQItemResponse)
def create_faq(faq: schemas.FAQItemCreate, db: Session = Depends(get_db)):
    new_faq = models.FAQItem(**faq.dict())
    db.add(new_faq)
    db.commit()
    db.refresh(new_faq)
    return new_faq

@router.get("/", response_model=List[schemas.FAQItemResponse])
def get_faqs(db: Session = Depends(get_db)):
    return db.query(models.FAQItem).all()

@router.get("/{faq_id}", response_model=schemas.FAQItemResponse)
def get_faq(faq_id: str, db: Session = Depends(get_db)):
    faq = db.query(models.FAQItem).filter(models.FAQItem.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return faq

@router.put("/{faq_id}", response_model=schemas.FAQItemResponse)
def update_faq(faq_id: str, faq: schemas.FAQItemUpdate, db: Session = Depends(get_db)):
    db_faq = db.query(models.FAQItem).filter(models.FAQItem.id == faq_id).first()
    if not db_faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    for key, value in faq.dict(exclude_unset=True).items():
        setattr(db_faq, key, value)
    
    db.commit()
    db.refresh(db_faq)
    return db_faq

@router.delete("/{faq_id}", response_model=dict)
def delete_faq(faq_id: str, db: Session = Depends(get_db)):
    db_faq = db.query(models.FAQItem).filter(models.FAQItem.id == faq_id).first()
    if not db_faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    db.delete(db_faq)
    db.commit()
    return {"message": "FAQ deleted successfully"}
