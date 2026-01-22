"""
Video processing router
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from typing import Optional

from app.core.rag_service import rag_service

router = APIRouter()


class VideoProcessRequest(BaseModel):
    """Request model for video processing"""
    youtube_url: Optional[str] = None
    video_id: Optional[str] = None


class VideoProcessResponse(BaseModel):
    """Response model for video processing"""
    video_id: str
    status: str
    message: str


@router.post("/video/process", response_model=VideoProcessResponse)
async def process_video(request: VideoProcessRequest):
    """
    Process a YouTube video: fetch transcript and create vector store
    """
    try:
        if not request.youtube_url and not request.video_id:
            raise HTTPException(
                status_code=400,
                detail="Either youtube_url or video_id must be provided"
            )
        
        result = rag_service.process_video(
            video_id=request.video_id or "",
            youtube_url=request.youtube_url
        )
        
        return VideoProcessResponse(**result)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/video/{video_id}/status")
async def get_video_status(video_id: str):
    """
    Check if a video has been processed
    """
    from pathlib import Path
    from app.core.config import settings
    
    vector_store_path = Path(settings.VECTOR_STORE_DIR) / f"{video_id}.faiss"
    
    if vector_store_path.exists():
        return {
            "video_id": video_id,
            "status": "processed",
            "exists": True
        }
    else:
        return {
            "video_id": video_id,
            "status": "not_processed",
            "exists": False
        }
