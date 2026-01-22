# Deployment Guide

This guide covers deploying the YouTube Transcript Chatbot to various hosting platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Full Stack Deployment](#full-stack-deployment)
- [Environment Variables](#environment-variables)

## Prerequisites

- GitHub repository with your code
- OpenAI API key
- Account on your chosen hosting platform

## Backend Deployment

### Option 1: Render (Recommended)

1. **Create New Web Service**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Settings**
   - **Name**: `yt-chatbot-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`

3. **Environment Variables**
   ```
   OPENAI_API_KEY=your_openai_api_key
   CORS_ORIGINS=https://your-frontend-domain.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://yt-chatbot-backend.onrender.com`)

### Option 2: Railway

1. **Create New Project**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Service**
   - Railway auto-detects Python
   - Set root directory to `backend`
   - Add environment variables (see below)

3. **Environment Variables**
   ```
   OPENAI_API_KEY=your_openai_api_key
   PORT=8000
   ```

4. **Deploy**
   - Railway auto-deploys on push
   - Get your backend URL from the service dashboard

### Option 3: Fly.io

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**
   ```bash
   fly auth login
   ```

3. **Create App**
   ```bash
   cd backend
   fly launch
   ```

4. **Set Environment Variables**
   ```bash
   fly secrets set OPENAI_API_KEY=your_key
   ```

5. **Deploy**
   ```bash
   fly deploy
   ```

### Option 4: AWS (ECS/Fargate)

1. **Build Docker Image**
   ```bash
   cd backend
   docker build -t yt-chatbot-backend .
   ```

2. **Push to ECR**
   ```bash
   aws ecr create-repository --repository-name yt-chatbot-backend
   docker tag yt-chatbot-backend:latest YOUR_ACCOUNT.dkr.ecr.REGION.amazonaws.com/yt-chatbot-backend:latest
   docker push YOUR_ACCOUNT.dkr.ecr.REGION.amazonaws.com/yt-chatbot-backend:latest
   ```

3. **Create ECS Task Definition**
   - Use AWS Console or CloudFormation
   - Set environment variables
   - Configure port 8000

4. **Deploy Service**
   - Create ECS service from task definition
   - Configure load balancer

### Option 5: Google Cloud Run

1. **Build Container**
   ```bash
   cd backend
   gcloud builds submit --tag gcr.io/PROJECT_ID/yt-chatbot-backend
   ```

2. **Deploy**
   ```bash
   gcloud run deploy yt-chatbot-backend \
     --image gcr.io/PROJECT_ID/yt-chatbot-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars OPENAI_API_KEY=your_key
   ```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend-domain.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel auto-deploys on every push

### Option 2: Netlify

1. **Create New Site**
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository

2. **Configure Build**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

3. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend-domain.com
   ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify auto-deploys on push

### Option 3: AWS S3 + CloudFront

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure caching

4. **Set Environment Variables**
   - Build with correct `VITE_API_BASE_URL`
   - Or use CloudFront functions for runtime config

### Option 4: GitHub Pages

1. **Install gh-pages**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/yt-chatbot"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## Full Stack Deployment

### Docker Compose on VPS

1. **Setup Server**
   ```bash
   # Install Docker & Docker Compose
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

2. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd 13_Yt_Bot_Project
   ```

3. **Configure Environment**
   ```bash
   echo "OPENAI_API_KEY=your_key" > .env
   ```

4. **Deploy**
   ```bash
   docker-compose up -d
   ```

5. **Configure Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
       }

       location /api {
           proxy_pass http://localhost:8000;
       }
   }
   ```

## Environment Variables

### Backend

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key | Yes | - |
| `CORS_ORIGINS` | Comma-separated CORS origins | No | localhost:3000 |
| `VECTOR_STORE_DIR` | Vector store directory | No | ./vector_stores |
| `CHUNK_SIZE` | Text chunk size | No | 1000 |
| `CHUNK_OVERLAP` | Chunk overlap | No | 200 |
| `EMBEDDING_MODEL` | Embedding model | No | text-embedding-3-small |
| `LLM_MODEL` | LLM model | No | gpt-4o-mini |
| `LLM_TEMPERATURE` | LLM temperature | No | 0.2 |
| `RETRIEVER_K` | Number of retrieved docs | No | 4 |

### Frontend

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL | No | http://localhost:8000 |

## Post-Deployment Checklist

- [ ] Backend is accessible and responding
- [ ] Frontend can connect to backend
- [ ] CORS is properly configured
- [ ] Environment variables are set correctly
- [ ] SSL/HTTPS is enabled (for production)
- [ ] Error handling is working
- [ ] Logs are accessible
- [ ] Monitoring is set up (optional)

## Monitoring & Maintenance

### Health Checks

- Backend: `GET /health`
- Frontend: Check if page loads

### Logs

- **Render**: Available in dashboard
- **Railway**: Available in dashboard
- **Vercel**: Available in dashboard
- **Docker**: `docker-compose logs -f`

### Updates

1. Push changes to GitHub
2. Platform auto-deploys (if configured)
3. Or manually trigger deployment

## Troubleshooting

### Backend Not Starting

- Check environment variables
- Check logs for errors
- Verify OpenAI API key is valid
- Check port availability

### Frontend Can't Connect

- Verify `VITE_API_BASE_URL` is correct
- Check CORS configuration
- Verify backend is running
- Check network/firewall settings

### Build Failures

- Check dependencies are installed
- Verify Node.js/Python versions
- Check for syntax errors
- Review build logs

---

For platform-specific issues, refer to the hosting platform's documentation.
