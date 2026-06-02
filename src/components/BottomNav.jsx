export default function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'home', icon: '🏠', label: '首页' },
    { id: 'treehole', icon: '🕳️', label: '树洞' },
    { id: 'community', icon: '🌐', label: '社区' },
    { id: 'checkin', icon: '🎯', label: '打卡' },
    { id: 'profile', icon: '👤', label: '我的' },
  ]
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`nav-item ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <span className="nav-icon">{t.icon}</span>
          <span className="nav-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
