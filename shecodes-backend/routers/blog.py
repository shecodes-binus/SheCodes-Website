from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import models
from database import get_db
from schemas.blog import BlogArticleCreate, BlogArticleResponse, BlogArticleUpdate

router = APIRouter(
    prefix="/blogs",
    tags=["Blogs"]
)

@router.post("/", response_model=BlogArticleResponse)
def create_blog(blog: BlogArticleCreate, db: Session = Depends(get_db)):
    new_blog = models.BlogArticle(**blog.dict())
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    return new_blog

@router.get("/", response_model=List[BlogArticleResponse])
def get_blogs(db: Session = Depends(get_db)):
    return db.query(models.BlogArticle).all()

@router.get("/{slug}", response_model=BlogArticleResponse)
def get_blog(slug: str, db: Session = Depends(get_db)):
    blog = db.query(models.BlogArticle).filter(models.BlogArticle.slug == slug).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Article not found")
    return blog

@router.put("/{slug}", response_model=BlogArticleResponse)
def update_blog(slug: str, blog: BlogArticleUpdate, db: Session = Depends(get_db)):
    db_blog = db.query(models.BlogArticle).filter(models.BlogArticle.slug == slug).first()
    if not db_blog:
        raise HTTPException(status_code=404, detail="Article not found")

    for key, value in blog.dict(exclude_unset=True).items():
        setattr(db_blog, key, value)

    db.commit()
    db.refresh(db_blog)
    return db_blog

@router.delete("/{slug}", response_model=dict)
def delete_blog(slug: str, db: Session = Depends(get_db)):
    db_blog = db.query(models.BlogArticle).filter(models.BlogArticle.slug == slug).first()
    if not db_blog:
        raise HTTPException(status_code=404, detail="Article not found")

    db.delete(db_blog)
    db.commit()
    return {"message": "Article deleted successfully"}
