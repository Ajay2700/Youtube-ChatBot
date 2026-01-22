# 📦 GitHub Setup Guide

## Step-by-Step: Push Project to GitHub

### Step 1: Check Git Status

```powershell
cd D:\GENAI\GENERATIVE_AI_YOUTUBE\13_Yt_Bot_Project

# Check if git is initialized
git status
```

If you see "not a git repository", initialize it:

```powershell
git init
```

### Step 2: Create .gitignore (if needed)

The `.gitignore` file should already exist. Verify it includes:

```
.env
.env.local
venv/
node_modules/
vector_stores/
*.faiss
*.pkl
__pycache__/
dist/
build/
```

### Step 3: Add All Files

```powershell
# Add all files to staging
git add .

# Check what will be committed
git status
```

### Step 4: Create Initial Commit

```powershell
git commit -m "Initial commit: YouTube Transcript Chatbot - Full Stack RAG Application"
```

### Step 5: Create GitHub Repository

1. **Go to:** https://github.com/new
2. **Repository name:** `youtube-transcript-chatbot` (or your choice)
3. **Description:** `AI-powered chatbot for YouTube video transcripts using RAG with React and FastAPI`
4. **Visibility:** Choose Public or Private
5. **DO NOT** check "Initialize with README"
6. **Click:** "Create repository"

### Step 6: Connect Local to GitHub

```powershell
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/youtube-transcript-chatbot.git

# Verify remote
git remote -v
```

### Step 7: Push to GitHub

```powershell
# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**✅ Your code is now on GitHub!**

### Step 8: Verify on GitHub

1. **Visit:** `https://github.com/YOUR_USERNAME/youtube-transcript-chatbot`
2. **Verify** all files are present
3. **Check** that `.env` files are NOT visible (they should be ignored)

---

## Future Updates

### To push changes:

```powershell
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main
```

### To create a new branch:

```powershell
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

---

## Repository Structure on GitHub

Your GitHub repository should have:

```
youtube-transcript-chatbot/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── netlify.toml
│   └── public/
├── .gitignore
├── README.md
├── DEPLOY_COMPLETE_GUIDE.md
└── render.yaml
```

**Note:** `.env` files should NOT be in the repository (they're in .gitignore)

---

## Security Checklist

- [ ] `.env` files are in `.gitignore`
- [ ] No API keys in code
- [ ] No sensitive data committed
- [ ] Repository visibility set appropriately

---

**✅ Your project is ready for deployment!**
