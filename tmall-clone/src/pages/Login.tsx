import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../App.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('请输入用户名和密码')
      return
    }

    try {
      const result = await login({ user_name: username, user_password: password })
      if (result.success) {
        console.log('✅ 登录成功，跳转到首页')
        navigate('/')
      } else {
        setError(result.error || '登录失败')
      }
    } catch (error) {
      setError('登录失败，请检查网络连接')
    }
  }

  return (
    <div className="login-page">
      <div style={{ padding: '18px 48px', background: '#fff', borderBottom: '1px solid rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="login-brand" style={{ display: 'flex', alignItems: 'baseline', gap: '12px', color: '#ff0036', fontWeight: 700 }}>
          <strong style={{ fontSize: '40px', letterSpacing: '6px' }}>TMALL</strong>
          <span style={{ fontSize: '20px' }}>理想生活上天猫</span>
        </div>
        <div className="login-hero-actions">
          <Link to="/">返回首页</Link>
        </div>
      </div>

      <div className="login-content">
        <div className="login-panel">
          <div className="login-tabs">
            <button
              className={loginType === 'user' ? 'active' : ''}
              onClick={() => setLoginType('user')}
            >
              用户登录
            </button>
            <button
              className={loginType === 'admin' ? 'active' : ''}
              onClick={() => setLoginType('admin')}
            >
              管理员登录
            </button>
          </div>

          <div className="login-hint">
            {loginType === 'user' ? '用户登录' : '管理员登录'}
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              <span>用户名</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                autoComplete="username"
              />
            </label>
            <label>
              <span>密码</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                autoComplete="current-password"
              />
            </label>
            <button type="submit" className="login-submit">
              登录
            </button>
          </form>

          {error && <div className="login-error">{error}</div>}

          <div className="login-links">
            <a href="#">忘记密码</a>
            <a href="#">忘记会员名</a>
            <Link to="/register">免费注册</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

