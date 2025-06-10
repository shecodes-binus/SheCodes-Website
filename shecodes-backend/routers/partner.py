from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import models
from database import get_db
from schemas.partner import PartnerCreate, PartnerResponse, PartnerUpdate

router = APIRouter(
    prefix="/partners",
    tags=["Partners"]
)

@router.post("/", response_model=PartnerResponse)
def create_partner(partner: PartnerCreate, db: Session = Depends(get_db)):
    new_partner = models.Partner(**partner.dict())
    db.add(new_partner)
    db.commit()
    db.refresh(new_partner)
    return new_partner

@router.get("/", response_model=List[PartnerResponse])
def get_partners(db: Session = Depends(get_db)):
    return db.query(models.Partner).all()

@router.get("/{partner_id}", response_model=PartnerResponse)
def get_partner(partner_id: int, db: Session = Depends(get_db)):
    partner = db.query(models.Partner).filter(models.Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    return partner

@router.put("/{partner_id}", response_model=PartnerResponse)
def update_partner(partner_id: int, partner: PartnerUpdate, db: Session = Depends(get_db)):
    db_partner = db.query(models.Partner).filter(models.Partner.id == partner_id).first()
    if not db_partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    for key, value in partner.dict(exclude_unset=True).items():
        setattr(db_partner, key, value)
    
    db.commit()
    db.refresh(db_partner)
    return db_partner

@router.delete("/{partner_id}", response_model=dict)
def delete_partner(partner_id: int, db: Session = Depends(get_db)):
    db_partner = db.query(models.Partner).filter(models.Partner.id == partner_id).first()
    if not db_partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    db.delete(db_partner)
    db.commit()
    return {"message": "Partner deleted successfully"}
