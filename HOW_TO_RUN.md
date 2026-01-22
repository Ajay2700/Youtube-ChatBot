# 🚀 How to Run YouTube Transcript Chatbot - Complete Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start (5 Minutes)](#quick-start-5-minutes)
3. [Detailed Step-by-Step Guide](#detailed-step-by-step-guide)
4. [Troubleshooting](#troubleshooting)
5. [Deployment to Netlify](#deployment-to-netlify)

---

## Prerequisites

Before you begin, ensure you have:

- ✅ **Python 3.11+** installed ([Download](https://www.python.org/downloads/))
- ✅ **Node.js 20+** installed ([Download](https://nodejs.org/))
- ✅ **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- ✅ **Git** (optional, for cloning)

### Verify Installation

```powershell
# Check Python version
python --version
# Should show: Python 3.11.x or higher

# Check Node.js version
node --version
# Should show: v20.x.x or higher

# Check npm version
npm --version
```

---

## Quick Start (5 Minutes)

### Step 1: Navigate to Project
```powershell
cd D:\GENAI\GENERATIVE_AI_YOUTUBE\13_Yt_Bot_Project
```

### Step 2: Setup Backend

```powershell
# Go to backend folder
cd backend

# Create .env file (if not exists)
if (-not (Test-Path .env)) {
    "OPENAI_API_KEY=your_openai_api_key_here" | Out-File -Encoding ascii .env
    Write-Host "⚠️  Please edit backend/.env and add your OpenAI API key!"
}

# Install dependencies
..\..\venv\Scripts\python -m pip install -r requirements.txt

# Start backend server
$env:OPENAI_API_KEY = (Get-Content .env | Select-String "OPENAI_API_KEY").ToString().Split('=')[1].Trim()
..\..\venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**✅ Backend will run on:** http://localhost:8000

### Step 3: Setup Frontend (Open NEW Terminal)

```powershell
# Go to frontend folder
cd D:\GENAI\GENERATIVE_AI_YOUTUBE\13_Yt_Bot_Project\frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

**✅ Frontend will run on:** http://localhost:3000

### Step 4: Open Browser

1. Open your browser
2. Go to: **http://localhost:3000**
3. Paste a YouTube URL
4. Click "Process Video"
5. Start chatting! 🎉

---

## Detailed Step-by-Step Guide

### Part 1: Backend Setup

#### 1.1 Navigate to Backend Directory
```powershell
cd D:\GENAI\GENERATIVE_AI_YOUTUBE\13_Yt_Bot_Project\backend
```

#### 1.2 Create Environment File

Create a file named `.env` in the `backend` folder:

**File:** `backend/.env`
```
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
```

**⚠️ Important:**
- Replace `sk-proj-your-actual-api-key-here` with your real OpenAI API key
- No quotes around the key
- No spaces around the `=` sign
- The file must be named exactly `.env` (not `.env.txt`)

#### 1.3 Install Python Dependencies

```powershell
# Activate virtual environment (if using venv)
..\..\venv\Scripts\activate

# Install all required packages
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed fastapi-0.115.0 uvicorn-0.32.0 ...
```

#### 1.4 Start Backend Server

```powershell
# Load API key from .env file
$env:OPENAI_API_KEY = (Get-Content .env | Select-String "OPENAI_API_KEY").ToString().Split('=')[1].Trim()

# Start the server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**✅ Success indicators:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Keep this terminal window open!**

#### 1.5 Verify Backend is Running

Open a new browser tab and visit:
- **Health Check:** http://localhost:8000/health
- **API Docs:** http://localhost:8000/docs

You should see:
- Health endpoint returns: `{"status":"healthy"}`
- API docs show Swagger UI with available endpoints

---

### Part 2: Frontend Setup

#### 2.1 Open a NEW Terminal Window

**Important:** Keep the backend terminal running, open a **new** terminal window.

#### 2.2 Navigate to Frontend Directory

```powershell
cd D:\GENAI\GENERATIVE_AI_YOUTUBE\13_Yt_Bot_Project\frontend
```

#### 2.3 Install Node Dependencies

```powershell
npm install
```

**Expected output:**
```
added 339 packages, and audited 340 packages
```

**⏱️ This may take 2-5 minutes on first run**

#### 2.4 Start Frontend Development Server

```powershell
npm run dev
```

**✅ Success indicators:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Keep this terminal window open!**

---

### Part 3: Using the Application

#### 3.1 Open the Application

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Navigate to: **http://localhost:3000**

#### 3.2 Process a YouTube Video

1. **Paste a YouTube URL** in the input field:
   ```
   https://www.youtube.com/watch?v=Gfr50f6ZBvo
   ```

2. **Click "Process Video"** button
   - You'll see a loading indicator
   - Processing takes 10-30 seconds depending on video length
   - Wait for "Video processed successfully!" message

3. **Start Chatting!**
   - The chat interface will appear
   - Try these questions:
     - "What is this video about?"
     - "Summarize the main points"
     - "What are the key takeaways?"
     - "Explain the main topic in detail"

#### 3.3 Example Conversation

```
You: What is this video about?
Bot: [AI provides detailed answer based on transcript]

You: What are the main points discussed?
Bot: [AI lists key points from the video]
```

---

## Troubleshooting

### ❌ Backend Won't Start

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```powershell
cd backend
pip install -r requirements.txt
```

---

**Error:** `OPENAI_API_KEY environment variable not set`

**Solution:**
1. Check `.env` file exists in `backend/` folder
2. Verify format: `OPENAI_API_KEY=sk-...` (no quotes, no spaces)
3. Restart the backend server

---

**Error:** `Address already in use` or `Port 8000 is already in use`

**Solution:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

---

### ❌ Frontend Won't Start

**Error:** `'npm' is not recognized`

**Solution:**
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

---

**Error:** `Port 3000 is already in use`

**Solution:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Or Vite will automatically use next available port
```

---

### ❌ Network Error in Browser

**Error:** `Network Error` or `Failed to fetch`

**Solutions:**

1. **Verify Backend is Running:**
   ```powershell
   # Test backend health
   curl http://localhost:8000/health
   # Should return: {"status":"healthy"}
   ```

2. **Check Browser Console (F12):**
   - Look for CORS errors
   - Check if API URL is correct

3. **Hard Refresh Browser:**
   - Press `Ctrl + Shift + R` (Windows/Linux)
   - Press `Cmd + Shift + R` (Mac)

4. **Verify API URL:**
   - Check `frontend/src/services/api.js`
   - Should be: `http://localhost:8000`

---

### ❌ API Key Errors

**Error:** `Invalid API key` or `Insufficient credits`

**Solutions:**

1. **Verify API Key:**
   - Check it starts with `sk-`
   - Ensure no extra spaces or quotes
   - Verify it's active on OpenAI dashboard

2. **Check API Credits:**
   - Visit: https://platform.openai.com/usage
   - Ensure you have available credits

3. **Test API Key:**
   ```powershell
   # Test in Python
   python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('Key loaded:', bool(os.getenv('OPENAI_API_KEY')))"
   ```

---

## Deployment to Netlify

### Step 1: Prepare Frontend for Production

#### 1.1 Update API URL for Production

Create `frontend/.env.production`:
```
VITE_API_BASE_URL=https://your-backend-url.com
```

**Note:** Replace with your actual backend URL (e.g., Render, Railway, etc.)

#### 1.2 Build Frontend

```powershell
cd frontend
npm run build
```

This creates a `dist/` folder with production files.

---

### Step 2: Deploy Backend First

**Important:** Deploy backend to a service that supports Python:

**Recommended Options:**
- **Render** (Free tier available): https://render.com
- **Railway**: https://railway.app
- **Fly.io**: https://fly.io
- **AWS/GCP/Azure**: For production

**After deploying backend, note the URL:**
- Example: `https://yt-chatbot-backend.onrender.com`

---

### Step 3: Deploy Frontend to Netlify

#### 3.1 Create Netlify Configuration

Create `frontend/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 3.2 Create `frontend/public/_redirects`:

```
/*    /index.html   200
```

#### 3.3 Deploy via Netlify Dashboard

1. **Go to:** https://app.netlify.com
2. **Click:** "Add new site" → "Import an existing project"
3. **Connect** your GitHub repository
4. **Configure build settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
5. **Add environment variable:**
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** Your backend URL (e.g., `https://yt-chatbot-backend.onrender.com`)
6. **Click:** "Deploy site"

#### 3.4 Deploy via Netlify CLI (Alternative)

```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd frontend
netlify deploy --prod
```

---

### Step 4: Update CORS Settings

In your deployed backend, ensure CORS allows your Netlify domain:

**Backend:** `backend/app/core/config.py`
```python
CORS_ORIGINS: List[str] = [
    "https://your-app-name.netlify.app",
    "http://localhost:3000",
]
```

---

## Quick Command Reference

### Start Backend
```powershell
cd backend
$env:OPENAI_API_KEY = (Get-Content .env | Select-String "OPENAI_API_KEY").ToString().Split('=')[1].Trim()
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Start Frontend
```powershell
cd frontend
npm run dev
```

### Check Backend Health
```powershell
curl http://localhost:8000/health
```

### Build Frontend for Production
```powershell
cd frontend
npm run build
```

### Stop Servers
- Press `Ctrl + C` in each terminal window

---

## Project Structure

```
13_Yt_Bot_Project/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py          # Configuration
│   │   │   └── rag_service.py     # RAG logic
│   │   ├── routers/
│   │   │   ├── video.py           # Video endpoints
│   │   │   └── chat.py            # Chat endpoints
│   │   └── main.py                # FastAPI app
│   ├── .env                       # ⚠️ Add OPENAI_API_KEY here
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   ├── netlify.toml              # Netlify config
│   └── public/
│       └── _redirects            # Netlify redirects
├── docker-compose.yml
└── README.md
```

---

## Need More Help?

- 📖 Check main **README.md** for detailed documentation
- 🚀 Check **DEPLOYMENT.md** for deployment guides
- 🐛 Check terminal output for error messages
- 💬 Open an issue on GitHub

---

## Success Checklist

- [ ] Python 3.11+ installed
- [ ] Node.js 20+ installed
- [ ] OpenAI API key obtained
- [ ] Backend `.env` file created with API key
- [ ] Backend dependencies installed
- [ ] Backend server running on port 8000
- [ ] Frontend dependencies installed
- [ ] Frontend server running on port 3000
- [ ] Browser opens http://localhost:3000
- [ ] Can process YouTube videos
- [ ] Can chat with AI about videos

---

**🎉 Happy Chatting!**

For issues or questions, check the troubleshooting section above.
