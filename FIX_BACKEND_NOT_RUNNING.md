# 🔧 Fix: Backend Server Not Running Properly

## 🔍 Understanding the Problem

You have **TWO separate issues**:

1. **Netlify Frontend** is trying to connect to `localhost:8000` (wrong!)
2. **Backend** needs to be properly configured and running

---

## ✅ Solution 1: Fix Netlify to Use Render Backend

### Step 1: Get Your Render Backend URL

1. Go to: https://dashboard.render.com
2. Click your backend service
3. Copy the URL (e.g., `https://youtube-chatbot-e7ub.onrender.com`)

### Step 2: Add Environment Variable in Netlify

1. Go to: https://app.netlify.com
2. Click your site: **youtube-chatbots**
3. Click: **"Site configuration"** → **"Environment variables"**
4. Click: **"+ Add a variable"**
5. Enter:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** Your Render backend URL (e.g., `https://youtube-chatbot-e7ub.onrender.com`)
6. Click: **"Add variable"**

### Step 3: Redeploy Netlify

1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait 2-5 minutes
4. **Hard refresh** browser: `Ctrl+Shift+R`

---

## ✅ Solution 2: Verify Render Backend is Working

### Step 1: Test Render Backend

Open these URLs in your browser:

1. **Health Check:**
   ```
   https://your-backend.onrender.com/health
   ```
   Should return: `{"status":"healthy"}`

2. **API Docs:**
   ```
   https://your-backend.onrender.com/docs
   ```
   Should show FastAPI documentation

### Step 2: If Render Backend is Not Working

**Check Render Logs:**
1. Go to: Render Dashboard → Your Backend Service
2. Click: **"Logs"** tab
3. Look for errors

**Common Issues:**
- ❌ Build failed → Check build logs
- ❌ Service stopped → Click "Manual Deploy"
- ❌ Environment variables missing → Add `OPENAI_API_KEY`

---

## ✅ Solution 3: Fix CORS Issues (If Needed)

### Update CORS in Render

1. Go to: Render Dashboard → Your Backend → **"Environment"** tab
2. Find or add: `CORS_ORIGINS`
3. Set value to:
   ```
   https://youtube-chatbots.netlify.app,http://localhost:3000,http://localhost:5173
   ```
4. Click **"Save Changes"**
5. Wait for redeploy (2-5 minutes)

---

## ✅ Solution 4: Run Backend Locally (For Testing)

If you want to test locally:

### Step 1: Check .env File

```powershell
cd D:\GENAI\GENERATIVE_AI_YOUTUBE\13_Yt_Bot_Project\backend
```

Make sure `.env` exists and has:
```
OPENAI_API_KEY=sk-proj-your-key-here
```

### Step 2: Start Backend

```powershell
# Activate virtual environment
..\..\venv\Scripts\activate

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 3: Verify It's Running

Open: http://localhost:8000/health

Should return: `{"status":"healthy"}`

---

## 🔍 Troubleshooting

### Issue 1: OPTIONS Request Getting 400 Bad Request

**Problem:** CORS preflight requests failing

**Solution:**
1. Make sure CORS middleware is configured (already done in `main.py`)
2. Update `CORS_ORIGINS` in Render with your Netlify URL
3. Verify backend allows OPTIONS method (already configured)

### Issue 2: Backend Keeps Shutting Down

**Problem:** Server stops unexpectedly

**Solutions:**
1. **Render Free Tier:** Services spin down after inactivity
   - First request may take 30-60 seconds to wake up
   - This is normal for free tier
2. **Check Logs:** Look for errors in Render logs
3. **Restart Service:** Click "Manual Deploy" in Render

### Issue 3: Still Getting "Backend Server Not Connected"

**Checklist:**
- [ ] `VITE_API_BASE_URL` set in Netlify (not localhost)
- [ ] Netlify redeployed after adding variable
- [ ] Render backend is "Live" (not stopped)
- [ ] CORS includes Netlify URL
- [ ] Hard refreshed browser (`Ctrl+Shift+R`)
- [ ] Cleared browser cache

### Issue 4: Health Check Returns 400

**Problem:** `/health` endpoint returns 400 Bad Request

**Solution:**
The health endpoint is simple and should work. If it doesn't:
1. Check backend logs for errors
2. Verify FastAPI is running correctly
3. Try accessing `/docs` endpoint instead

---

## 📋 Quick Checklist

### For Netlify (Frontend):
- [ ] `VITE_API_BASE_URL` environment variable set
- [ ] Value is Render backend URL (not localhost)
- [ ] Site redeployed after adding variable
- [ ] Browser hard refreshed

### For Render (Backend):
- [ ] Service status is "Live"
- [ ] `OPENAI_API_KEY` environment variable set
- [ ] `CORS_ORIGINS` includes Netlify URL
- [ ] Health endpoint works: `/health`
- [ ] API docs accessible: `/docs`

---

## 🎯 Quick Fix Summary

**For Deployed App (Netlify → Render):**

1. **Set in Netlify:**
   ```
   VITE_API_BASE_URL = https://your-backend.onrender.com
   ```

2. **Set in Render:**
   ```
   CORS_ORIGINS = https://youtube-chatbots.netlify.app,http://localhost:3000
   ```

3. **Redeploy both** and **hard refresh** browser

**For Local Testing:**

1. Start backend: `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`
2. Start frontend: `npm run dev`
3. Open: http://localhost:3000

---

## ✅ Verify Everything Works

### Test Deployed App:
1. Visit: https://youtube-chatbots.netlify.app
2. Connection status should show "Connected" (green)
3. Try processing a YouTube video
4. Should work without errors

### Test Local App:
1. Backend: http://localhost:8000/health → `{"status":"healthy"}`
2. Frontend: http://localhost:3000
3. Connection status should show "Connected"

---

**After following these steps, your app should work! 🎉**
