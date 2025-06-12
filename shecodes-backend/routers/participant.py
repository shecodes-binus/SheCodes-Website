# /shecodes-backend/routers/participant.py

from fastapi import APIRouter, HTTPException, Depends, status, File, UploadFile
from sqlalchemy.orm import Session
from typing import List

import crud
from models import user as user_model
from schemas import participant as participant_schema, common as common_schema
from database import get_db
from core.security import get_current_user
from core.storage_service import upload_file_to_supabase

router = APIRouter(
    prefix="/participants",
    tags=["Participants"]
)

@router.post("/", response_model=participant_schema.ParticipantResponse, status_code=status.HTTP_201_CREATED)
def add_participant(
    participant: participant_schema.ParticipantCreate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    """
    Registers a member for an event.
    Validates that the event and user exist before creating the record.
    Requires authentication.
    """
    try:
        # The CRUD function now handles all validation.
        return crud.create_participant(db=db, participant=participant)
    except ValueError as e:
        # Catch the custom error from the CRUD function and convert it to a clean HTTP response.
        # If it's a duplicate registration, use a 409 Conflict code.
        # If it's a missing event/user, use a 404 Not Found code.
        error_detail = str(e)
        status_code = status.HTTP_400_BAD_REQUEST

        if "not found" in error_detail.lower():
            status_code = status.HTTP_404_NOT_FOUND
        elif "already registered" in error_detail.lower():
            status_code = status.HTTP_409_CONFLICT
        
        raise HTTPException(
            status_code=status_code,
            detail=error_detail
        )

@router.get("/event/{event_id}", response_model=List[participant_schema.ParticipantResponse])
def get_event_participants(event_id: int, db: Session = Depends(get_db)):
    """
    Gets a list of all participants registered for a specific event.
    This endpoint is public.
    """
    # You could add a check here to ensure the event exists.
    event = crud.get_event(db, event_id=event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return crud.get_participants_by_event(db, event_id=event_id)

@router.patch("/{participant_id}/status", response_model=participant_schema.ParticipantResponse)
def update_participant_status(
    participant_id: int,
    update: participant_schema.ParticipantUpdate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # Protected
):
    """
    Updates the status of a participant (e.g., from 'registered' to 'attended').
    Requires authentication.
    """
    if current_user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        
    db_participant = crud.get_participant(db, participant_id=participant_id)
    if not db_participant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participant not found")
    
    return crud.update_participant_status(db, db_participant=db_participant, status=update.status)

@router.post("/delete-batch", status_code=status.HTTP_200_OK)
def delete_participants_in_batch(
    ids: List[int], # Expects a JSON list in the request body, e.g., [1, 2, 5]
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # Protected
):
    """
    Deletes a list of participants by their IDs. Using POST for a bulk delete action
    is a common practice as DELETE with a request body can be ambiguous.
    Requires authentication.
    """
    if current_user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    if not ids:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No participant IDs provided.")
        
    num_deleted = crud.delete_participants_by_ids(db, ids=ids)

    if num_deleted == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching participants found for deletion.")

    return {"message": f"Successfully deleted {num_deleted} participant(s)."}

@router.post("/{participant_id}/certificate", response_model=common_schema.Msg)
def upload_certificate_for_participant(
    participant_id: int,
    certificate: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    """
    Uploads a certificate for a specific event participation.
    Requires admin authentication.
    """
    if current_user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    db_participant = crud.get_participant(db, participant_id=participant_id)
    if not db_participant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participant record not found")

    if not certificate.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File must be an image.")

    # Upload the file to cloud storage
    certificate_url = upload_file_to_supabase(certificate)
    
    # Update the participant record with the new URL
    crud.update_participant_certificate(db, db_participant=db_participant, certificate_url=certificate_url)
    
    return common_schema.Msg(msg="Certificate uploaded successfully")
