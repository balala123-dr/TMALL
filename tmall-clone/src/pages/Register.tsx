import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AddressSelectorStatic from '../components/AddressSelectorStatic'
import '../App.css'

export default function Register() {
  const [step, setStep] = useState<'account' | 'info'>('account')
  const [formData, setFormData] = useState({
    user_name: '',
    user_password: '',
    confirmPassword: '',
    user_nickname: '',
    user_realname: '',
    user_gender: 1 as number | undefined,
    user_birthday: '',
    user_address: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.user_name || formData.user_name.length < 3) {
      setError('用户名至少需要3个字符')
      return
    }

    if (!formData.user_password || formData.user_password.length < 6) {
      setError('密码至少需要6个字符')
      return
    }

    if (formData.user_password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setStep('info')
  }

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const registerData = {
      user_name: formData.user_name,
      user_password: formData.user_password,
      user_nickname: formData.user_nickname || undefined,
      user_realname: formData.user_realname || undefined,
      user_gender: formData.user_gender,
      user_birthday: formData.user_birthday || undefined,
      user_address: formData.user_address || undefined,
    }

    try {
      const result = await register(registerData)
      if (result.success) {
        console.log('✅ 注册成功，跳转到登录页面')
        alert('注册成功！请登录')
        navigate('/login')
      } else {
        setError(result.error || '注册失败，请稍后重试')
      }
    } catch (err: any) {
      console.error('注册错误详情:', err)
      setError(err.message || '注册失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 生成年份选项
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <div className="register-page">
      <div className="register-hero">
        <div className="register-brand">
          <strong>TMALL</strong>
          <span>用户注册</span>
        </div>
        <div className="register-hero-actions">
          <Link to="/">返回首页</Link>
          <Link to="/login">已有账号？立即登录</Link>
        </div>
      </div>

      <div className="register-content">
        <div className="register-steps">
          <span className={step === 'account' ? 'active' : ''}>填写账号信息</span>
          <span className={step === 'info' ? 'active' : ''}>填写基本信息</span>
        </div>

        {step === 'account' ? (
          <div className="register-block">
            <header>
              <h2>填写账号信息</h2>
            </header>
            <form className="register-form" onSubmit={handleAccountSubmit}>
              <div className="register-row">
                <div className="register-label">用户名</div>
                <div className="register-field">
                  <input
                    type="text"
                    value={formData.user_name}
                    onChange={(e) => updateField('user_name', e.target.value)}
                    placeholder="请输入用户名"
                    required
                  />
                  <small>用户名长度为3-25个字符</small>
                </div>
              </div>

              <div className="register-row">
                <div className="register-label">登录密码</div>
                <div className="register-field">
                  <input
                    type="password"
                    value={formData.user_password}
                    onChange={(e) => updateField('user_password', e.target.value)}
                    placeholder="请设置登录密码"
                    required
                  />
                  <small>登录时验证,保护账号信息</small>
                </div>
              </div>

              <div className="register-row">
                <div className="register-label">确认密码</div>
                <div className="register-field">
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    placeholder="请再次输入你的密码"
                    required
                  />
                </div>
              </div>

              {error && <div className="register-submit-error">{error}</div>}

              <div className="register-bottom">
                <div>
                  点击注册，即表示您同意
                  <a href="#">《天猫服务协议》</a>
                  和
                  <a href="#">《隐私权政策》</a>
                </div>
                <div className="register-submit-group">
                  <button type="submit" className="register-submit">
                    下一步
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="register-block">
            <header>
              <h2>填写基本信息</h2>
              <p>以下信息为选填，可稍后完善</p>
            </header>
            <form className="register-form" onSubmit={handleInfoSubmit}>
              <div className="register-row">
                <div className="register-label">昵称</div>
                <div className="register-field">
                  <input
                    type="text"
                    value={formData.user_nickname}
                    onChange={(e) => updateField('user_nickname', e.target.value)}
                    placeholder="请输入昵称"
                  />
                </div>
              </div>

              <div className="register-row">
                <div className="register-label">真实姓名</div>
                <div className="register-field">
                  <input
                    type="text"
                    value={formData.user_realname}
                    onChange={(e) => updateField('user_realname', e.target.value)}
                    placeholder="请输入真实姓名"
                  />
                </div>
              </div>

              <div className="register-row">
                <div className="register-label">性别</div>
                <div className="register-field register-gender-options">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="1"
                      checked={formData.user_gender === 1}
                      onChange={() => updateField('user_gender', 1)}
                    />
                    男
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="0"
                      checked={formData.user_gender === 0}
                      onChange={() => updateField('user_gender', 0)}
                    />
                    女
                  </label>
                </div>
              </div>

              <div className="register-row">
                <div className="register-label">出生日期</div>
                <div className="register-field register-date">
                  <select
                    value={formData.user_birthday ? formData.user_birthday.split('-')[0] : ''}
                    onChange={(e) => {
                      const year = e.target.value
                      const month = formData.user_birthday ? formData.user_birthday.split('-')[1] : '01'
                      const day = formData.user_birthday ? formData.user_birthday.split('-')[2] : '01'
                      updateField('user_birthday', year ? `${year}-${month}-${day}` : '')
                    }}
                  >
                    <option value="">年</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <select
                    value={formData.user_birthday ? formData.user_birthday.split('-')[1] : ''}
                    onChange={(e) => {
                      const month = e.target.value
                      const year = formData.user_birthday ? formData.user_birthday.split('-')[0] : '2000'
                      const day = formData.user_birthday ? formData.user_birthday.split('-')[2] : '01'
                      updateField('user_birthday', month ? `${year}-${month.padStart(2, '0')}-${day}` : '')
                    }}
                  >
                    <option value="">月</option>
                    {months.map(month => (
                      <option key={month} value={month.toString().padStart(2, '0')}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={formData.user_birthday ? formData.user_birthday.split('-')[2] : ''}
                    onChange={(e) => {
                      const day = e.target.value
                      const year = formData.user_birthday ? formData.user_birthday.split('-')[0] : '2000'
                      const month = formData.user_birthday ? formData.user_birthday.split('-')[1] : '01'
                      updateField('user_birthday', day ? `${year}-${month}-${day.padStart(2, '0')}` : '')
                    }}
                  >
                    <option value="">日</option>
                    {days.map(day => (
                      <option key={day} value={day.toString().padStart(2, '0')}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="register-row">
                <div className="register-label">地址</div>
                <div className="register-field">
                  <AddressSelectorStatic
                    value={formData.user_address}
                    onChange={(value) => updateField('user_address', value)}
                    placeholder="请选择您的地址"
                  />
                  <small>选择您的居住地址，方便配送服务</small>
                </div>
              </div>

              {error && <div className="register-submit-error">{error}</div>}

              <div className="register-bottom">
                <button
                  type="button"
                  onClick={() => setStep('account')}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '1px solid #ddd',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  上一步
                </button>
                <div className="register-submit-group">
                  <button
                    type="submit"
                    className="register-submit"
                    disabled={loading}
                  >
                    {loading ? '注册中...' : '完成注册'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}