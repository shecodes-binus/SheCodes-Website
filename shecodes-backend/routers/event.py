# /shecodes-backend/routers/event.py
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List

import crud
from models import user as user_model
from schemas import event as event_schema
from database import get_db
from core.security import get_current_user

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)

@router.post("/", response_model=event_schema.EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(
    event_data: event_schema.EventCreate, 
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # Protected
):
    return crud.create_event(db=db, event_data=event_data)

@router.get("/", response_model=List[event_schema.EventResponse])
def get_all_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_events(db, skip=skip, limit=limit)

@router.get("/{event_id}", response_model=event_schema.EventResponse)
def get_event_by_id(event_id: int, db: Session = Depends(get_db)):
    db_event = crud.get_event(db, event_id=event_id)
    if not db_event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return db_event

@router.put("/{event_id}", response_model=event_schema.EventResponse)
def update_event(
    event_id: int, 
    event_in: event_schema.EventUpdate, 
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # Protected
):
    db_event = crud.get_event(db, event_id=event_id)
    if not db_event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    # Note: This simple update only changes top-level fields. Updating relationships
    # like mentors, skills, etc., requires more complex logic in the CRUD function.
    return crud.update_event(db=db, db_event=db_event, event_in=event_in)

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int, 
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # Protected
):
    deleted_event = crud.delete_event(db, event_id=event_id)
    if not deleted_event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return {"message": "Event deleted successfully"}