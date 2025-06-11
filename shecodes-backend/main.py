# /shecodes-backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models.user import Base
from core.config import settings

from routers import (
    auth, user, documentation, event, mentor, 
    partner, alumni, faq, contact, blog, comment, participant
)
from routers import upload as upload_router 

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
)

origins = [
    "http://localhost",
    "http://localhost:3000", 
    "http://localhost:5173", 
    "https://your-frontend-domain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth.router) 
app.include_router(user.router)
app.include_router(documentation.router)
app.include_router(event.router)
app.include_router(mentor.router)
app.include_router(partner.router)
app.include_router(alumni.router)
app.include_router(faq.router)
app.include_router(contact.router)
app.include_router(blog.router)
app.include_router(comment.router)
app.include_router(participant.router)
app.include_router(upload_router.router) 

@app.get("/", tags=["Root"])
def read_root():
    """A welcome endpoint for the API."""
    return {"message": f"Welcome to {settings.PROJECT_NAME} API v{settings.PROJECT_VERSION}"}