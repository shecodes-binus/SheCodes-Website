from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import models
from database import get_db
from schemas.faq import FAQItemCreate, FAQItemResponse, FAQItemUpdate

router = APIRouter(
    prefix="/faqs",
    tags=["FAQs"]
)

@router.post("/", response_model=FAQItemResponse)
def create_faq(faq: FAQItemCreate, db: Session = Depends(get_db)):
    new_faq = models.FAQItem(**faq.dict())
    db.add(new_faq)
    db.commit()
    db.refresh(new_faq)
    return new_faq

@router.get("/", response_model=List[FAQItemResponse])
def get_faqs(db: Session = Depends(get_db)):
    return db.query(models.FAQItem).all()

@router.get("/{faq_id}", response_model=FAQItemResponse)
def get_faq(faq_id: str, db: Session = Depends(get_db)):
    faq = db.query(models.FAQItem).filter(models.FAQItem.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return faq

@router.put("/{faq_id}", response_model=FAQItemResponse)
def update_faq(faq_id: str, faq: FAQItemUpdate, db: Session = Depends(get_db)):
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
