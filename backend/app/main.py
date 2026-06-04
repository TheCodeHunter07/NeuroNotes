from fastapi import FastAPI
from app.database.connection import engine
from app.database.base import Base
from app.models.note_model import Note
from app.models.user_model import User
from app.routes.auth_routes import router as auth_router
from app.routes.note_routes import router as note_router
from app.routes.ai_routes import router as ai_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(note_router)
app.include_router(ai_router)

@app.get("/")
def home():
    return {"message": "NeuroNotes backend running"}