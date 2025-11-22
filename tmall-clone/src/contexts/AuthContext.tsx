import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { buildApiUrl } from '../lib/apiConfig'

interface User {
  user_id?: number
  user_name?: string
  user_nickname?: string
  user_password?: string
  user_realname?: string
  user_gender?: number
  user_birthday?: string
  user_address?: string
  user_avatar?: string
}

type AuthResponse = {
  success: boolean
  data?: User
  error?: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => Promise<AuthResponse>
  logout: () => void
  register: (user: User) => Promise<AuthResponse>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  const login = async (userData: User): Promise<AuthResponse> => {
    try {
      // 真正连接后端API
      const response = await fetch(buildApiUrl('/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: userData.user_name,
          user_password: userData.user_password
        })
      })

      const result = await response.json()

      if (result.success) {
        setUser(result.data)
        localStorage.setItem('user', JSON.stringify(result.data))
        // 保存登录token（简化处理，实际应该从后端返回）
        localStorage.setItem('token', 'demo-token-' + result.data.user_id)

        return { success: true, data: result.data }
      } else {
        console.error('❌ 登录失败:', result.message)
        return { success: false, error: result.message || '登录失败' }
      }
    } catch (error) {
      console.error('登录错误:', error)
      return { success: false, error: '网络错误，请检查后端服务是否启动' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const register = async (userData: User): Promise<AuthResponse> => {
    try {
      // 真正连接后端API保存到数据库
      const response = await fetch(buildApiUrl('/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      const result = await response.json()

      if (result.success) {
        setUser(result.data)
        localStorage.setItem('user', JSON.stringify(result.data))
        console.log('✅ 注册成功并保存到数据库:', result.data)
        return { success: true, data: result.data }
      } else {
        console.error('❌ 注册失败:', result.message)
        return { success: false, error: result.message || '注册失败' }
      }
    } catch (error) {
      console.error('注册错误:', error)
      return { success: false, error: '网络错误，请检查后端服务是否启动' }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}