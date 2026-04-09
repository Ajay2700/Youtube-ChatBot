# YouTube Transcript Chatbot

A production-ready web application that allows users to chat with YouTube video transcripts using RAG (Retrieval Augmented Generation) powered by OpenAI and LangChain.

## 🚀 Features

- **YouTube Transcript Fetching**: Automatically fetches transcripts from YouTube videos
- **RAG-Powered Chat**: Ask questions about video content using AI
- **Vector Store**: Persistent FAISS vector store for efficient retrieval
- **Modern UI**: Beautiful React frontend with Tailwind CSS
- **RESTful API**: FastAPI backend with proper error handling
- **Proxy Support**: Built-in residential proxy integration (Webshare / generic HTTPS) to bypass YouTube cloud IP blocks
- **CORS Regex**: Dynamic origin matching for Netlify deploy previews
- **Docker Support**: Easy deployment with Docker Compose
- **Production Ready**: Deployed on Netlify (Frontend) + Render (Backend)

## 📋 Prerequisites

- Python 3.11+
- Node.js 20+
- Docker & Docker Compose (optional, for containerized deployment)
- OpenAI API Key
- Residential proxy credentials (required for cloud deployment — free tier at [webshare.io](https://www.webshare.io/))

## 🏗️ Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │────────▶│   FastAPI   │────────▶│   OpenAI    │
│  Frontend   │  HTTP   │   Backend   │  API    │   API       │
│  (Netlify)  │         │  (Render)   │         │             │
└─────────────┘         └──────┬──────┘         └─────────────┘
                               │
                    ┌──────────┼──────────┐
                    ▼                     ▼
              ┌───────────┐       ┌──────────────┐
              │   FAISS   │       │  Webshare    │
              │  Vector   │       │  Proxy       │
              │  Store    │       │  (YouTube)   │
              └───────────┘       └──────────────┘
```

<img width="1494" height="879" alt="00" src="https://github.com/user-attachments/assets/8096af16-b631-4bdf-b046-880dad163cce" />

<img width="1322" height="900" alt="image" src="https://github.com/user-attachments/assets/4ebbdf15-0ade-4723-b217-b47db2ae7b3a" />

## 🚀 Quick Start

### Option 1: Local Development

#### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```bash
OPENAI_API_KEY=your_openai_api_key
```

Start the server:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Docker Compose

```bash
echo "OPENAI_API_KEY=your_openai_api_key" > .env
docker-compose up --build
```

### Option 3: Production (Netlify + Render)

See the [Production Deployment](#-production-deployment-netlify--render) section below.

## 📖 Usage

1. **Enter YouTube URL**: Paste a YouTube video URL in the input field
2. **Process Video**: Click "Process Video" to fetch transcript and create embeddings
3. **Start Chatting**: Ask questions about the video content
4. **Get Answers**: Receive AI-powered answers based on the video transcript

## 🔌 API Endpoints

### Health Check
```http
GET /health
```

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

## 🌐 Production Deployment (Netlify + Render)

### Backend on Render

1. Create a new **Web Service** on [Render](https://dashboard.render.com/)
2. Connect your GitHub repository
3. Configure:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | Python |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

4. Add environment variables:

| Variable | Value |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `CORS_ORIGINS` | `https://your-site.netlify.app,http://localhost:3000` |
| `VECTOR_STORE_DIR` | `/opt/render/project/src/backend/vector_stores` |
| `WEBSHARE_PROXY_USERNAME` | Your Webshare proxy username |
| `WEBSHARE_PROXY_PASSWORD` | Your Webshare proxy password |

5. Deploy and verify: `https://your-backend.onrender.com/health`

### Frontend on Netlify

1. Create a new site on [Netlify](https://app.netlify.com/)
2. Connect your GitHub repository
3. Configure:

| Setting | Value |
|---|---|
| Base directory | `frontend` |
| Build command | `npm run build` |
| Publish directory | `dist` |

4. Add environment variable:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com` |

5. Deploy with **Clear cache and deploy site**

## 🔧 Configuration

### Backend Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | Yes | — | OpenAI API key for embeddings and chat |
| `CORS_ORIGINS` | No | `http://localhost:3000,...` | Comma-separated allowed origins |
| `CORS_ORIGIN_REGEX` | No | `^https:\/\/.*\.netlify\.app$` | Regex to match dynamic origins (e.g., Netlify deploy previews) |
| `VECTOR_STORE_DIR` | No | `./vector_stores` | Directory for FAISS vector stores |
| `CHUNK_SIZE` | No | `1000` | Text chunk size for splitting |
| `CHUNK_OVERLAP` | No | `200` | Overlap between text chunks |
| `EMBEDDING_MODEL` | No | `text-embedding-3-small` | OpenAI embedding model |
| `LLM_MODEL` | No | `gpt-4o-mini` | OpenAI chat model |
| `LLM_TEMPERATURE` | No | `0.2` | LLM temperature |
| `RETRIEVER_K` | No | `4` | Number of documents to retrieve |
| `WEBSHARE_PROXY_USERNAME` | No | — | Webshare.io proxy username (for cloud deploy) |
| `WEBSHARE_PROXY_PASSWORD` | No | — | Webshare.io proxy password (for cloud deploy) |
| `HTTPS_PROXY_URL` | No | — | Generic HTTPS proxy URL (alternative to Webshare) |

### Frontend Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | Yes (prod) | `http://127.0.0.1:8000` (dev) | Backend API URL |

## 🌐 Proxy Setup (Cloud Deployment)

YouTube blocks transcript requests from cloud provider IPs (Render, AWS, GCP, etc.). A residential proxy is required for production deployment.

### Option A: Webshare (Recommended)

1. Sign up at [webshare.io](https://www.webshare.io/) (free tier: 10 proxies)
2. Go to **Dashboard → Proxy → Rotating Proxy**
3. Copy your **username** and **password**
4. Set in Render env vars:
   - `WEBSHARE_PROXY_USERNAME=your_username`
   - `WEBSHARE_PROXY_PASSWORD=your_password`

### Option B: Generic HTTPS Proxy

Set in Render env vars:

```bash
HTTPS_PROXY_URL=https://user:pass@proxy.example.com:8080
```

### Local Development

No proxy needed — YouTube allows requests from residential/home IPs.

## 📁 Project Structure

```
Youtube-ChatBot/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py          # Configuration & env vars
│   │   │   └── rag_service.py     # RAG service, proxy, transcript fetching
│   │   ├── routers/
│   │   │   ├── video.py           # Video processing endpoints
│   │   │   └── chat.py            # Chat endpoints
│   │   └── main.py               # FastAPI app & CORS middleware
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoInput.jsx    # Video input component
│   │   │   └── ChatInterface.jsx # Chat interface
│   │   ├── services/
│   │   │   └── api.js            # API client (auto dev/prod URL)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── netlify.toml              # Netlify build config
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── render.yaml                   # Render blueprint
└── README.md
```

## 🔒 Security Considerations

- **API Keys**: Never commit `.env` files to version control
- **CORS**: Origins are restricted via `CORS_ORIGINS` and `CORS_ORIGIN_REGEX`
- **Proxy Credentials**: Stored as environment variables, never in code
- **Input Validation**: All inputs are validated on the backend
- **Error Handling**: Proper error handling prevents information leakage

## 🐛 Troubleshooting

### "Backend Server Not Connected"
- Ensure the backend is running and reachable
- Check `VITE_API_BASE_URL` points to the correct backend URL
- On Windows, use `127.0.0.1` instead of `localhost` (IPv6 mismatch)

### "YouTube is blocking requests"
- This happens on cloud servers (Render, AWS, etc.)
- Set up a proxy (see [Proxy Setup](#-proxy-setup-cloud-deployment))
- Works fine locally without a proxy

### OpenAI API errors
- Check your API key is correct
- Ensure you have sufficient credits
- The backend starts without `OPENAI_API_KEY` (health check works), but video processing requires it

### CORS errors
- Check `CORS_ORIGINS` includes your frontend domain
- `CORS_ORIGIN_REGEX` auto-allows all `*.netlify.app` domains
- Redeploy backend after changing CORS settings

### Build errors
```bash
# Backend
pip install -r requirements.txt

# Frontend
rm -rf node_modules package-lock.json
npm install
```

## 🛠️ Key Technologies

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Axios |
| Backend | FastAPI, Python, Uvicorn |
| AI/ML | LangChain, OpenAI GPT-4o-mini, OpenAI Embeddings |
| Vector Store | FAISS |
| Proxy | Webshare.io / Generic HTTPS proxy |
| Deployment | Netlify (frontend), Render (backend) |
| DevOps | Docker, Docker Compose |

## 📊 Features Implemented

- ✅ YouTube transcript fetching and processing
- ✅ Text chunking and embedding generation
- ✅ Vector similarity search (FAISS)
- ✅ RAG-based question answering
- ✅ Real-time chat interface
- ✅ Residential proxy support for cloud deployment
- ✅ Dynamic CORS with regex origin matching
- ✅ Lazy OpenAI initialization (server boots without API key)
- ✅ Error handling and retry logic
- ✅ Environment variable management
- ✅ Production deployment (Netlify + Render)
- ✅ Docker & Docker Compose support

## 🔗 Live Links

- **Frontend:** [Live Application](https://youtube-chatbots.netlify.app)
- **Backend API:** [API Documentation](https://youtube-chatbot-mrta.onrender.com/docs)
- **GitHub:** [Repository](https://github.com/Ajay2700/Youtube-ChatBot)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using FastAPI, React, OpenAI, and LangChain**
