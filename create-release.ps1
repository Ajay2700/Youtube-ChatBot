# PowerShell script to create a GitHub release
# Usage: .\create-release.ps1

Write-Host "`n🚀 Creating GitHub Release for YouTube Transcript Chatbot" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Check if gh CLI is installed
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI (gh) is not installed!" -ForegroundColor Red
    Write-Host "`nInstall it from: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host "Or create release manually at: https://github.com/Ajay2700/Youtube-ChatBot/releases/new`n" -ForegroundColor Yellow
    exit 1
}

# Check if logged in
Write-Host "Checking GitHub authentication..." -ForegroundColor Yellow
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to GitHub!" -ForegroundColor Red
    Write-Host "`nRun: gh auth login`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Authenticated to GitHub`n" -ForegroundColor Green

# Get version
$version = Read-Host "Enter version (e.g., v1.0.0)"
if ([string]::IsNullOrWhiteSpace($version)) {
    $version = "v1.0.0"
    Write-Host "Using default version: $version" -ForegroundColor Yellow
}

# Get release title
$title = Read-Host "Enter release title (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($title)) {
    $title = "YouTube Transcript Chatbot - $version"
}

# Get deployment URLs
Write-Host "`n📝 Enter your deployment URLs:" -ForegroundColor Cyan
$frontendUrl = Read-Host "Frontend URL (Netlify)"
$backendUrl = Read-Host "Backend URL (Render)"

# Create release notes
$releaseNotes = @"
# 🚀 YouTube Transcript Chatbot - Release $version

## 🌐 Live Deployment

### Frontend (Netlify)
- **Live URL:** $frontendUrl
- **Status:** ✅ Deployed
- **Framework:** React + Vite + Tailwind CSS

### Backend (Render)
- **API URL:** $backendUrl
- **API Docs:** $backendUrl/docs
- **Health Check:** $backendUrl/health
- **Framework:** FastAPI + Python 3.13

---

## ✨ Features

- ✅ YouTube Transcript Fetching
- ✅ RAG-Powered Chat with OpenAI GPT-4o-mini
- ✅ FAISS Vector Store for Efficient Retrieval
- ✅ Modern React UI with Glassmorphism Design
- ✅ RESTful API with FastAPI
- ✅ Docker Support
- ✅ Production-Ready Deployment

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP Client

### Backend
- **FastAPI** - Web Framework
- **Python 3.13** - Programming Language
- **LangChain** - RAG Framework
- **OpenAI** - LLM & Embeddings
- **FAISS** - Vector Store
- **YouTube Transcript API** - Transcript Fetching

---

## 📦 Installation

### Quick Start (Docker)
``````bash
docker-compose up --build
``````

### Local Development
``````bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
``````

---

## 🔗 Links

- **GitHub Repository:** https://github.com/Ajay2700/Youtube-ChatBot
- **Live Application:** $frontendUrl
- **API Documentation:** $backendUrl/docs

---

## 📝 License

MIT License

---

**Built with ❤️ using FastAPI, React, OpenAI, and LangChain**
"@

# Save release notes to temp file
$notesFile = "$env:TEMP\release-notes-$version.md"
$releaseNotes | Out-File -FilePath $notesFile -Encoding UTF8

Write-Host "`n📄 Release notes saved to: $notesFile" -ForegroundColor Green
Write-Host "`nCreating release..." -ForegroundColor Yellow

# Create release
gh release create $version `
    --title "$title" `
    --notes-file "$notesFile" `
    --latest

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Release created successfully!" -ForegroundColor Green
    Write-Host "`nView release at: https://github.com/Ajay2700/Youtube-ChatBot/releases/tag/$version" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Failed to create release" -ForegroundColor Red
    Write-Host "You can create it manually at: https://github.com/Ajay2700/Youtube-ChatBot/releases/new" -ForegroundColor Yellow
}

# Clean up
Remove-Item $notesFile -ErrorAction SilentlyContinue

Write-Host "`n"
