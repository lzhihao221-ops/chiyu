import { useState } from 'react'

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login') // login | register
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        await onAuth('register', { email, password, username: username || '匿名用户' })
      } else {
        await onAuth('login', { email, password })
      }
    } catch (err) {
      setError(err.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-logo">🐟</div>
      <h1 className="auth-title">吃鱼</h1>
      <p className="auth-subtitle">运动 · 社区 · 直播 · 商城</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <input
            type="text"
            placeholder="昵称（选填）"
            value={username}
            onChange={e => setUsername(e.target.value)}
            maxLength={20}
          />
        )}
        <input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="密码（至少6位）"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? '请稍候...' : mode === 'login' ? '登录' : '注册'}
        </button>
      </form>

      <p className="auth-switch">
        {mode === 'login' ? '没有账号？' : '已有账号？'}
        <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
          {mode === 'login' ? ' 注册' : ' 登录'}
        </span>
      </p>

      <p className="auth-guest" onClick={() => onAuth('guest')}>
        游客模式（数据仅存本地）
      </p>
    </div>
  )
}
