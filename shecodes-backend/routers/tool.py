# /shecodes-backend/routers/tool.py (New File)

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import crud
from models import user as user_model
from schemas import tool as tool_schema
from database import get_db
from core.security import get_current_user

router = APIRouter(
    prefix="/tools",
    tags=["Tools Management"]
)

# This endpoint is protected and only accessible by an admin
@router.post("/", response_model=tool_schema.ToolResponse, status_code=status.HTTP_201_CREATED)
def create_new_tool(
    tool: tool_schema.ToolCreate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    if current_user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    db_tool = crud.get_tool_by_name(db, name=tool.name)
    if db_tool:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A tool with this name already exists.")
    
    return crud.create_tool(db=db, tool=tool)

@router.get("/", response_model=List[tool_schema.ToolResponse])
def read_all_tools(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Public endpoint to get a list of all available tools.
    """
    return crud.get_all_tools(db, skip=skip, limit=limit)

@router.delete("/{tool_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_tool(
    tool_id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    if current_user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    db_tool = crud.get_tool(db, tool_id=tool_id)
    if not db_tool:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found")
        
    crud.delete_tool(db, tool_id=tool_id)
    return {"message": "Tool deleted successfully"}