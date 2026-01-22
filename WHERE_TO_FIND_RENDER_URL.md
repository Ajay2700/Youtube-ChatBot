# 📍 Where to Find Your Render Backend URL

This guide shows you exactly where to find your Render backend URL after deployment.

---

## 🎯 Quick Answer

**Your Render backend URL is displayed at the top of your Render service dashboard.**

It looks like: `https://yt-chatbot-backend.onrender.com`

---

## 📋 Step-by-Step: Finding Your Render URL

### Step 1: Go to Render Dashboard

1. **Visit:** https://dashboard.render.com
2. **Login** to your account

### Step 2: Find Your Service

1. You'll see a list of your services
2. **Click** on your backend service (e.g., `yt-chatbot-backend`)

### Step 3: Copy the URL

**The URL is displayed in TWO places:**

#### Location 1: Top of the Page (Easiest)
```
┌─────────────────────────────────────────────────┐
│  yt-chatbot-backend                             │
│  https://yt-chatbot-backend.onrender.com  [🔗]  │  ← COPY THIS!
└─────────────────────────────────────────────────┘
```

#### Location 2: Settings Tab
1. Click **"Settings"** tab
2. Scroll to **"Service Details"** section
3. Find **"URL"** field
4. Copy the URL

---

## ✅ Verify Your URL Works

After copying the URL, test it:

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

---

## 🔧 Use This URL in Netlify

When deploying to Netlify, use this URL as:

**Environment Variable:**
- **Key:** `VITE_API_BASE_URL`
- **Value:** `https://yt-chatbot-backend.onrender.com` (your actual URL)

**Important:**
- ✅ Include `https://`
- ✅ No trailing slash
- ✅ Use the full URL

---

## 📸 Visual Guide

### Render Dashboard View:
```
┌─────────────────────────────────────────────────────────────┐
│  Render Dashboard                                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Services                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ yt-chatbot-backend                                    │  │
│  │ https://yt-chatbot-backend.onrender.com  [🔗 Copy]   │  │ ← HERE!
│  │ Status: Live  │  Region: Oregon                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Service Details View:
```
┌─────────────────────────────────────────────────────────────┐
│  yt-chatbot-backend                                          │
├─────────────────────────────────────────────────────────────┤
│  [Overview] [Logs] [Metrics] [Settings] [Events]            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Service Details                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Name: yt-chatbot-backend                              │  │
│  │ URL: https://yt-chatbot-backend.onrender.com  [Copy] │  │ ← OR HERE!
│  │ Region: Oregon                                        │  │
│  │ Status: Live                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚨 Common Issues

### Issue 1: URL Not Showing
**Problem:** URL is not visible yet

**Solution:** 
- Wait for deployment to complete (5-10 minutes)
- Check deployment status in "Events" tab
- URL appears only after successful deployment

### Issue 2: URL Shows "Pending"
**Problem:** Service is still deploying

**Solution:**
- Wait for deployment to finish
- Check "Logs" tab for progress
- URL will be active when status shows "Live"

### Issue 3: URL Not Working
**Problem:** Getting 404 or connection error

**Solution:**
- Check if service is "Live" (not "Stopped")
- Verify environment variables are set
- Check "Logs" tab for errors
- Test health endpoint: `/health`

---

## 📝 Example URLs

Your Render URL will look like one of these formats:

```
https://yt-chatbot-backend.onrender.com
https://youtube-chatbot-abc123.onrender.com
https://my-backend-xyz.onrender.com
```

**Format:** `https://[service-name].onrender.com`

---

## 🎯 Quick Checklist

- [ ] Deployed backend to Render
- [ ] Service status is "Live"
- [ ] Copied the URL from dashboard
- [ ] Tested `/health` endpoint
- [ ] URL works in browser
- [ ] Ready to use in Netlify

---

## 💡 Pro Tip

**Bookmark your Render dashboard** for easy access:
- https://dashboard.render.com

You can always find your URL there later!

---

**Need more help?** Check `DEPLOY_NOW.md` for full deployment steps.
