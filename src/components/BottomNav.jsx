export default function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'home', icon: '🏠', label: '首页' },
    { id: 'live', icon: '📺', label: '直播' },
    { id: 'community', icon: '🌐', label: '社区' },
    { id: 'shop', icon: '🛒', label: '商城' },
    { id: 'messages', icon: '💬', label: '消息' },
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
