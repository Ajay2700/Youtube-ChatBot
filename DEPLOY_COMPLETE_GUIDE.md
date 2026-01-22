# 🚀 Complete Deployment Guide - Netlify + Render + GitHub

This guide will help you deploy the entire YouTube Transcript Chatbot project to production.

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Netlify account (free at https://netlify.com)
- ✅ Render account (free at https://render.com)
- ✅ OpenAI API Key

---

## Part 1: Push to GitHub

### Step 1: Initialize Git Repository

```powershell
cd D:\GENAI\GENERATIVE_AI_YOUTUBE\13_Yt_Bot_Project

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: YouTube Transcript Chatbot with React frontend and FastAPI backend"
```

### Step 2: Create GitHub Repository

1. **Go to:** https://github.com
2. **Click:** "New repository" (or "+" → "New repository")
3. **Repository name:** `youtube-transcript-chatbot` (or your preferred name)
4. **Description:** "AI-powered chatbot for YouTube video transcripts using RAG"
5. **Visibility:** Public or Private (your choice)
6. **DO NOT** initialize with README, .gitignore, or license
7. **Click:** "Create repository"

### Step 3: Connect and Push

```powershell
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/youtube-transcript-chatbot.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/youtube-transcript-chatbot.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**✅ Your code is now on GitHub!**

---

## Part 2: Deploy Backend to Render

### Step 1: Create Render Account

1. **Go to:** https://render.com
2. **Sign up** (free tier available)
3. **Verify** your email

### Step 2: Create Web Service

1. **Click:** "New +" → "Web Service"
2. **Connect** your GitHub account
3. **Select** your repository: `youtube-transcript-chatbot`

### Step 3: Configure Backend Service

**Basic Settings:**
- **Name:** `yt-chatbot-backend`
- **Region:** Choose closest to you (e.g., Oregon)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Environment:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Environment Variables:**
Click "Add Environment Variable" and add:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `CORS_ORIGINS` | `https://your-app-name.netlify.app,http://localhost:3000` |
| `VECTOR_STORE_DIR` | `/opt/render/project/src/backend/vector_stores` |

**Note:** Replace `your-app-name.netlify.app` with your actual Netlify URL (you'll get this after deploying frontend)

### Step 4: Deploy

1. **Click:** "Create Web Service"
2. **Wait** for deployment (5-10 minutes)
3. **Copy** your backend URL (e.g., `https://yt-chatbot-backend.onrender.com`)

**✅ Backend is deployed!**

---

## Part 3: Deploy Frontend to Netlify

### Step 1: Create Netlify Account

1. **Go to:** https://netlify.com
2. **Sign up** (free tier available)
3. **Verify** your email

### Step 2: Deploy from GitHub

1. **Click:** "Add new site" → "Import an existing project"
2. **Connect** to GitHub
3. **Select** your repository: `youtube-transcript-chatbot`

### Step 3: Configure Build Settings

**Build Settings:**
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `frontend/dist`

**Environment Variables:**
Click "Add variable" and add:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | Your Render backend URL (e.g., `https://yt-chatbot-backend.onrender.com`) |

### Step 4: Deploy

1. **Click:** "Deploy site"
2. **Wait** for deployment (2-5 minutes)
3. **Copy** your Netlify URL (e.g., `https://youtube-chatbot.netlify.app`)

**✅ Frontend is deployed!**

---

## Part 4: Update CORS Settings

### Update Backend CORS

1. **Go to:** Render Dashboard → Your Backend Service
2. **Click:** "Environment" tab
3. **Update** `CORS_ORIGINS` variable:
   ```
   https://your-app-name.netlify.app,http://localhost:3000
   ```
   Replace `your-app-name.netlify.app` with your actual Netlify URL
4. **Click:** "Save Changes"
5. **Wait** for automatic redeployment

---

## Part 5: Verify Deployment

### Test Backend

1. **Visit:** `https://your-backend.onrender.com/health`
   - Should return: `{"status":"healthy"}`

2. **Visit:** `https://your-backend.onrender.com/docs`
   - Should show Swagger API documentation

### Test Frontend

1. **Visit:** Your Netlify URL (e.g., `https://your-app.netlify.app`)
2. **Check** connection status (should show "Connected")
3. **Test** processing a YouTube video
4. **Test** asking questions

---

## Quick Deployment Checklist

### GitHub
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] Repository is accessible

### Render (Backend)
- [ ] Render account created
- [ ] Web service created
- [ ] GitHub repository connected
- [ ] Environment variables set:
  - [ ] `OPENAI_API_KEY`
  - [ ] `CORS_ORIGINS`
- [ ] Backend deployed and accessible
- [ ] Health check passing

### Netlify (Frontend)
- [ ] Netlify account created
- [ ] GitHub repository connected
- [ ] Build settings configured:
  - [ ] Base directory: `frontend`
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `frontend/dist`
- [ ] Environment variable set:
  - [ ] `VITE_API_BASE_URL` = Render backend URL
- [ ] Frontend deployed and accessible

### Configuration
- [ ] Backend CORS updated with Netlify URL
- [ ] Frontend API URL points to Render backend
- [ ] Both services communicating correctly

---

## Environment Variables Reference

### Render (Backend)

```bash
OPENAI_API_KEY=sk-proj-your-actual-key-here
CORS_ORIGINS=https://your-app.netlify.app,http://localhost:3000
VECTOR_STORE_DIR=/opt/render/project/src/backend/vector_stores
```

### Netlify (Frontend)

```bash
VITE_API_BASE_URL=https://yt-chatbot-backend.onrender.com
```

---

## Troubleshooting

### Backend Not Starting on Render

**Issue:** Build fails or service won't start

**Solutions:**
1. Check build logs in Render dashboard
2. Verify `requirements.txt` is in `backend/` folder
3. Check Python version compatibility
4. Verify `OPENAI_API_KEY` is set correctly

---

### Frontend Can't Connect to Backend

**Issue:** Network error or CORS error

**Solutions:**
1. Verify `VITE_API_BASE_URL` is set in Netlify
2. Check backend CORS includes Netlify URL
3. Verify backend is running (check Render logs)
4. Test backend health endpoint directly

---

### CORS Errors

**Issue:** Browser shows CORS error

**Solutions:**
1. Update `CORS_ORIGINS` in Render with exact Netlify URL
2. Include protocol: `https://your-app.netlify.app` (not just domain)
3. No trailing slashes
4. Redeploy backend after CORS changes

---

## Updating Your Deployment

### Update Backend

```powershell
# Make changes to backend code
git add backend/
git commit -m "Update backend"
git push origin main

# Render will automatically redeploy
```

### Update Frontend

```powershell
# Make changes to frontend code
git add frontend/
git commit -m "Update frontend"
git push origin main

# Netlify will automatically redeploy
```

---

## Custom Domain (Optional)

### Netlify Custom Domain

1. **Go to:** Netlify Dashboard → Your Site → Domain settings
2. **Click:** "Add custom domain"
3. **Enter** your domain name
4. **Follow** DNS configuration instructions
5. **Wait** for SSL certificate (automatic)

### Render Custom Domain

1. **Go to:** Render Dashboard → Your Service → Settings
2. **Click:** "Custom Domains"
3. **Add** your domain
4. **Configure** DNS as instructed

---

## Cost Estimate

### Free Tier (Recommended for Start)

- **Render:** Free tier available (spins down after inactivity)
- **Netlify:** Free tier available (100GB bandwidth/month)
- **OpenAI API:** Pay-as-you-go (very affordable)

### Estimated Monthly Cost

- **Render:** $0 (free tier) or $7/month (starter plan)
- **Netlify:** $0 (free tier) or $19/month (pro plan)
- **OpenAI API:** ~$5-20/month (depending on usage)

**Total:** $0-40/month depending on usage

---

## Support & Resources

- **Render Docs:** https://render.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **GitHub Docs:** https://docs.github.com

---

## Success Indicators

✅ Backend health check: `https://your-backend.onrender.com/health` returns `{"status":"healthy"}`

✅ Frontend loads: `https://your-app.netlify.app` shows the application

✅ Connection works: Frontend shows "Connected" status

✅ Can process videos: YouTube URL processing works

✅ Can chat: AI responses are generated

---

**🎉 Your app is now live in production!**

Share your Netlify URL with others to use your YouTube Transcript Chatbot!
