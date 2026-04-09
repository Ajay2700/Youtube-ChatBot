"""
Chat router
"""
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from app.core.rag_service import rag_service
from app.core.config import settings
from app.core.quota import TokenQuotaStore, TokenCounter, resolve_user_key, check_quota
import os

router = APIRouter()

_quota_store = TokenQuotaStore(
    db_path=os.path.join(settings.VECTOR_STORE_DIR, "quota.sqlite3")
)
_token_counter = TokenCounter(model_name=settings.LLM_MODEL)


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
async def chat(request: ChatRequest, http_request: Request):
    """
    Chat with the RAG system about a processed video
    """
    try:
        if not request.video_id or not request.question:
            raise HTTPException(
                status_code=400,
                detail="video_id and question are required"
            )

        header_user_id = http_request.headers.get("x-user-id")
        client_ip = http_request.client.host if http_request.client else None
        user_key = resolve_user_key(header_user_id, client_ip)

        limits = settings.get_user_token_limits()
        # If X-User-Id is present, allow per-user overrides by raw id string
        effective_limit = int(limits.get(header_user_id, settings.USER_TOKEN_LIMIT_DEFAULT)) if header_user_id else int(settings.USER_TOKEN_LIMIT_DEFAULT)

        decision = check_quota(_quota_store, user_key=user_key, limit=effective_limit)
        if not decision.allowed:
            raise HTTPException(
                status_code=429,
                detail=f"Daily token limit exceeded. Limit={decision.limit}, Used={decision.used}. Try again tomorrow."
            )
        
        result = rag_service.chat(
            video_id=request.video_id,
            question=request.question
        )

        # Count tokens for question + answer, then charge against quota.
        tokens_used = _token_counter.count(request.question) + _token_counter.count(result.get("answer", ""))
        _quota_store.add_tokens(user_key=user_key, day_key=None, tokens=tokens_used)
        
        return ChatResponse(**result)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
