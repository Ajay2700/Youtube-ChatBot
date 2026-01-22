# YouTube Transcript Chatbot - Backend API

FastAPI backend for YouTube transcript chatbot using RAG (Retrieval Augmented Generation).

## Features

- Fetch YouTube video transcripts
- Process transcripts and create vector embeddings
- RAG-based question answering about video content
- Persistent vector store (FAISS)
- RESTful API endpoints

## Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Set environment variables:**
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

3. **Run the server:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Process Video
```
POST /api/v1/video/process
Body: {
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID"
  OR
  "video_id": "VIDEO_ID"
}
```

### Chat
```
POST /api/v1/chat
Body: {
  "video_id": "VIDEO_ID",
  "question": "Your question here"
}
```

### Check Video Status
```
GET /api/v1/video/{video_id}/status
```

## Docker

Build and run with Docker:
```bash
docker build -t yt-chatbot-backend .
docker run -p 8000:8000 --env-file .env yt-chatbot-backend
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `CORS_ORIGINS`: Comma-separated list of allowed origins (optional)
- `VECTOR_STORE_DIR`: Directory for storing vector stores (default: ./vector_stores)
- `CHUNK_SIZE`: Text chunk size for splitting (default: 1000)
- `CHUNK_OVERLAP`: Overlap between chunks (default: 200)
- `EMBEDDING_MODEL`: OpenAI embedding model (default: text-embedding-3-small)
- `LLM_MODEL`: OpenAI LLM model (default: gpt-4o-mini)
- `LLM_TEMPERATURE`: LLM temperature (default: 0.2)
- `RETRIEVER_K`: Number of retrieved documents (default: 4)
