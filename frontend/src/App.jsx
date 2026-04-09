import { useState, useEffect, useCallback } from 'react'
import VideoInput from './components/VideoInput'
import ChatInterface from './components/ChatInterface'
import { Youtube, Sparkles, ArrowLeft, Sun, Moon, Github } from 'lucide-react'
import { checkBackendHealth } from './services/api'

function App() {
  const [videoId, setVideoId] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const checkBackend = useCallback(async () => {
    try {
      await checkBackendHealth()
    } catch (error) {
      console.error('Backend health check failed:', error)
    }
  }, [])

  useEffect(() => {
    checkBackend()
    const interval = setInterval(checkBackend, 30000)
    return () => clearInterval(interval)
  }, [checkBackend])

  const handleVideoProcessed = (id, url) => {
    setVideoId(id)
    setVideoUrl(url || '')
    setIsProcessing(false)
  }

  const handleNewVideo = () => {
    setVideoId(null)
    setVideoUrl('')
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'rgb(var(--bg-primary))' }}>
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-pink-500/5 dark:bg-pink-500/[0.03] blur-3xl" />
      </div>

      {/* Top nav */}
      <nav className="sticky top-0 z-50 glass">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={handleNewVideo}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <span className="text-[15px] font-semibold text-gray-900 dark:text-white hidden sm:block">
              YT Chatbot
            </span>
          </button>

          <div className="flex items-center gap-1">
            <a
              href="https://github.com/Ajay2700/Youtube-ChatBot"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost p-2.5 rounded-xl"
              title="GitHub"
            >
              <Github className="w-[18px] h-[18px]" />
            </a>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn-ghost p-2.5 rounded-xl"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="w-[18px] h-[18px] text-yellow-400" />
              ) : (
                <Moon className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {!videoId ? (
          <div className="animate-fade-in">
            {/* Hero section */}
            <div className="text-center mb-10 pt-4 sm:pt-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium mb-5 animate-slide-down">
                <Sparkles className="w-3 h-3" />
                AI-Powered RAG Chat
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
                Chat with any{' '}
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  YouTube video
                </span>
              </h1>
              <p className="text-base sm:text-lg text-gray-500 dark:text-slate-400 max-w-xl mx-auto">
                Paste a video URL, and ask questions about its content. Powered by OpenAI embeddings and retrieval-augmented generation.
              </p>
            </div>

            {/* Video input card */}
            <div className="surface-elevated rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto animate-slide-up">
              <VideoInput
                onVideoProcessed={handleVideoProcessed}
                onProcessingStart={() => setIsProcessing(true)}
                isProcessing={isProcessing}
              />
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in">
              {['FAISS Vector Search', 'GPT-4o-mini', 'LangChain RAG', 'FastAPI Backend'].map((label) => (
                <span
                  key={label}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Chat header bar */}
            <div className="surface-elevated rounded-2xl px-5 py-4 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleNewVideo}
                  className="btn-ghost p-2"
                  title="New video"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Chat Active
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-slate-500 font-mono mt-0.5">
                    {videoId}
                  </p>
                </div>
              </div>
              {videoUrl && (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                  Watch Video
                </a>
              )}
            </div>

            {/* Chat area */}
            <div className="surface-elevated rounded-2xl overflow-hidden">
              <ChatInterface videoId={videoId} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-gray-400 dark:text-slate-500">
          Built with{' '}
          <span className="font-medium text-gray-500 dark:text-slate-400">React</span>,{' '}
          <span className="font-medium text-gray-500 dark:text-slate-400">FastAPI</span>,{' '}
          <span className="font-medium text-gray-500 dark:text-slate-400">OpenAI</span>{' & '}
          <span className="font-medium text-gray-500 dark:text-slate-400">LangChain</span>
        </p>
      </footer>
    </div>
  )
}

export default App
