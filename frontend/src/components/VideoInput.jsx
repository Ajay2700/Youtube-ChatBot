import { useState } from 'react'
import { Loader2, Play, AlertCircle, CheckCircle2, Sparkles, Link2 } from 'lucide-react'
import { processVideo } from '../services/api'

function VideoInput({ onVideoProcessed, onProcessingStart, isProcessing }) {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    
    if (url.length === 11 && /^[a-zA-Z0-9_-]+$/.test(url)) {
      return url
    }
    
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('')
    setIsSuccess(false)

    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube URL')
      return
    }

    const videoId = extractVideoId(youtubeUrl.trim())
    if (!videoId && !youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL')
      return
    }

    try {
      onProcessingStart()
      setStatus('Fetching transcript and processing video...')

      const response = await processVideo(youtubeUrl)
      
      if (response.video_id) {
        setIsSuccess(true)
        setStatus('Video processed successfully! Redirecting to chat...')
        setTimeout(() => {
          onVideoProcessed(response.video_id, youtubeUrl.trim())
        }, 1500)
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to process video')
      setStatus('')
      setIsSuccess(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 animate-scale-in">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Get Started
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Enter a YouTube video URL to start chatting with AI about its content
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label
            htmlFor="youtube-url"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
          >
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              YouTube Video URL
            </div>
          </label>
          <div className="relative flex gap-3">
            <div className="flex-1 relative">
              <input
                id="youtube-url"
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={isProcessing}
                className="w-full px-5 py-4 pr-12 text-base border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
              {youtubeUrl && !isProcessing && (
                <button
                  type="button"
                  onClick={() => setYoutubeUrl('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isProcessing || !youtubeUrl.trim()}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:hover:scale-100"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="hidden sm:inline">Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span className="hidden sm:inline">Process Video</span>
                  <span className="sm:hidden">Go</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 animate-scale-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {status && !error && (
          <div className={`flex items-start gap-3 p-4 rounded-xl animate-scale-in ${
            isSuccess 
              ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
              : 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400'
          }`}>
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 animate-scale-in" />
            ) : (
              <Loader2 className="w-5 h-5 flex-shrink-0 mt-0.5 animate-spin" />
            )}
            <div className="flex-1">
              <p className="font-medium">{isSuccess ? 'Success!' : 'Processing...'}</p>
              <p className="text-sm mt-1">{status}</p>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="glass rounded-xl p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">How it works</p>
              <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Paste any YouTube video URL above</li>
                <li>• We'll fetch and process the transcript</li>
                <li>• Start asking questions about the video content</li>
              </ul>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Example: <code className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">https://www.youtube.com/watch?v=Gfr50f6ZBvo</code>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default VideoInput
