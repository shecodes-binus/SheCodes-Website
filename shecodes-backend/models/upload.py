# this is for uploading images

from fastapi import APIRouter, UploadFile, File, HTTPException
import os
from uuid import uuid4
from fastapi.responses import JSONResponse

UPLOAD_DIR = "static/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

@router.post("/")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File is not an image")

    ext = file.filename.split(".")[-1]
    unique_name = f"{uuid4().hex}.{ext}"
    path = os.path.join(UPLOAD_DIR, unique_name)

    with open(path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    url = f"/static/images/{unique_name}"
    return JSONResponse(content={"url": url})
