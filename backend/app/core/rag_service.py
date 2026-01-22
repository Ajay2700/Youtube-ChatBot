"""
RAG Service - Core functionality for YouTube transcript processing and chat
"""
import os
import re
from typing import Optional, List, Dict
from pathlib import Path

from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser

from app.core.config import settings


class RAGService:
    """Service for handling RAG operations"""
    
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(model=settings.EMBEDDING_MODEL)
        self.llm = ChatOpenAI(
            model=settings.LLM_MODEL,
            temperature=settings.LLM_TEMPERATURE
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP
        )
        self.vector_stores: Dict[str, FAISS] = {}
        self.retrievers: Dict[str, any] = {}
        self.chains: Dict[str, any] = {}
        
        # Ensure vector store directory exists
        Path(settings.VECTOR_STORE_DIR).mkdir(parents=True, exist_ok=True)
    
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
    
    def fetch_transcript(self, video_id: str) -> str:
        """Fetch transcript from YouTube"""
        try:
            fetched = YouTubeTranscriptApi().fetch(video_id, languages=("en",))
            transcript_list = fetched.to_raw_data()
            transcript = " ".join(chunk["text"] for chunk in transcript_list)
            return transcript
        except TranscriptsDisabled:
            raise ValueError(f"No captions available for video {video_id}")
        except Exception as e:
            raise ValueError(f"Error fetching transcript: {str(e)}")
    
    def process_video(self, video_id: str, youtube_url: Optional[str] = None) -> Dict:
        """Process YouTube video: fetch transcript, create vector store, and setup RAG chain"""
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
            
            # Create vector store
            vector_store = FAISS.from_documents(chunks, self.embeddings)
            
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
        except Exception as e:
            raise ValueError(f"Error generating answer: {str(e)}")


# Global instance
rag_service = RAGService()
