# /shecodes-backend/main.py (Modified)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models.user import Base # Import Base from a model to link metadata
from core.config import settings
from core.supabase_client import supabase_client # To check initialization

# Import all your routers
from routers import (
    auth, user, documentation, event, mentor, 
    partner, alumni, faq, contact, blog, comment, participant,
    upload as upload_router,
    champion as champion_router,
    portfolio as portfolio_router
)

# This single line ensures all tables inheriting from Base are created.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
)

# Your CORS settings
origins = [
    "http://localhost",
    "http://localhost:3000", 
    "http://localhost:5173", 
    "https://your-frontend-domain.com", # Add your production frontend URL
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
app.include_router(champion_router.router)
app.include_router(portfolio_router.router)
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