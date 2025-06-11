# /shecodes-backend/core/storage_service.py (Enhanced)

import uuid
import mimetypes
from urllib.parse import urlparse
from fastapi import UploadFile, HTTPException, status
from core.supabase_client import get_supabase_client

# The name of the public bucket you created in the Supabase dashboard.
BUCKET_NAME = "images"

def upload_file_to_supabase(file: UploadFile, bucket_name: str = BUCKET_NAME) -> str:
    """
    Uploads a file to a specified Supabase storage bucket and returns its public URL.
    """
    supabase = get_supabase_client()
    
    try:
        file_ext = mimetypes.guess_extension(file.content_type) or '.tmp'
        # The path inside the bucket. We'll add a 'public/' prefix for organization.
        file_path_in_bucket = f"public/{uuid.uuid4()}{file_ext}"

        file_content = file.file.read()

        supabase.storage.from_(bucket_name).upload(
            path=file_path_in_bucket,
            file=file_content,
            file_options={"content-type": file.content_type}
        )
        
        public_url = supabase.storage.from_(bucket_name).get_public_url(file_path_in_bucket)
        return public_url

    except Exception as e:
        print(f"Supabase upload failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error uploading file to cloud storage."
        )

def delete_file_from_supabase(file_url: str, bucket_name: str = BUCKET_NAME) -> bool:
    """
    Deletes a file from Supabase storage using its full public URL.
    Returns True on success, False on failure.
    """
    if not file_url:
        return True # Nothing to delete

    supabase = get_supabase_client()
    
    try:
        # Parse the URL to extract the path of the file in the bucket.
        # e.g., from "https://<...>.supabase.co/storage/v1/object/public/images/public/uuid.jpg"
        # we need to extract "public/uuid.jpg"
        parsed_url = urlparse(file_url)
        path_parts = parsed_url.path.split(f'/{bucket_name}/')
        
        if len(path_parts) < 2:
            print(f"Warning: Could not parse file path from URL: {file_url}")
            return False

        file_path_in_bucket = path_parts[1]
        
        # Supabase's remove function expects a list of paths
        response = supabase.storage.from_(bucket_name).remove([file_path_in_bucket])
        
        # You can inspect the response if needed for more robust error handling
        print(f"Successfully deleted {file_path_in_bucket} from Supabase.")
        return True

    except Exception as e:
        print(f"Supabase file deletion failed for URL {file_url}: {e}")
        return False