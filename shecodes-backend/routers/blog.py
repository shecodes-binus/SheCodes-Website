# /shecodes-backend/routers/blog.py
from fastapi import APIRouter, HTTPException, Depends, status, Form, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Literal, Optional

import crud
from models import user as user_model, blog as blog_model
from schemas import blog as blog_schema
from database import get_db
from core.security import get_current_user
from core.storage_service import upload_file_to_supabase, delete_file_from_supabase

router = APIRouter(
    prefix="/blogs",
    tags=["Blogs"]
)

@router.post("/upload", response_model=blog_schema.BlogArticleResponse, status_code=status.HTTP_201_CREATED)
def create_blog_with_upload(
    id: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    category: Literal[
        'Tech Trends', 'Career Growth', 'Community', 'Event', 'Others', 
        'Tech & Innovation', 'Success Stories'
    ] = Form(...),
    date: str = Form(...),
    authorName: str = Form(...),
    authorInitials: str = Form(...),
    link: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # Protected
):
    """
    Creates a new blog article by uploading its details and cover image.
    """
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")

    image_url = upload_file_to_supabase(image)

    blog_data = blog_schema.BlogArticleCreate(
        id=id,
        title=title,
        description=description,
        category=category,
        date=date,
        authorName=authorName,
        authorInitials=authorInitials,
        link=link,
        imageSrc=image_url
    )
    return crud.create_blog(db=db, blog=blog_data)

@router.get("/", response_model=List[blog_schema.BlogArticleResponse])
def get_all_blogs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_blogs(db, skip=skip, limit=limit)

@router.get("/{blog_id}", response_model=blog_schema.BlogArticleResponse)
def get_blog_by_id(blog_id: str, db: Session = Depends(get_db)):
    db_blog = crud.get_blog(db, blog_id=blog_id)
    if not db_blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")
    return db_blog

@router.put("/update/{blog_id}", response_model=blog_schema.BlogArticleResponse)
def update_blog(
    blog_id: str,
    title: str = Form(...),
    description: str = Form(...),
    category: Literal['Tech Trends', 'Career Growth', 'Community', 'Event', 'Others', 'Tech & Innovation', 'Success Stories'] = Form(...),
    date: str = Form(...),
    authorName: str = Form(...),
    authorInitials: str = Form(...),
    link: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_blog = crud.get_blog(db, blog_id=blog_id)
    if not db_blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")

    new_image_url = db_blog.imageSrc
    if image:
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
        delete_file_from_supabase(db_blog.imageSrc)
        new_image_url = upload_file_to_supabase(image)
    
    blog_update_data = blog_schema.BlogArticleUpdate(
        title=title, description=description, category=category, date=date,
        authorName=authorName, authorInitials=authorInitials, link=link, imageSrc=new_image_url
    )
    return crud.update_blog(db=db, db_blog=db_blog, blog_in=blog_update_data)

@router.delete("/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(
    blog_id: str,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    db_blog = crud.get_blog(db, blog_id=blog_id)
    if not db_blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")

    delete_file_from_supabase(db_blog.imageSrc)
    crud.delete_blog(db, blog_id=blog_id)
    return {"message": "Blog and associated image deleted successfully"}