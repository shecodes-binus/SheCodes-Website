from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import models
from database import get_db
from schemas.mentor import MentorResponse, MentorCreate, MentorUpdate

router = APIRouter(
    prefix="/mentors",
    tags=["Mentors"]
)

@router.post("/", response_model=MentorResponse)
def create_mentor(mentor: MentorCreate, db: Session = Depends(get_db)):
    new_mentor = models.Mentor(**mentor.dict())
    db.add(new_mentor)
    db.commit()
    db.refresh(new_mentor)
    return new_mentor

@router.get("/", response_model=List[MentorResponse])
def get_mentors(db: Session = Depends(get_db)):
    return db.query(models.Mentor).all()

@router.get("/{mentor_id}", response_model=MentorResponse)
def get_mentor(mentor_id: int, db: Session = Depends(get_db)):
    mentor = db.query(models.Mentor).filter(models.Mentor.id == mentor_id).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return mentor

@router.put("/{mentor_id}", response_model=MentorResponse)
def update_mentor(mentor_id: int, mentor: MentorUpdate, db: Session = Depends(get_db)):
    db_mentor = db.query(models.Mentor).filter(models.Mentor.id == mentor_id).first()
    if not db_mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    for key, value in mentor.dict(exclude_unset=True).items():
        setattr(db_mentor, key, value)
    
    db.commit()
    db.refresh(db_mentor)
    return db_mentor

@router.delete("/{mentor_id}", response_model=dict)
def delete_mentor(mentor_id: int, db: Session = Depends(get_db)):
    db_mentor = db.query(models.Mentor).filter(models.Mentor.id == mentor_id).first()
    if not db_mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    db.delete(db_mentor)
    db.commit()
    return {"message": "Mentor deleted successfully"}
