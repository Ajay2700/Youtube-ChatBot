import { useState, useEffect } from 'react'
import VideoInput from './components/VideoInput'
import ChatInterface from './components/ChatInterface'
import { Youtube, Sparkles, ArrowLeft, AlertCircle } from 'lucide-react'
import { checkBackendHealth } from './services/api'

function App() {
  const [videoId, setVideoId] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking')

  const handleVideoProcessed = (id, url) => {
    setVideoId(id)
    setVideoUrl(url || '')
    setIsProcessing(false)
  }

  const handleProcessingStart = () => {
    setIsProcessing(true)
  }

  const handleNewVideo = () => {
    setVideoId(null)
    setVideoUrl('')
    setIsProcessing(false)
  }

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await checkBackendHealth()
        setBackendStatus('connected')
      } catch (error) {
        setBackendStatus('disconnected')
        console.error('Backend connection failed:', error)
      }
    }
    checkBackend()
    
    // Check every 10 seconds
    const interval = setInterval(checkBackend, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Backend Status Alert */}
        {backendStatus === 'disconnected' && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl animate-scale-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-red-800 dark:text-red-300">Backend Server Not Connected</p>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  Please ensure the backend server is running on http://localhost:8000
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        )}

        {backendStatus === 'checking' && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-800 dark:text-blue-300">Checking backend connection...</p>
            </div>
          </div>
        )}

        {/* Enhanced Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-lg opacity-50"></div>
              <Youtube className="relative w-12 h-12 sm:w-14 sm:h-14 text-red-600 dark:text-red-500 animate-scale-in" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text animate-slide-up">
                YouTube Transcript Chatbot
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  AI-Powered RAG Chat Assistant
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Card */}
        <div className="glass-strong rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 animate-slide-up">
          {!videoId ? (
            <VideoInput
              onVideoProcessed={handleVideoProcessed}
              onProcessingStart={handleProcessingStart}
              isProcessing={isProcessing}
            />
          ) : (
            <div className="animate-fade-in">
              {/* Video Header with Back Button */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleNewVideo}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all hover:scale-105 active:scale-95"
                    title="Process a new video"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Chat Session Active
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Video ID: {videoId}
                    </p>
                  </div>
                </div>
                {videoUrl && (
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all hover:scale-105 active:scale-95"
                  >
                    <Youtube className="w-4 h-4" />
                    <span className="text-sm font-medium">Watch Video</span>
                  </a>
                )}
              </div>
              <ChatInterface videoId={videoId} />
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <footer className="text-center animate-fade-in">
          <div className="glass rounded-xl px-6 py-4 inline-block">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Powered by <span className="font-semibold text-blue-600 dark:text-blue-400">OpenAI</span> &{' '}
              <span className="font-semibold text-purple-600 dark:text-purple-400">LangChain</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Built with React & FastAPI
            </p>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default App
