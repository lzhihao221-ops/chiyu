import './TypeStats.css'

export default function TypeStats({ typeStats }) {
  if (typeStats.length === 0) return null
  const maxCount = Math.max(...typeStats.map(s => s.count))

  return (
    <div className="type-stats-section">
      <h2>🏆 运动偏好</h2>
      <div className="type-stats-list">
        {typeStats.map(s => (
          <div key={s.id} className="type-stat-item">
            <span className="type-stat-icon">{s.icon}</span>
            <div className="type-stat-info">
              <div className="type-stat-header">
                <span className="type-stat-name">{s.name}</span>
                <span className="type-stat-count">{s.count} 次 · {s.duration} 分钟</span>
              </div>
              <div className="type-stat-bar-bg">
                <div
                  className="type-stat-bar"
                  style={{ width: `${(s.count / maxCount) * 100}%`, background: s.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
