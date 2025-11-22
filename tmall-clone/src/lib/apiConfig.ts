// API 基础 URL 配置
// 在开发环境使用本地后端，在生产环境使用 Netlify Functions

const getApiBaseUrl = (): string => {
  // 如果设置了环境变量，使用环境变量
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }

  // 在生产环境（Netlify），使用相对路径（会被重定向到 Netlify Functions）
  if (import.meta.env.PROD) {
    return '/api'
  }

  // 开发环境使用本地后端
  return 'http://localhost:3001/api'
}

export const API_BASE_URL = getApiBaseUrl()

// 辅助函数：构建完整的 API URL
export const buildApiUrl = (endpoint: string): string => {
  // 如果 endpoint 已经包含完整 URL，直接返回
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint
  }

  // 移除 endpoint 开头的斜杠（如果有）
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint

  // 如果 API_BASE_URL 已经以 /api 结尾，直接拼接
  if (API_BASE_URL.endsWith('/api')) {
    return `${API_BASE_URL}/${cleanEndpoint}`
  }

  // 否则拼接
  return `${API_BASE_URL}/${cleanEndpoint}`
}

