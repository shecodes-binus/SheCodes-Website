from fastapi import APIRouter, Depends, Form, File, UploadFile, status, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

import crud
from schemas import champion as champion_schema
from models import champion as champion_model, user as user_model
from database import get_db
from core.security import get_current_user
from core.storage_service import upload_file_to_supabase, delete_file_from_supabase

router = APIRouter(prefix="/champions", tags=["Champions (Team)"])

@router.post("/upload", response_model=champion_schema.ChampionResponse, status_code=status.HTTP_201_CREATED)
def create_champion(
    name: str = Form(...),
    position: str = Form(...),
    description: Optional[str] = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    image_url = upload_file_to_supabase(image)
    champion_data = champion_schema.ChampionCreate(
        name=name, position=position, description=description, imageSrc=image_url
    )
    return crud.create_generic_item(db, model=champion_model.Champion, schema=champion_data)

@router.get("/", response_model=List[champion_schema.ChampionResponse])
def get_all_champions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_champions(db, skip=skip, limit=limit)

@router.put("/update/{champion_id}", response_model=champion_schema.ChampionResponse)
def update_champion(
    champion_id: int,
    name: str = Form(...),
    position: str = Form(...),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_champion = crud.get_generic_item(db, model=champion_model.Champion, item_id=champion_id)
    if not db_champion:
        raise HTTPException(status_code=404, detail="Champion not found")

    new_image_url = db_champion.imageSrc
    if image:
        delete_file_from_supabase(db_champion.imageSrc)
        new_image_url = upload_file_to_supabase(image)

    update_data = champion_schema.ChampionUpdate(
        name=name, position=position, description=description, imageSrc=new_image_url
    )
    return crud.update_generic_item(db, db_item=db_champion, schema_in=update_data)

@router.delete("/{champion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_champion(
    champion_id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_champion = crud.get_generic_item(db, model=champion_model.Champion, item_id=champion_id)
    if not db_champion:
        raise HTTPException(status_code=404, detail="Champion not found")
    
    delete_file_from_supabase(db_champion.imageSrc)
    crud.delete_generic_item(db, model=champion_model.Champion, item_id=champion_id)
    return {"message": "Champion deleted"}