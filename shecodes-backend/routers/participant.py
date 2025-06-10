from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/participants",
    tags=["Participants"]
)

@router.post("/", response_model=schemas.ParticipantResponse)
def add_participant(participant: schemas.ParticipantCreate, db: Session = Depends(get_db)):
    new_participant = models.Participant(
        event_id=participant.event_id,
        member_id=participant.member_id,
        registration_date=participant.registration_date or datetime.utcnow(),
        status=participant.status or "registered"
    )
    db.add(new_participant)
    db.commit()
    db.refresh(new_participant)
    return new_participant

@router.get("/event/{event_id}", response_model=List[schemas.ParticipantResponse])
def get_event_participants(event_id: int, db: Session = Depends(get_db)):
    return db.query(models.Participant).filter(models.Participant.event_id == event_id).all()

@router.patch("/{participant_id}/status", response_model=schemas.ParticipantResponse)
def update_status(participant_id: int, update: schemas.ParticipantUpdate, db: Session = Depends(get_db)):
    participant = db.query(models.Participant).filter(models.Participant.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    participant.status = update.status
    db.commit()
    db.refresh(participant)
    return participant

@router.delete("/", response_model=dict)
def delete_participants(ids: List[int], db: Session = Depends(get_db)):
    db.query(models.Participant).filter(models.Participant.id.in_(ids)).delete(synchronize_session=False)
    db.commit()
    return {"message": f"Deleted {len(ids)} participants."}
