"""
RAG Service - Core functionality for YouTube transcript processing and chat
"""
import logging
import os
import re
import time
from typing import Optional, List, Dict
from pathlib import Path

import openai
from youtube_transcript_api import (
    AgeRestricted,
    InvalidVideoId,
    NoTranscriptFound,
    RequestBlocked,
    TranscriptsDisabled,
    VideoUnavailable,
    VideoUnplayable,
    YouTubeTranscriptApi,
)
from youtube_transcript_api.proxies import GenericProxyConfig
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser

from app.core.config import settings

logger = logging.getLogger(__name__)

# YouTube labels English tracks with a few codes; the library matches them exactly.
ENGLISH_CODES = ("en", "en-US", "en-GB")


class AIServiceUnavailable(RuntimeError):
    """OpenAI rejected or could not serve a request (billing, quota, API key, or network)."""

    def __init__(self, reason: str):
        super().__init__(f"The AI service is temporarily unavailable ({reason}). Please try again later.")
        self.reason = reason


def _openai_failure(exc: Exception) -> AIServiceUnavailable:
    # OpenAI error codes (billing_not_active, insufficient_quota, invalid_api_key) tell the
    # operator what to fix; the full provider message stays in the server log.
    reason = str(getattr(exc, "code", None) or exc.__class__.__name__)
    logger.error("OpenAI request failed (%s): %s", reason, exc)
    return AIServiceUnavailable(reason)


class RAGService:
    """Service for handling RAG operations"""
    
    def __init__(self):
        # Lazy-init OpenAI clients so the server can start without OPENAI_API_KEY.
        self.embeddings = None
        self.llm = None
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP
        )
        self.vector_stores: Dict[str, FAISS] = {}
        self.retrievers: Dict[str, any] = {}
        self.chains: Dict[str, any] = {}
        
        # Ensure vector store directory exists
        Path(settings.VECTOR_STORE_DIR).mkdir(parents=True, exist_ok=True)
        
        # Build proxy config for youtube-transcript-api
        self._proxy_config = self._build_proxy_config()

    @staticmethod
    def _build_proxy_config():
        """Build proxy config from env vars. Returns None if no proxy is configured."""
        # Option A: Webshare proxy
        ws_user = (settings.WEBSHARE_PROXY_USERNAME or "").strip()
        ws_pass = (settings.WEBSHARE_PROXY_PASSWORD or "").strip()
        if ws_user and ws_pass:
            try:
                from youtube_transcript_api.proxies import WebshareProxyConfig
                return WebshareProxyConfig(
                    proxy_username=ws_user,
                    proxy_password=ws_pass,
                )
            except ImportError:
                pass

        # Option B: Generic HTTPS proxy
        proxy_url = (settings.HTTPS_PROXY_URL or "").strip()
        if proxy_url:
            return GenericProxyConfig(
                https_url=proxy_url,
            )

        return None

    def _ensure_openai_clients(self) -> None:
        """Create OpenAI clients on-demand with clear errors when missing config."""
        if self.embeddings is not None and self.llm is not None:
            return

        api_key = (settings.OPENAI_API_KEY or "").strip()
        if not api_key:
            raise ValueError(
                "OPENAI_API_KEY is not set. Create a `.env` file in `backend/` (or set an env var) "
                "with OPENAI_API_KEY=... then restart the backend."
            )

        # Prefer explicit key over relying on environment propagation.
        self.embeddings = OpenAIEmbeddings(model=settings.EMBEDDING_MODEL, api_key=api_key)
        self.llm = ChatOpenAI(
            model=settings.LLM_MODEL,
            temperature=settings.LLM_TEMPERATURE,
            api_key=api_key,
        )
    
    def extract_video_id(self, youtube_url: str) -> str:
        """Extract video ID from YouTube URL"""
        patterns = [
            r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
            r'youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, youtube_url)
            if match:
                return match.group(1)
        
        # If no pattern matches, assume it's already a video ID
        if len(youtube_url) == 11 and youtube_url.replace('-', '').replace('_', '').isalnum():
            return youtube_url
        
        raise ValueError(f"Invalid YouTube URL or video ID: {youtube_url}")
    
    def _blocked_message(self) -> str:
        if self._proxy_config:
            hint = (
                "A proxy is configured, but YouTube is blocking it too. Datacenter and free proxies "
                "are usually blocked; use a rotating residential proxy (e.g. Webshare's Residential "
                "plan) or check the proxy credentials."
            )
        else:
            hint = (
                "To fix this, set a rotating residential proxy in the server's environment:\n"
                "  WEBSHARE_PROXY_USERNAME and WEBSHARE_PROXY_PASSWORD (Webshare Residential plan)\n"
                "  OR HTTPS_PROXY_URL=https://user:pass@proxy:port"
            )
        return (
            "YouTube is blocking transcript requests from this server's IP address. "
            "This is common on cloud hosts (Render, AWS, etc.).\n\n" + hint
        )

    def fetch_transcript(self, video_id: str) -> str:
        """Fetch the English transcript, turning YouTube failures into actionable messages."""
        ytt_api = YouTubeTranscriptApi(proxy_config=self._proxy_config) if self._proxy_config else YouTubeTranscriptApi()
        last_error: Optional[Exception] = None

        for attempt in range(2):
            try:
                fetched = ytt_api.fetch(video_id, languages=ENGLISH_CODES)
                return " ".join(chunk["text"] for chunk in fetched.to_raw_data())
            # Permanent failures: retrying cannot help, so report them straight away.
            except RequestBlocked:  # includes IpBlocked, which the library raises for HTTP 429
                raise ValueError(self._blocked_message())
            except TranscriptsDisabled:
                raise ValueError(
                    f"No captions/transcripts are available for video {video_id}. "
                    "The video may not have captions enabled."
                )
            except NoTranscriptFound:
                raise ValueError(
                    f"No English transcript found for video {video_id}. "
                    "The video may not have English captions available."
                )
            except (VideoUnavailable, VideoUnplayable, AgeRestricted, InvalidVideoId):
                raise ValueError(
                    f"Video {video_id} is unavailable. It may be private, deleted, or age-restricted."
                )
            except Exception as e:
                # Network hiccups and unexpected YouTube responses get one quick retry.
                last_error = e
                if attempt == 0:
                    time.sleep(2)

        raise ValueError(
            "Error fetching transcript from YouTube. "
            "This is usually due to missing/disabled captions, rate limits, or a temporarily blocked request.\n\n"
            f"Video ID: {video_id}\n"
            f"Original error: {last_error}"
        )
    
    def process_video(self, video_id: str, youtube_url: Optional[str] = None) -> Dict:
        """Process YouTube video: fetch transcript, create vector store, and setup RAG chain"""
        self._ensure_openai_clients()

        # Extract video ID if URL provided
        if youtube_url:
            video_id = self.extract_video_id(youtube_url)
        
        # Check if already processed
        vector_store_dir = Path(settings.VECTOR_STORE_DIR)
        vector_store_path = vector_store_dir / f"{video_id}.faiss"
        
        if vector_store_path.exists():
            # Load existing vector store
            try:
                vector_store = FAISS.load_local(
                    str(vector_store_dir),
                    self.embeddings,
                    allow_dangerous_deserialization=True,
                    index_name=video_id
                )
            except Exception:
                # If loading fails, reprocess
                vector_store_path.unlink()
                vector_store = None
        else:
            vector_store = None
        
        if vector_store is None:
            # Fetch and process transcript
            transcript = self.fetch_transcript(video_id)
            
            # Split into chunks
            chunks = self.text_splitter.create_documents([transcript])
            
            # Create vector store (embeds every chunk through OpenAI)
            try:
                vector_store = FAISS.from_documents(chunks, self.embeddings)
            except openai.OpenAIError as exc:
                raise _openai_failure(exc) from exc
            
            # Save vector store
            vector_store.save_local(
                str(vector_store_dir),
                index_name=video_id
            )
        
        # Create retriever
        retriever = vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={"k": settings.RETRIEVER_K}
        )
        
        # Create prompt template
        prompt = PromptTemplate(
            template="""
You are a helpful assistant answering questions about a YouTube video transcript.
Answer ONLY from the provided transcript context.
If the context is insufficient, just say you don't know.

Context:
{context}

Question: {question}

Answer:""",
            input_variables=['context', 'question']
        )
        
        # Format docs function
        def format_docs(retrieved_docs):
            context_text = "\n\n".join(doc.page_content for doc in retrieved_docs)
            return context_text
        
        # Create RAG chain
        parallel_chain = RunnableParallel({
            'context': retriever | RunnableLambda(format_docs),
            'question': RunnablePassthrough()
        })
        
        parser = StrOutputParser()
        main_chain = parallel_chain | prompt | self.llm | parser
        
        # Store for this video
        self.vector_stores[video_id] = vector_store
        self.retrievers[video_id] = retriever
        self.chains[video_id] = main_chain
        
        return {
            "video_id": video_id,
            "status": "processed",
            "message": "Video processed successfully"
        }
    
    def chat(self, video_id: str, question: str) -> Dict:
        """Chat with the RAG system about a video"""
        self._ensure_openai_clients()

        if video_id not in self.chains:
            raise ValueError(f"Video {video_id} not processed. Please process the video first.")
        
        chain = self.chains[video_id]
        
        try:
            answer = chain.invoke(question)
            return {
                "video_id": video_id,
                "question": question,
                "answer": answer
            }
        except openai.OpenAIError as exc:
            raise _openai_failure(exc) from exc
        except Exception as e:
            raise ValueError(f"Error generating answer: {str(e)}")


# Global instance
rag_service = RAGService()
