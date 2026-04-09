import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, User, Bot, AlertCircle, Copy, Check, MessageSquare } from 'lucide-react'
import { sendMessage } from '../services/api'

function ChatInterface({ videoId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [messages])
  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setError('')
    setIsLoading(true)

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage, timestamp: new Date() },
    ])

    try {
      const response = await sendMessage(videoId, userMessage)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.answer, timestamp: new Date() },
      ])
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to get response')
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
          isError: true,
        },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const suggestedQuestions = [
    'What is this video about?',
    'Summarize the main points',
    'What are the key takeaways?',
    'Explain the main topic in detail',
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-300px)] min-h-[500px] max-h-[700px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-purple-500/20">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1.5">
              Ask anything about the video
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-7 max-w-sm">
              I'll answer based on the transcript using RAG.
            </p>

            <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(q); inputRef.current?.focus() }}
                  className="text-left px-4 py-2.5 rounded-xl text-sm text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 animate-slide-up ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Bot avatar */}
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              </div>
            )}

            <div className={`flex flex-col gap-1 max-w-[80%] ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}>
              <div
                className={`relative group rounded-2xl px-4 py-3 text-[14px] sm:text-[15px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-md'
                    : msg.isError
                    ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50'
                    : 'bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-bl-md'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>

                {msg.role === 'assistant' && !msg.isError && (
                  <button
                    onClick={() => copyToClipboard(msg.content, i)}
                    className="absolute -top-2 -right-2 p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy"
                  >
                    {copiedIndex === i ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-400 dark:text-slate-400" />
                    )}
                  </button>
                )}
              </div>
              <span className="text-[11px] text-gray-400 dark:text-slate-500 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* User avatar */}
            {msg.role === 'user' && (
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-slide-up">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error bar */}
      {error && (
        <div className="mx-4 sm:mx-6 mb-3 flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm animate-scale-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{error}</span>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-slate-700 px-4 sm:px-6 py-4">
        <form onSubmit={handleSubmit} className="flex gap-2.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the video..."
            disabled={isLoading}
            className="input-field flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-primary flex items-center gap-2 px-5"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface
