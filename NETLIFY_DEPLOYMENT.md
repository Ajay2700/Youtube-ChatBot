# 🚀 Deploy to Netlify - Complete Guide

This guide will help you deploy the YouTube Transcript Chatbot frontend to Netlify.

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Netlify account (free at https://netlify.com)
- ✅ Backend deployed (Render, Railway, etc.)
- ✅ Backend URL ready

---

## Step 1: Deploy Backend First

**Important:** You must deploy the backend before deploying the frontend!

### Option A: Deploy to Render (Recommended - Free)

1. **Go to:** https://render.com
2. **Create account** (free tier available)
3. **Click:** "New +" → "Web Service"
4. **Connect** your GitHub repository
5. **Configure:**
   - **Name:** `yt-chatbot-backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory:** `backend`
6. **Add Environment Variable:**
   - **Key:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key
7. **Click:** "Create Web Service"
8. **Wait** for deployment (2-5 minutes)
9. **Copy** your backend URL (e.g., `https://yt-chatbot-backend.onrender.com`)

### Option B: Deploy to Railway

1. **Go to:** https://railway.app
2. **Create account**
3. **Click:** "New Project" → "Deploy from GitHub repo"
4. **Select** your repository
5. **Add environment variable:** `OPENAI_API_KEY`
6. **Deploy** and get your URL

---

## Step 2: Update CORS Settings

Before deploying frontend, update backend CORS to allow Netlify domain:

**File:** `backend/app/core/config.py`

```python
CORS_ORIGINS: List[str] = [
    "https://your-app-name.netlify.app",  # Add your Netlify URL here
    "http://localhost:3000",
    "http://localhost:5173",
]
```

**Or** set it via environment variable in your backend hosting:
```
CORS_ORIGINS=https://your-app-name.netlify.app,http://localhost:3000
```

---

## Step 3: Prepare Frontend for Netlify

### 3.1 Create Netlify Configuration

**File:** `frontend/netlify.toml` (already created)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

### 3.2 Create Redirects File

**File:** `frontend/public/_redirects` (already created)

```
/*    /index.html   200
```

### 3.3 Update API URL

**Option A: Environment Variable (Recommended)**

When deploying on Netlify, add environment variable:
- **Key:** `VITE_API_BASE_URL`
- **Value:** Your backend URL (e.g., `https://yt-chatbot-backend.onrender.com`)

**Option B: Update Code**

**File:** `frontend/src/services/api.js`

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url.onrender.com'
```

---

## Step 4: Deploy to Netlify

### Method 1: Via Netlify Dashboard (Easiest)

1. **Go to:** https://app.netlify.com
2. **Sign in** or create account
3. **Click:** "Add new site" → "Import an existing project"
4. **Connect** to GitHub
5. **Select** your repository
6. **Configure build settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
7. **Click:** "Show advanced" → "New variable"
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** Your backend URL (e.g., `https://yt-chatbot-backend.onrender.com`)
8. **Click:** "Deploy site"
9. **Wait** for deployment (2-5 minutes)

### Method 2: Via Netlify CLI

```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to frontend
cd frontend

# Initialize Netlify (first time only)
netlify init

# Deploy to production
netlify deploy --prod
```

---

## Step 5: Verify Deployment

1. **Visit** your Netlify URL (e.g., `https://your-app-name.netlify.app`)
2. **Test** the application:
   - Paste a YouTube URL
   - Process video
   - Chat with AI

### Common Issues

**❌ CORS Error:**
- Verify backend CORS includes your Netlify URL
- Check backend is running and accessible

**❌ Network Error:**
- Verify `VITE_API_BASE_URL` is set correctly in Netlify
- Check backend URL is accessible
- Hard refresh browser (Ctrl+Shift+R)

**❌ 404 on Refresh:**
- Verify `_redirects` file exists in `public/` folder
- Check `netlify.toml` has redirects configured

---

## Step 6: Custom Domain (Optional)

1. **Go to:** Netlify Dashboard → Your Site → Domain settings
2. **Click:** "Add custom domain"
3. **Enter** your domain name
4. **Follow** DNS configuration instructions
5. **Wait** for SSL certificate (automatic)

---

## Environment Variables Reference

### Netlify Environment Variables

| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_BASE_URL` | Your backend URL | Yes |

### Backend Environment Variables

| Variable | Value | Required |
|----------|-------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `CORS_ORIGINS` | Comma-separated origins | Optional |

---

## Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Backend CORS updated with Netlify URL
- [ ] `netlify.toml` created in frontend folder
- [ ] `public/_redirects` created
- [ ] `VITE_API_BASE_URL` set in Netlify
- [ ] Frontend deployed to Netlify
- [ ] Application tested on Netlify URL
- [ ] Custom domain configured (optional)

---

## Quick Commands

### Build Frontend Locally
```powershell
cd frontend
npm run build
```

### Test Build Locally
```powershell
cd frontend
npm run build
npm run preview
```

### Deploy to Netlify
```powershell
cd frontend
netlify deploy --prod
```

---

## Troubleshooting

### Build Fails on Netlify

**Error:** `Module not found`

**Solution:**
- Ensure `package.json` has all dependencies
- Check Node version in `netlify.toml` matches your local version

---

### API Calls Fail

**Error:** `Network error` or `CORS error`

**Solution:**
1. Verify `VITE_API_BASE_URL` is set in Netlify
2. Check backend CORS includes Netlify domain
3. Verify backend is running and accessible
4. Check browser console for specific errors

---

### 404 on Page Refresh

**Error:** Page not found when refreshing

**Solution:**
- Verify `public/_redirects` file exists
- Check `netlify.toml` has redirects configured
- Rebuild and redeploy

---

## Support

For issues:
- Check Netlify deployment logs
- Check browser console (F12)
- Verify backend is running
- Check environment variables

---

**🎉 Your app is now live on Netlify!**

Visit your Netlify URL and start chatting with YouTube videos!
