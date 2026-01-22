# 🔧 Fix: Netlify Frontend Connecting to Localhost

## ❌ Problem

Your frontend on Netlify (`https://youtube-chatbots.netlify.app`) is trying to connect to `http://localhost:8000` instead of your Render backend.

**Why this happens:**
- The `VITE_API_BASE_URL` environment variable is not set in Netlify
- Or it's set to `localhost:8000` instead of your Render URL

---

## ✅ Solution: Add Environment Variable in Netlify

### Step 1: Get Your Render Backend URL

1. **Go to:** https://dashboard.render.com
2. **Click** on your backend service
3. **Copy** the URL (e.g., `https://youtube-chatbot-e7ub.onrender.com`)

**Or find it here:**
- Top of the service page
- Settings tab → Service Details → URL

---

### Step 2: Go to Netlify Dashboard

1. **Visit:** https://app.netlify.com
2. **Login** to your account
3. **Click** on your site: `youtube-chatbots` (or your site name)

---

### Step 3: Add Environment Variable

1. **Click** "Site configuration" (left sidebar)
   - OR click "Site settings" → "Environment variables"

2. **Click** "Add a variable" or "Add variable" button

3. **Enter:**
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** Your Render backend URL
     - Example: `https://youtube-chatbot-e7ub.onrender.com`
     - **Important:** Include `https://`, no trailing slash

4. **Click** "Save" or "Add variable"

---

### Step 4: Trigger Redeploy

After adding the variable, you need to redeploy:

**Option A: Manual Redeploy (Recommended)**
1. Go to "Deploys" tab
2. Click "Trigger deploy" → "Deploy site"
3. Wait 2-5 minutes

**Option B: Push to GitHub**
```powershell
# Make a small change and push
git commit --allow-empty -m "Trigger Netlify redeploy"
git push origin main
```

---

## 📋 Visual Guide

### Netlify Dashboard Navigation:
```
┌─────────────────────────────────────┐
│ Netlify Dashboard                   │
├─────────────────────────────────────┤
│ Sites                               │
│  ┌───────────────────────────────┐  │
│  │ youtube-chatbots             │  │ ← Click here
│  │ https://youtube-chatbots... │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Site Settings:
```
┌─────────────────────────────────────┐
│ youtube-chatbots                    │
├─────────────────────────────────────┤
│ [Overview] [Deploys] [Functions]   │
│ [Site configuration] ← Click here!  │
│ [Domain settings]                   │
└─────────────────────────────────────┘
```

### Environment Variables Section:
```
┌─────────────────────────────────────┐
│ Environment variables                │
├─────────────────────────────────────┤
│                                      │
│ [+ Add a variable] ← Click here!    │
│                                      │
│ (No variables set yet)              │
│                                      │
└─────────────────────────────────────┘
```

### Adding Variable:
```
┌─────────────────────────────────────┐
│ Add environment variable             │
├─────────────────────────────────────┤
│                                      │
│ Key:                                 │
│ [VITE_API_BASE_URL]                  │
│                                      │
│ Value:                               │
│ [https://youtube-chatbot-e7ub.onrender.com]
│                                      │
│ [Cancel]  [Add variable] ← Click!    │
└─────────────────────────────────────┘
```

### After Adding:
```
┌─────────────────────────────────────┐
│ Environment variables                │
├─────────────────────────────────────┤
│                                      │
│ Key                  Value           │
│ ─────────────────────────────────── │
│ VITE_API_BASE_URL    https://...    │
│                                      │
│ [+ Add a variable]                   │
└─────────────────────────────────────┘
```

---

## ✅ Verify It Works

### 1. Check Deployment Logs

1. Go to "Deploys" tab
2. Click on the latest deploy
3. Check build logs for:
   - ✅ `VITE_API_BASE_URL` should be in the build
   - ✅ No errors about missing variables

### 2. Test Your Site

1. **Visit:** https://youtube-chatbots.netlify.app
2. **Hard refresh:** `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. **Check:** Connection status should show "Connected"
4. **Test:** Try processing a YouTube video

---

## 🔍 Troubleshooting

### Issue 1: Variable Not Taking Effect

**Problem:** Added variable but still connecting to localhost

**Solutions:**
1. **Redeploy** the site (see Step 4 above)
2. **Hard refresh** browser (`Ctrl+Shift+R`)
3. **Clear browser cache**
4. **Check** variable name is exactly `VITE_API_BASE_URL` (case-sensitive)

### Issue 2: Can't Find Environment Variables

**Problem:** Don't see "Environment variables" option

**Solutions:**
1. Go to: Site → "Site configuration" → "Environment variables"
2. Or: Site → "Site settings" → "Build & deploy" → "Environment"
3. Make sure you're the site owner/admin

### Issue 3: Still Getting CORS Error

**Problem:** Frontend connects but gets CORS error

**Solutions:**
1. **Update Render CORS:**
   - Go to Render → Your Backend → Environment
   - Add/Update `CORS_ORIGINS` with your Netlify URL:
     ```
     https://youtube-chatbots.netlify.app,http://localhost:3000
     ```
2. **Wait** for Render to redeploy
3. **Test** again

### Issue 4: Build Fails

**Problem:** Deployment fails after adding variable

**Solutions:**
1. **Check** variable value has no spaces
2. **Verify** URL format: `https://your-backend.onrender.com`
3. **Check** build logs for specific errors
4. **Remove** and re-add the variable

---

## 📝 Quick Checklist

- [ ] Got Render backend URL
- [ ] Went to Netlify dashboard
- [ ] Clicked on your site
- [ ] Went to "Site configuration" → "Environment variables"
- [ ] Added `VITE_API_BASE_URL` with Render URL
- [ ] Triggered redeploy
- [ ] Waited for deployment (2-5 min)
- [ ] Hard refreshed browser
- [ ] Tested the app

---

## 🎯 Example Values

### Render Backend URL Format:
```
https://youtube-chatbot-e7ub.onrender.com
https://yt-chatbot-backend.onrender.com
https://your-service-name.onrender.com
```

### Netlify Environment Variable:
```
Key: VITE_API_BASE_URL
Value: https://youtube-chatbot-e7ub.onrender.com
```

**Important:**
- ✅ Always use `https://`
- ✅ No trailing slash (`/`)
- ✅ Full URL including domain

---

## 🚀 After Fixing

Once you've:
1. ✅ Added `VITE_API_BASE_URL` in Netlify
2. ✅ Redeployed the site
3. ✅ Hard refreshed your browser

Your app should work! The frontend will now connect to your Render backend instead of localhost.

---

**Need help?** Check the build logs in Netlify for any errors.
