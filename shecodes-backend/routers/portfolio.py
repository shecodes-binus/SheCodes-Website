# /shecodes-backend/routers/portfolio.py

from fastapi import APIRouter, Depends, Form, File, UploadFile, status, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import crud
from schemas import portfolio as portfolio_schema
from models import portfolio as portfolio_model, user as user_model
from database import get_db
from core.security import get_current_user
from core.storage_service import upload_file_to_supabase, delete_file_from_supabase

router = APIRouter(prefix="/portfolio", tags=["Portfolio Projects"])

@router.post("/upload", response_model=portfolio_schema.PortfolioProjectResponse, status_code=status.HTTP_201_CREATED)
def create_portfolio_project(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    projectUrl: Optional[str] = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
    image_url = upload_file_to_supabase(image)
    project_data = portfolio_schema.PortfolioProjectCreate(
        name=name, description=description, projectUrl=projectUrl, imageUrl=image_url
    )
    return crud.create_generic_item(db, model=portfolio_model.PortfolioProject, schema=project_data)

@router.get("/", response_model=List[portfolio_schema.PortfolioProjectResponse])
def get_all_portfolio_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Using the specific CRUD function we defined
    return crud.get_all_generic_items(db, model=portfolio_model.PortfolioProject, skip=skip, limit=limit)

@router.put("/update/{project_id}", response_model=portfolio_schema.PortfolioProjectResponse)
def update_portfolio_project(
    project_id: int,
    name: str = Form(...),
    description: Optional[str] = Form(None),
    projectUrl: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_project = crud.get_generic_item(db, model=portfolio_model.PortfolioProject, item_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Portfolio project not found")

    new_image_url = db_project.imageUrl
    if image:
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
        delete_file_from_supabase(db_project.imageUrl)
        new_image_url = upload_file_to_supabase(image)

    update_data = portfolio_schema.PortfolioProjectUpdate(
        name=name, description=description, projectUrl=projectUrl, imageUrl=new_image_url
    )
    return crud.update_generic_item(db, db_item=db_project, schema_in=update_data)

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_portfolio_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_project = crud.get_generic_item(db, model=portfolio_model.PortfolioProject, item_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Portfolio project not found")
    
    delete_file_from_supabase(db_project.imageUrl)
    crud.delete_generic_item(db, model=portfolio_model.PortfolioProject, item_id=project_id)
    return {"message": "Portfolio project deleted"}