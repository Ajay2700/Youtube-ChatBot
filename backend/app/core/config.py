"""
Application configuration
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # OpenAI API Key
    OPENAI_API_KEY: str
    
    # CORS origins
    CORS_ORIGINS: List[str] = [
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
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
