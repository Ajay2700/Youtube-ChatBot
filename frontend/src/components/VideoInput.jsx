import { useState } from 'react'
import { Loader2, Play, AlertCircle, CheckCircle2, Link2, X } from 'lucide-react'
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
    if (url.length === 11 && /^[a-zA-Z0-9_-]+$/.test(url)) return url
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
      setStatus('Fetching transcript and creating embeddings...')
      const response = await processVideo(youtubeUrl)

      if (response.video_id) {
        setIsSuccess(true)
        setStatus('Ready! Opening chat...')
        setTimeout(() => {
          onVideoProcessed(response.video_id, youtubeUrl.trim())
        }, 1200)
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to process video')
      setStatus('')
      setIsSuccess(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* URL Input */}
        <div>
          <label
            htmlFor="youtube-url"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
          >
            <Link2 className="w-3.5 h-3.5" />
            YouTube Video URL
          </label>
          <div className="flex gap-2.5">
            <div className="flex-1 relative">
              <input
                id="youtube-url"
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={isProcessing}
                className="input-field pr-10"
              />
              {youtubeUrl && !isProcessing && (
                <button
                  type="button"
                  onClick={() => setYoutubeUrl('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isProcessing || !youtubeUrl.trim()}
              className="btn-primary flex items-center gap-2 px-6"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">Process Video</span>
                  <span className="sm:hidden">Go</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status / Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 animate-scale-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed">{error}</div>
          </div>
        )}

        {status && !error && (
          <div className={`flex items-start gap-3 p-4 rounded-xl animate-scale-in ${
            isSuccess
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400'
              : 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-400'
          }`}>
            {isSuccess ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            ) : (
              <Loader2 className="w-4 h-4 flex-shrink-0 mt-0.5 animate-spin" />
            )}
            <div className="text-sm">{status}</div>
          </div>
        )}

        {/* Help */}
        <div className="rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 p-4">
          <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">How it works</p>
          <ol className="text-sm text-gray-500 dark:text-slate-400 space-y-1.5 list-decimal list-inside">
            <li>Paste any YouTube video URL above</li>
            <li>We fetch and embed the transcript using FAISS</li>
            <li>Ask questions — the AI answers from the video content</li>
          </ol>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-3">
            Try:{' '}
            <code className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-[11px]">
              https://www.youtube.com/watch?v=Gfr50f6ZBvo
            </code>
          </p>
        </div>
      </form>
    </div>
  )
}

export default VideoInput
