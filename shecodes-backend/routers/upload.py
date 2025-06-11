# /shecodes-backend/routers/upload.py (Modified)

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from models import user as user_model
from core.security import get_current_user
from core.storage_service import upload_file_to_supabase # <-- IMPORT THE NEW SERVICE

router = APIRouter(
    prefix="/upload",
    tags=["Upload Utility"]
)

@router.post("/image", response_model=dict)
def upload_image(
    file: UploadFile = File(...),
    current_user: user_model.User = Depends(get_current_user) # Protect the endpoint
):
    """
    Generic endpoint to upload an image to Supabase Storage.
    Returns the public URL of the uploaded image.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    image_url = upload_file_to_supabase(file)
    
    return {"url": image_url}