# 🚀 Quick Start Guide - YouTube Transcript Chatbot

## Step-by-Step Instructions to Run the Project

### Prerequisites
- ✅ Python 3.11+ installed
- ✅ Node.js 20+ installed  
- ✅ OpenAI API Key

---

## Method 1: Run Locally (Recommended for Development)

### Step 1: Navigate to Project Directory
```bash
cd D:\GENAI\GENERATIVE_AI_YOUTUBE\13_Yt_Bot_Project
```

### Step 2: Setup Backend

#### 2.1 Navigate to backend folder
```bash
cd backend
```

#### 2.2 Create/Update .env file
Create a file named `.env` in the `backend` folder with:
```
OPENAI_API_KEY=your_actual_openai_api_key_here
```

**Important:** Replace `your_actual_openai_api_key_here` with your real OpenAI API key!

#### 2.3 Install Python dependencies
```bash
# Activate virtual environment (if using venv)
..\..\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### 2.4 Start Backend Server
```bash
# Set environment variable and start server
$env:OPENAI_API_KEY = (Get-Content .env | Select-String "OPENAI_API_KEY").ToString().Split('=')[1].Trim()
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Backend will run on:** http://localhost:8000
**API Docs:** http://localhost:8000/docs

---

### Step 3: Setup Frontend (Open a NEW Terminal)

#### 3.1 Navigate to frontend folder
```bash
cd D:\GENAI\GENERATIVE_AI_YOUTUBE\13_Yt_Bot_Project\frontend
```

#### 3.2 Install Node dependencies
```bash
npm install
```

#### 3.3 Start Frontend Server
```bash
npm run dev
```

**Frontend will run on:** http://localhost:3000

---

### Step 4: Access the Application

1. **Open your browser** and navigate to: **http://localhost:3000**

2. **Enter a YouTube URL** in the input field
   - Example: `https://www.youtube.com/watch?v=Gfr50f6ZBvo`

3. **Click "Process Video"** button
   - Wait for the transcript to be fetched and processed

4. **Start chatting!** Ask questions about the video content
   - Try: "What is this video about?"
   - Try: "Summarize the main points"
   - Try: "What are the key takeaways?"

---

## Method 2: Run with Docker Compose (Easiest)

### Step 1: Create .env file
```bash
cd D:\GENAI\GENERATIVE_AI_YOUTUBE\13_Yt_Bot_Project
echo OPENAI_API_KEY=your_actual_openai_api_key_here > .env
```

### Step 2: Start with Docker Compose
```bash
docker-compose up --build
```

This will start both backend and frontend automatically!

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

## Troubleshooting

### Backend won't start
- ✅ Check that `.env` file exists in `backend/` folder
- ✅ Verify `OPENAI_API_KEY` is set correctly (no quotes, no spaces)
- ✅ Make sure port 8000 is not already in use
- ✅ Check Python dependencies are installed: `pip install -r requirements.txt`

### Frontend won't start
- ✅ Check that Node.js is installed: `node --version`
- ✅ Install dependencies: `npm install`
- ✅ Make sure port 3000 is not already in use
- ✅ Check if backend is running first

### Can't connect to backend from frontend
- ✅ Verify backend is running on http://localhost:8000
- ✅ Check backend health: http://localhost:8000/health
- ✅ Verify CORS settings in `backend/app/core/config.py`

### API Key errors
- ✅ Ensure `.env` file is in `backend/` folder (not root)
- ✅ Check API key format: `OPENAI_API_KEY=sk-...` (no quotes)
- ✅ Verify API key is valid and has credits

---

## Quick Commands Reference

### Start Backend Only
```bash
cd backend
$env:OPENAI_API_KEY = (Get-Content .env | Select-String "OPENAI_API_KEY").ToString().Split('=')[1].Trim()
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Start Frontend Only
```bash
cd frontend
npm run dev
```

### Check if servers are running
```bash
# Check backend
curl http://localhost:8000/health

# Check frontend
curl http://localhost:3000
```

### Stop servers
- Press `Ctrl + C` in each terminal window

---

## Project Structure
```
13_Yt_Bot_Project/
├── backend/          # FastAPI backend
│   ├── app/
│   ├── .env         # ⚠️ Add your OPENAI_API_KEY here
│   └── requirements.txt
├── frontend/         # React frontend
│   ├── src/
│   └── package.json
└── docker-compose.yml
```

---

## Need Help?

- Check the main README.md for detailed documentation
- Check DEPLOYMENT.md for deployment instructions
- Verify all prerequisites are installed
- Check server logs for error messages

---

**Happy Chatting! 🎉**
