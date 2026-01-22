# ✅ Deployment Checklist

Use this checklist to ensure everything is deployed correctly.

---

## Pre-Deployment

- [ ] All code is working locally
- [ ] Backend runs on http://localhost:8000
- [ ] Frontend runs on http://localhost:3000
- [ ] Can process YouTube videos
- [ ] Can chat with AI
- [ ] No errors in console

---

## GitHub Setup

- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Git initialized locally (`git init`)
- [ ] All files added (`git add .`)
- [ ] Initial commit created
- [ ] Remote added (`git remote add origin ...`)
- [ ] Code pushed to GitHub (`git push`)
- [ ] Repository is accessible on GitHub
- [ ] `.env` files are NOT in repository (checked .gitignore)

---

## Render (Backend) Deployment

- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] Web service created
- [ ] Repository selected
- [ ] Settings configured:
  - [ ] Name: `yt-chatbot-backend`
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `pip install -r requirements.txt`
  - [ ] Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Environment variables set:
  - [ ] `OPENAI_API_KEY` = Your OpenAI key
  - [ ] `CORS_ORIGINS` = `http://localhost:3000` (update after Netlify)
- [ ] Service deployed successfully
- [ ] Backend URL copied (e.g., `https://yt-chatbot-backend.onrender.com`)
- [ ] Health check works: `https://your-backend.onrender.com/health`
- [ ] API docs accessible: `https://your-backend.onrender.com/docs`

---

## Netlify (Frontend) Deployment

- [ ] Netlify account created
- [ ] GitHub connected to Netlify
- [ ] Site created from repository
- [ ] Build settings configured:
  - [ ] Base directory: `frontend`
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `frontend/dist`
- [ ] Environment variable set:
  - [ ] `VITE_API_BASE_URL` = Your Render backend URL
- [ ] Site deployed successfully
- [ ] Netlify URL copied (e.g., `https://youtube-chatbot.netlify.app`)
- [ ] Frontend loads correctly

---

## Post-Deployment Configuration

- [ ] Backend CORS updated with Netlify URL
- [ ] Backend redeployed after CORS update
- [ ] Frontend shows "Connected" status
- [ ] Can process YouTube videos on deployed site
- [ ] Can chat with AI on deployed site
- [ ] No console errors in browser

---

## Testing

- [ ] Backend health endpoint works
- [ ] Backend API docs accessible
- [ ] Frontend loads without errors
- [ ] Connection status shows "Connected"
- [ ] YouTube video processing works
- [ ] AI chat responses work
- [ ] Error handling works (test with invalid URL)

---

## Final Verification

- [ ] Share Netlify URL with others
- [ ] Test on mobile device
- [ ] Test with different YouTube videos
- [ ] Monitor Render logs for errors
- [ ] Monitor Netlify logs for errors
- [ ] Check OpenAI API usage/costs

---

## Optional Enhancements

- [ ] Custom domain configured (Netlify)
- [ ] Custom domain configured (Render)
- [ ] SSL certificates active
- [ ] Analytics set up (optional)
- [ ] Error monitoring set up (optional)

---

## Troubleshooting Checklist

If something doesn't work:

- [ ] Check Render deployment logs
- [ ] Check Netlify deployment logs
- [ ] Verify environment variables are set
- [ ] Test backend URL directly
- [ ] Check browser console for errors
- [ ] Verify CORS settings
- [ ] Check OpenAI API key is valid
- [ ] Verify API key has credits

---

**🎉 All checked? Your app is live!**
