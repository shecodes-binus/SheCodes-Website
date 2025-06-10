from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import models
from schemas.event import EventResponse, EventCreate, EventUpdate
from database import get_db

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)

@router.post("/", response_model=EventResponse)
def create_event(event_data: EventCreate, db: Session = Depends(get_db)):
    new_event = models.Event(
        title=event_data.title,
        description=event_data.description,
        event_type=event_data.event_type,
        start_date=event_data.start_date,
        end_date=event_data.end_date,
        location=event_data.location,
        tools=event_data.tools,
        key_points=event_data.key_points
    )

    mentors = db.query(models.Mentor).filter(models.Mentor.id.in_(event_data.mentors)).all()
    new_event.mentors = mentors

    for skill in event_data.skills:
        new_event.skills.append(models.Skill(**skill.dict()))

    for benefit in event_data.benefits:
        new_event.benefits.append(models.Benefit(**benefit.dict()))

    for session in event_data.sessions:
        new_event.sessions.append(models.Session(**session.dict()))

    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@router.get("/", response_model=List[EventResponse])
def get_events(db: Session = Depends(get_db)):
    return db.query(models.Event).all()

@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/{event_id}", response_model=EventResponse)
def update_event(event_id: int, event: EventUpdate, db: Session = Depends(get_db)):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    for key, value in event.dict(exclude_unset=True).items():
        setattr(db_event, key, value)
    
    db.commit()
    db.refresh(db_event)
    return db_event

@router.delete("/{event_id}", response_model=dict)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(db_event)
    db.commit()
    return {"message": "Event deleted successfully"}