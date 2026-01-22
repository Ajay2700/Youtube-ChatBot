# YouTube Transcript Chatbot - Frontend

React frontend for YouTube transcript chatbot using Vite.

## Features

- Modern, responsive UI with Tailwind CSS
- Video URL input and processing
- Real-time chat interface
- Error handling and loading states
- Dark mode support

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set environment variables:**
```bash
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL if needed
```

3. **Run development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
```

## Environment Variables

- `VITE_API_BASE_URL`: Backend API URL (default: http://localhost:8000)

## Docker

Build and run with Docker:
```bash
docker build -t yt-chatbot-frontend .
docker run -p 80:80 yt-chatbot-frontend
```
