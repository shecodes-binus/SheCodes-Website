from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

import models
from schemas.documentation import DocumentationResponse, DocumentationUpdate, DocumentationCreate
from database import get_db

router = APIRouter(
    prefix="/documentations",
    tags=["Documentations"]
)

@router.post("/", response_model=DocumentationResponse)
def create_documentation(doc: DocumentationCreate, db: Session = Depends(get_db)):
    new_doc = models.Documentation(**doc.dict())
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

@router.get("/", response_model=List[DocumentationResponse])
def get_documentations(db: Session = Depends(get_db)):
    return db.query(models.Documentation).all()

@router.get("/{doc_id}", response_model=DocumentationResponse)
def get_documentation(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(models.Documentation).filter(models.Documentation.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documentation not found")
    return doc

@router.put("/{doc_id}", response_model=DocumentationResponse)
def update_documentation(doc_id: int, updated_doc: DocumentationUpdate, db: Session = Depends(get_db)):
    doc = db.query(models.Documentation).filter(models.Documentation.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documentation not found")
    
    for key, value in updated_doc.dict().items():
        setattr(doc, key, value)

    db.commit()
    db.refresh(doc)
    return doc

@router.delete("/{doc_id}", response_model=dict)
def delete_documentation(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(models.Documentation).filter(models.Documentation.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documentation not found")
    
    db.delete(doc)
    db.commit()
    return {"message": "Documentation deleted successfully"}
