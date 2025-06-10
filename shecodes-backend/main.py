from fastapi import FastAPI
from routers import documentation, user, event, mentor, partner, alumni, faq, contact, blog, comment, participant, auth
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from core.config import settings

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000", 
    "http://localhost:8080", 
    "http://localhost:5173", 
    "http://localhost:5174",
    "http://0.0.0.0:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(participant.router)
app.include_router(documentation.router)
app.include_router(user.router)
app.include_router(event.router)
app.include_router(mentor.router)
app.include_router(partner.router)
app.include_router(alumni.router)
app.include_router(faq.router)
app.include_router(contact.router)
app.include_router(blog.router)
app.include_router(comment.router)
app.include_router(auth.router)


# uhh might add on to this later
@app.get("/", tags=["Root"])
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} v{settings.PROJECT_VERSION}"}