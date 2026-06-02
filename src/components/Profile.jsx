import { useState } from 'react'
import './Profile.css'

export default function Profile({ theme, setTheme, totalDuration, records, streak, exerciseTypes, userName, setUserName, isGuest, useCloud, onLogout, profile }) {
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(userName)

  const typeMap = Object.fromEntries(exerciseTypes.map(t => [t.id, t]))
  const uniqueDays = new Set(records.map(r => r.date)).size
  const favoriteType = records.length > 0
    ? Object.entries(records.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc }, {}))
        .sort((a, b) => b[1] - a[1])[0][0]
    : null
  const favInfo = favoriteType ? typeMap[favoriteType] : null

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim())
    }
    setEditingName(false)
  }

  return (
    <div className="profile-section">
      <div className="profile-header-card">
        <div className="profile-avatar">🏅</div>
        {editingName ? (
          <div className="name-edit-row">
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              maxLength={20}
              autoFocus
            />
            <button onClick={handleSaveName}>保存</button>
          </div>
        ) : (
          <h2 onClick={() => { setEditingName(true); setNameInput(userName) }}>
            {userName} ✏️
          </h2>
        )}
        {useCloud && <span className="profile-badge">☁️ 云端同步</span>}
        {isGuest && <span className="profile-badge guest">📱 游客模式</span>}
      </div>

      <div className="profile-stats-grid">
        <div className="profile-stat">
          <span className="profile-stat-icon">📅</span>
          <span className="profile-stat-val">{uniqueDays}</span>
          <span className="profile-stat-label">运动天数</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-icon">🔥</span>
          <span className="profile-stat-val">{streak}</span>
          <span className="profile-stat-label">连续打卡</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-icon">⏱</span>
          <span className="profile-stat-val">{totalDuration}</span>
          <span className="profile-stat-label">总分钟数</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-icon">{favInfo?.icon || '🎯'}</span>
          <span className="profile-stat-val">{favInfo?.name || '-'}</span>
          <span className="profile-stat-label">最爱运动</span>
        </div>
      </div>

      <div className="profile-menu">
        <div className="menu-item" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          <span>🌓 深色模式</span>
          <span className="menu-toggle">{theme === 'dark' ? '开启' : '关闭'}</span>
        </div>
        {!useCloud && (
          <div className="menu-item" onClick={() => {
            if (confirm('确定要清除所有数据吗？')) {
              localStorage.clear()
              location.reload()
            }
          }}>
            <span>🗑 清除数据</span>
            <span className="menu-arrow">›</span>
          </div>
        )}
        <div className="menu-item logout" onClick={() => {
          if (confirm('确定要退出登录吗？')) onLogout()
        }}>
          <span>🚪 退出登录</span>
          <span className="menu-arrow">›</span>
        </div>
      </div>

      <p className="profile-version">吃鱼 v2.0</p>
    </div>
  )
}
