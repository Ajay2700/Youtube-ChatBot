# ⚡ Quick Fix: Netlify Environment Variable

## 🎯 The Problem

Your Netlify frontend is trying to connect to `localhost:8000` instead of your Render backend.

## ✅ Quick Fix (3 Steps)

### Step 1: Get Your Render Backend URL

1. Go to: https://dashboard.render.com
2. Click your backend service
3. Copy the URL (e.g., `https://youtube-chatbot-e7ub.onrender.com`)

---

### Step 2: Add Environment Variable in Netlify

1. Go to: https://app.netlify.com
2. Click your site: **youtube-chatbots**
3. Click: **"Site configuration"** → **"Environment variables"**
4. Click: **"+ Add a variable"**
5. Enter:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://youtube-chatbot-e7ub.onrender.com` (your Render URL)
6. Click: **"Add variable"**

---

### Step 3: Redeploy

1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait 2-5 minutes
4. **Hard refresh** your browser: `Ctrl+Shift+R`

---

## ✅ Done!

Your app should now work! The frontend will connect to your Render backend.

---

## 🔍 Still Not Working?

1. **Check** the variable name is exactly `VITE_API_BASE_URL` (case-sensitive)
2. **Verify** Render URL is correct (test it: `https://your-backend.onrender.com/health`)
3. **Update CORS** in Render (add your Netlify URL to `CORS_ORIGINS`)
4. **Clear browser cache** and hard refresh

---

**That's it! Your app should be working now! 🎉**
