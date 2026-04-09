"""
Application configuration
"""
from pydantic_settings import BaseSettings
from pydantic import model_validator
from typing import List, Any
import os
import json


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # OpenAI API Key
    # Keep optional so the API can boot and serve `/health` without it.
    # Endpoints that need OpenAI will validate presence at runtime.
    OPENAI_API_KEY: str = ""
    
    # CORS origins - stored as string, converted to list after initialization
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173,http://localhost:3001,http://127.0.0.1:3001"

    # Optional regex for dynamic preview domains (e.g., Netlify deploy previews).
    # Example: https://deploy-preview-123--your-site.netlify.app
    CORS_ORIGIN_REGEX: str = r"^https:\/\/.*\.netlify\.app$"
    
    @model_validator(mode='after')
    def convert_cors_origins(self):
        """Convert CORS_ORIGINS string to list after initialization"""
        if isinstance(self.CORS_ORIGINS, str):
            # Split by comma and strip whitespace
            self._cors_origins_list = [
                origin.strip() 
                for origin in self.CORS_ORIGINS.split(',') 
                if origin.strip()
            ]
        elif isinstance(self.CORS_ORIGINS, list):
            # If it's already a list (shouldn't happen, but handle it)
            self._cors_origins_list = self.CORS_ORIGINS
        else:
            # Fallback to defaults
            self._cors_origins_list = [
                "http://localhost:3000",
                "http://localhost:5173",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5173",
                "http://localhost:3001",
                "http://127.0.0.1:3001",
            ]
        return self
    
    def get_cors_origins(self) -> List[str]:
        """Get CORS origins as list"""
        if hasattr(self, '_cors_origins_list') and self._cors_origins_list:
            return self._cors_origins_list
        # Fallback: parse from string
        if isinstance(self.CORS_ORIGINS, str):
            return [
                origin.strip() 
                for origin in self.CORS_ORIGINS.split(',') 
                if origin.strip()
            ]
        return [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
            "http://localhost:3001",
            "http://127.0.0.1:3001",
        ]
    
    # Vector store settings
    VECTOR_STORE_DIR: str = "./vector_stores"
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    
    # Model settings
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    LLM_MODEL: str = "gpt-4o-mini"
    LLM_TEMPERATURE: float = 0.2
    
    # Retrieval settings
    RETRIEVER_K: int = 4
    
    # Proxy settings for youtube-transcript-api (needed on cloud providers)
    # Option A: Webshare residential proxy (recommended, free tier available at webshare.io)
    WEBSHARE_PROXY_USERNAME: str = ""
    WEBSHARE_PROXY_PASSWORD: str = ""
    # Option B: Generic HTTPS proxy URL (e.g. https://user:pass@proxy.example.com:8080)
    HTTPS_PROXY_URL: str = ""

    # Token quota (per user per day) for chat endpoint
    # Users are identified by X-User-Id header (preferred) or client IP.
    USER_TOKEN_LIMIT_DEFAULT: int = 1000
    # JSON object mapping specific user ids to limits, e.g. {"alice": 5000, "bob": 100000}
    USER_TOKEN_LIMITS_JSON: str = ""

    def get_user_token_limits(self) -> dict:
        try:
            data = json.loads(self.USER_TOKEN_LIMITS_JSON) if self.USER_TOKEN_LIMITS_JSON else {}
            return data if isinstance(data, dict) else {}
        except Exception:
            return {}
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
