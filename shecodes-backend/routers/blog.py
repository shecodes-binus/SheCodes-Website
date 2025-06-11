# /shecodes-backend/routers/blog.py

from fastapi import APIRouter, Depends, Form, File, UploadFile, status, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import crud
from schemas import blog as blog_schema
from schemas.blog import ArticleCategoryEnum
from models import blog as blog_model, user as user_model
from database import get_db
from core.security import get_current_user
from core.storage_service import upload_file_to_supabase, delete_file_from_supabase

router = APIRouter(prefix="/blogs", tags=["Blogs"])

@router.post("/upload", response_model=blog_schema.BlogArticleResponse, status_code=status.HTTP_201_CREATED)
def create_blog(
    slug: str = Form(...),
    title: str = Form(...),
    excerpt: Optional[str] = Form(None),
    sections: List[str] = Form(...),
    category: ArticleCategoryEnum = Form(...),
    authorName: str = Form(...),
    authorAvatarUrl: Optional[str] = Form(None),
    publishedAt: datetime = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    if crud.get_blog_by_slug(db, slug=slug):
        raise HTTPException(status_code=409, detail="Blog with this slug already exists.")
    
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
        
    image_url = upload_file_to_supabase(image)
    blog_data = blog_schema.BlogArticleCreate(
        slug=slug, title=title, excerpt=excerpt, sections=sections, featuredImageUrl=image_url,
        category=category, authorName=authorName, authorAvatarUrl=authorAvatarUrl, publishedAt=publishedAt
    )
    return crud.create_blog(db, blog=blog_data)

@router.get("/", response_model=List[blog_schema.BlogArticleResponse])
def get_all_blogs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_blogs(db, skip=skip, limit=limit)

@router.get("/{blog_id}", response_model=blog_schema.BlogArticleResponse)
def get_blog_by_id(blog_id: int, db: Session = Depends(get_db)):
    db_blog = crud.get_blog_by_id(db, blog_id=blog_id)
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return db_blog

@router.put("/update/{blog_id}", response_model=blog_schema.BlogArticleResponse)
def update_blog(
    blog_id: int,
    slug: str = Form(...),
    title: str = Form(...),
    excerpt: Optional[str] = Form(None),
    sections: List[str] = Form(...),
    category: ArticleCategoryEnum = Form(...),
    authorName: str = Form(...),
    authorAvatarUrl: Optional[str] = Form(None),
    publishedAt: datetime = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_blog = crud.get_blog_by_id(db, blog_id=blog_id)
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    # Check if slug is being changed to one that already exists
    existing_blog_with_slug = crud.get_blog_by_slug(db, slug=slug)
    if existing_blog_with_slug and existing_blog_with_slug.id != blog_id:
        raise HTTPException(status_code=409, detail="Another blog with this slug already exists.")

    new_image_url = db_blog.featuredImageUrl
    if image:
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
        delete_file_from_supabase(db_blog.featuredImageUrl)
        new_image_url = upload_file_to_supabase(image)
    
    blog_update_data = blog_schema.BlogArticleUpdate(
        slug=slug, title=title, excerpt=excerpt, sections=sections, featuredImageUrl=new_image_url,
        category=category, authorName=authorName, authorAvatarUrl=authorAvatarUrl, publishedAt=publishedAt
    )
    return crud.update_blog(db=db, db_blog=db_blog, blog_in=blog_update_data)

@router.delete("/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_blog = crud.get_blog_by_id(db, blog_id=blog_id)
    if not db_blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")

    delete_file_from_supabase(db_blog.featuredImageUrl)
    crud.delete_blog(db, blog_id=blog_id)
    return {"message": "Blog and associated image deleted successfully"}