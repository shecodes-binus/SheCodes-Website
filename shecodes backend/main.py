from fastapi import FastAPI
from .routers import documentation, user, event, mentor, partner, alumni, faq, contact, blog, comment
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")
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

# uhh might add on to this later