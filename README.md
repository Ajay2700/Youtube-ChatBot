# YouTube Transcript Chatbot

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Frontend-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://your-app-name.netlify.app)
[![API Docs](https://img.shields.io/badge/API%20Docs-Backend-46E3B7?style=for-the-badge&logo=fastapi&logoColor=white)](https://your-backend.onrender.com/docs)
[![Health Check](https://img.shields.io/badge/Health%20Check-Status-00D9FF?style=for-the-badge&logo=render&logoColor=white)](https://your-backend.onrender.com/health)

**🌐 [Live Application](https://your-app-name.netlify.app)** | **📚 [API Documentation](https://your-backend.onrender.com/docs)** | **🔧 [Backend Health](https://your-backend.onrender.com/health)**

</div>

---

A production-ready web application that allows users to chat with YouTube video transcripts using RAG (Retrieval Augmented Generation) powered by OpenAI and LangChain.

> **📝 Note:** Replace `your-app-name.netlify.app` and `your-backend.onrender.com` with your actual deployed URLs in the badges above.

## 🚀 Features

- **YouTube Transcript Fetching**: Automatically fetches transcripts from YouTube videos
- **RAG-Powered Chat**: Ask questions about video content using AI
- **Vector Store**: Persistent FAISS vector store for efficient retrieval
- **Modern UI**: Beautiful React frontend with Tailwind CSS
- **RESTful API**: FastAPI backend with proper error handling
- **Docker Support**: Easy deployment with Docker Compose
- **Production Ready**: Proper architecture, error handling, and deployment configs

## 📋 Prerequisites

- Python 3.11+
- Node.js 20+
- Docker & Docker Compose (optional, for containerized deployment)
- OpenAI API Key

## 🏗️ Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │────────▶│   FastAPI   │────────▶│   OpenAI    │
│  Frontend   │  HTTP   │   Backend   │  API    │   API       │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              ▼
                        ┌─────────────┐
                        │    FAISS    │
                        │ Vector Store│
                        └─────────────┘
```

## 🚀 Quick Start

### Option 1: Deploy to Production (Recommended)

**Deploy to Netlify (Frontend) + Render (Backend):**

See **[DEPLOY_NOW.md](DEPLOY_NOW.md)** for quick 15-minute deployment guide!

Or follow the complete guide: **[DEPLOY_COMPLETE_GUIDE.md](DEPLOY_COMPLETE_GUIDE.md)**

---

### Option 2: Docker Compose (Local Development)

1. **Clone the repository:**
```bash
cd 13_Yt_Bot_Project
```

2. **Create `.env` file:**
```bash
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

3. **Start services:**
```bash
docker-compose up --build
```

4. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Set environment variables:**
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

5. **Run the server:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

1. **Navigate to frontend:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set environment variables (optional):**
```bash
cp .env.example .env
# Edit .env if backend is not on localhost:8000
```

4. **Run development server:**
```bash
npm run dev
```

5. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 📖 Usage

1. **Enter YouTube URL**: Paste a YouTube video URL in the input field
2. **Process Video**: Click "Process Video" to fetch transcript and create embeddings
3. **Start Chatting**: Ask questions about the video content
4. **Get Answers**: Receive AI-powered answers based on the video transcript

## 🔌 API Endpoints

### Process Video
```http
POST /api/v1/video/process
Content-Type: application/json

{
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### Chat
```http
POST /api/v1/chat
Content-Type: application/json

{
  "video_id": "VIDEO_ID",
  "question": "What is this video about?"
}
```

### Check Video Status
```http
GET /api/v1/video/{video_id}/status
```

## 🐳 Deployment

### Docker Deployment

#### Single Container (Backend only)
```bash
cd backend
docker build -t yt-chatbot-backend .
docker run -p 8000:8000 --env-file .env yt-chatbot-backend
```

#### Docker Compose (Full Stack)
```bash
docker-compose up -d
```

### Cloud Deployment

#### Backend (FastAPI)
- **Render**: Deploy as a Web Service
- **Railway**: Connect GitHub repo
- **Fly.io**: Use `flyctl launch`
- **AWS ECS/Fargate**: Use Docker image
- **Google Cloud Run**: Deploy container

#### Frontend (React)
- **Vercel**: Connect GitHub repo (recommended)
- **Netlify**: Deploy from `dist/` folder
- **AWS S3 + CloudFront**: Static hosting
- **GitHub Pages**: Deploy from `dist/` folder

#### Environment Variables for Production

**Backend:**
```bash
OPENAI_API_KEY=your_key
CORS_ORIGINS=https://your-frontend-domain.com
VECTOR_STORE_DIR=/app/vector_stores
```

**Frontend:**
```bash
VITE_API_BASE_URL=https://your-backend-domain.com
```

### Example: Deploy to Render

#### Backend:
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `pip install -r backend/requirements.txt`
4. Set start command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable: `OPENAI_API_KEY`

#### Frontend:
1. Create new Static Site on Render
2. Connect GitHub repository
3. Set build command: `cd frontend && npm install && npm run build`
4. Set publish directory: `frontend/dist`
5. Add environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com`

## 🛠️ Configuration

### Backend Configuration

Edit `backend/app/core/config.py` or set environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `CORS_ORIGINS`: Allowed CORS origins
- `VECTOR_STORE_DIR`: Directory for vector stores
- `CHUNK_SIZE`: Text chunk size (default: 1000)
- `CHUNK_OVERLAP`: Chunk overlap (default: 200)
- `EMBEDDING_MODEL`: Embedding model (default: text-embedding-3-small)
- `LLM_MODEL`: LLM model (default: gpt-4o-mini)
- `LLM_TEMPERATURE`: LLM temperature (default: 0.2)
- `RETRIEVER_K`: Number of retrieved docs (default: 4)

### Frontend Configuration

Edit `frontend/.env`:

- `VITE_API_BASE_URL`: Backend API URL

## 📁 Project Structure

```
13_Yt_Bot_Project/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py          # Configuration
│   │   │   └── rag_service.py     # RAG service logic
│   │   ├── routers/
│   │   │   ├── video.py           # Video processing endpoints
│   │   │   └── chat.py            # Chat endpoints
│   │   └── main.py               # FastAPI app
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoInput.jsx    # Video input component
│   │   │   └── ChatInterface.jsx # Chat interface
│   │   ├── services/
│   │   │   └── api.js            # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
├── docker-compose.yml
└── README.md
```

## 🔒 Security Considerations

- **API Keys**: Never commit `.env` files to version control
- **CORS**: Configure CORS origins properly for production
- **Rate Limiting**: Consider adding rate limiting for production
- **Input Validation**: All inputs are validated on the backend
- **Error Handling**: Proper error handling prevents information leakage

## 🐛 Troubleshooting

### Backend Issues

**Import errors:**
```bash
pip install -r requirements.txt
```

**OpenAI API errors:**
- Check your API key is correct
- Ensure you have sufficient credits
- Check rate limits

**Vector store errors:**
- Ensure `vector_stores/` directory exists
- Check file permissions

### Frontend Issues

**API connection errors:**
- Check `VITE_API_BASE_URL` is correct
- Ensure backend is running
- Check CORS configuration

**Build errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 💼 Project Showcase (For Resume)

### 🎯 Project Highlights
- **Full-Stack Application**: React frontend + FastAPI backend
- **AI-Powered**: RAG (Retrieval Augmented Generation) with OpenAI GPT-4o-mini
- **Production Deployment**: Deployed on Netlify (Frontend) + Render (Backend)
- **Modern Tech Stack**: React, FastAPI, LangChain, FAISS, Tailwind CSS
- **Vector Database**: FAISS for efficient similarity search
- **RESTful API**: Well-documented FastAPI endpoints
- **Docker Support**: Containerized deployment ready

### 🔗 Live Links
- **Frontend:** [Live Application](https://your-app-name.netlify.app)
- **Backend API:** [API Documentation](https://your-backend.onrender.com/docs)
- **GitHub:** [Repository](https://github.com/Ajay2700/Youtube-ChatBot)

### 🛠️ Key Technologies
- **Frontend:** React, Vite, Tailwind CSS, Axios
- **Backend:** FastAPI, Python, LangChain, OpenAI API
- **Vector Store:** FAISS
- **Deployment:** Netlify, Render
- **DevOps:** Docker, Docker Compose

### 📊 Features Implemented
- ✅ YouTube transcript fetching and processing
- ✅ Text chunking and embedding generation
- ✅ Vector similarity search
- ✅ RAG-based question answering
- ✅ Real-time chat interface
- ✅ Error handling and retry logic
- ✅ CORS configuration
- ✅ Environment variable management
- ✅ Production-ready deployment

---

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using FastAPI, React, OpenAI, and LangChain**
