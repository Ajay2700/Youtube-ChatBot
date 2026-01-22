"""
FastAPI Backend for YouTube Transcript Chatbot
Main application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import video, chat
from app.core.config import settings

app = FastAPI(
    title="YouTube Transcript Chatbot API",
    description="RAG-based chatbot for YouTube video transcripts",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(video.router, prefix="/api/v1", tags=["video"])
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])


@app.get("/")
async def root():
    return {"message": "YouTube Transcript Chatbot API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
