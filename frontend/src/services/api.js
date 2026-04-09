import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '')
const API_BASE_URL_DISPLAY = API_BASE_URL || 'your deployed backend URL'

const ensureApiBaseUrl = () => {
  if (API_BASE_URL) {
    return
  }

  throw new Error(
    'Frontend is missing VITE_API_BASE_URL. Set it in Netlify to your deployed backend URL and redeploy.'
  )
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for long operations
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. The server is taking too long to respond.'
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error. Please check if the backend server is running on http://127.0.0.1:8000'
    } else if (error.response) {
      // Server responded with error status
      error.message = error.response.data?.detail || error.response.data?.message || error.message
    } else if (error.request) {
      // Request made but no response received
      error.message = 'No response from server. Please ensure the backend is running on http://127.0.0.1:8000'
    }
    return Promise.reject(error)
  }
)

export const processVideo = async (youtubeUrl) => {
  try {
    ensureApiBaseUrl()
    const response = await api.post('/api/v1/video/process', {
      youtube_url: youtubeUrl,
    })
    return response.data
  } catch (error) {
    console.error('Error processing video:', error)
    throw error
  }
}

export const sendMessage = async (videoId, question) => {
  try {
    ensureApiBaseUrl()
    const response = await api.post('/api/v1/chat', {
      video_id: videoId,
      question: question,
    })
    return response.data
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}

export const checkVideoStatus = async (videoId) => {
  try {
    ensureApiBaseUrl()
    const response = await api.get(`/api/v1/video/${videoId}/status`)
    return response.data
  } catch (error) {
    console.error('Error checking video status:', error)
    throw error
  }
}

// Health check function
export const checkBackendHealth = async () => {
  try {
    ensureApiBaseUrl()
    // Use direct fetch to avoid axios timeout issues
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Backend health check failed:', error)
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw new Error(`Backend server is not responding. Please ensure it is running on ${API_BASE_URL_DISPLAY}`)
    } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Cannot connect to backend server. Please ensure it is running on ${API_BASE_URL_DISPLAY}`)
    }
    throw error
  }
}

export default api
