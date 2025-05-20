from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/blogs",
    tags=["Blogs"]
)

@router.post("/", response_model=schemas.BlogArticleResponse)
def create_blog(blog: schemas.BlogArticleCreate, db: Session = Depends(get_db)):
    new_blog = models.BlogArticle(**blog.dict())
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    return new_blog

@router.get("/", response_model=List[schemas.BlogArticleResponse])
def get_blogs(db: Session = Depends(get_db)):
    return db.query(models.BlogArticle).all()

@router.get("/{blog_id}", response_model=schemas.BlogArticleResponse)
def get_blog(blog_id: str, db: Session = Depends(get_db)):
    blog = db.query(models.BlogArticle).filter(models.BlogArticle.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

@router.put("/{blog_id}", response_model=schemas.BlogArticleResponse)
def update_blog(blog_id: str, blog: schemas.BlogArticleUpdate, db: Session = Depends(get_db)):
    db_blog = db.query(models.BlogArticle).filter(models.BlogArticle.id == blog_id).first()
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    for key, value in blog.dict(exclude_unset=True).items():
        setattr(db_blog, key, value)
    
    db.commit()
    db.refresh(db_blog)
    return db_blog

@router.delete("/{blog_id}", response_model=dict)
def delete_blog(blog_id: str, db: Session = Depends(get_db)):
    db_blog = db.query(models.BlogArticle).filter(models.BlogArticle.id == blog_id).first()
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    db.delete(db_blog)
    db.commit()
    return {"message": "Blog deleted successfully"}
