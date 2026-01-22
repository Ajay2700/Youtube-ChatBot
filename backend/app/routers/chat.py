"""
Chat router
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.rag_service import rag_service

router = APIRouter()


class ChatRequest(BaseModel):
    """Request model for chat"""
    video_id: str
    question: str


class ChatResponse(BaseModel):
    """Response model for chat"""
    video_id: str
    question: str
    answer: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat with the RAG system about a processed video
    """
    try:
        if not request.video_id or not request.question:
            raise HTTPException(
                status_code=400,
                detail="video_id and question are required"
            )
        
        result = rag_service.chat(
            video_id=request.video_id,
            question=request.question
        )
        
        return ChatResponse(**result)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
