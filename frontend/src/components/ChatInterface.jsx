import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, User, Bot, AlertCircle, Copy, Check, Sparkles } from 'lucide-react'
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

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setError('')
    setIsLoading(true)

    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage, timestamp: new Date() }
    ])

    try {
      const response = await sendMessage(videoId, userMessage)
      
      // Add bot response
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.answer, timestamp: new Date() }
      ])
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to get response')
      setMessages((prev) => [
        ...prev,
        { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error processing your question. Please try again.',
          timestamp: new Date(),
          isError: true
        }
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
    "What is this video about?",
    "Summarize the main points",
    "What are the key takeaways?",
    "Explain the main topic in detail"
  ]

  const handleSuggestedQuestion = (question) => {
    setInput(question)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[600px] max-h-[800px]">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 animate-pulse-glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Start the Conversation
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
              Ask me anything about the video content. I'll use AI to provide detailed answers based on the transcript.
            </p>
            
            {/* Suggested Questions */}
            <div className="w-full max-w-2xl">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Try asking:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-left px-4 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-all hover:scale-105 active:scale-95"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 sm:gap-4 animate-slide-up ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
            
            <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] ${
              message.role === 'user' ? 'items-end' : 'items-start'
            }`}>
              <div
                className={`relative group rounded-2xl px-4 py-3 shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm'
                    : message.isError
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-2 border-red-200 dark:border-red-800'
                    : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-bl-sm border border-gray-200 dark:border-slate-700'
                }`}
              >
                <p className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed">
                  {message.content}
                </p>
                
                {/* Copy Button */}
                {message.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(message.content, index)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy message"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                    )}
                  </button>
                )}
              </div>
              {message.timestamp && (
                <span className="text-xs text-gray-400 dark:text-gray-500 px-2">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex gap-3 sm:gap-4 justify-start animate-slide-up">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg border border-gray-200 dark:border-slate-700">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 mb-4 animate-scale-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the video..."
            disabled={isLoading}
            className="w-full px-5 py-4 text-base border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          {input && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              Press Enter to send
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:hover:scale-100"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Send</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default ChatInterface
