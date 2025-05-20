from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/alumni",
    tags=["Alumni"]
)

@router.post("/", response_model=schemas.AlumniResponse)
def create_alumni(alumni: schemas.AlumniCreate, db: Session = Depends(get_db)):
    new_alumni = models.Alumni(**alumni.dict())
    db.add(new_alumni)
    db.commit()
    db.refresh(new_alumni)
    return new_alumni

@router.get("/", response_model=List[schemas.AlumniResponse])
def get_alumni(db: Session = Depends(get_db)):
    return db.query(models.Alumni).all()

@router.get("/{alumni_id}", response_model=schemas.AlumniResponse)
def get_alumni(alumni_id: int, db: Session = Depends(get_db)):
    alumni = db.query(models.Alumni).filter(models.Alumni.id == alumni_id).first()
    if not alumni:
        raise HTTPException(status_code=404, detail="Alumni not found")
    return alumni

@router.put("/{alumni_id}", response_model=schemas.AlumniResponse)
def update_alumni(alumni_id: int, alumni: schemas.AlumniUpdate, db: Session = Depends(get_db)):
    db_alumni = db.query(models.Alumni).filter(models.Alumni.id == alumni_id).first()
    if not db_alumni:
        raise HTTPException(status_code=404, detail="Alumni not found")
    
    for key, value in alumni.dict(exclude_unset=True).items():
        setattr(db_alumni, key, value)
    
    db.commit()
    db.refresh(db_alumni)
    return db_alumni

@router.delete("/{alumni_id}", response_model=dict)
def delete_alumni(alumni_id: int, db: Session = Depends(get_db)):
    db_alumni = db.query(models.Alumni).filter(models.Alumni.id == alumni_id).first()
    if not db_alumni:
        raise HTTPException(status_code=404, detail="Alumni not found")
    
    db.delete(db_alumni)
    db.commit()
    return {"message": "Alumni deleted successfully"}
