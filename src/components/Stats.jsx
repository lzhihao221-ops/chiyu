export default function Stats({ streak, monthCheckins, totalDuration, totalRecords }) {
  const stats = [
    { label: '连续打卡', value: streak, unit: '天', icon: '🔥' },
    { label: '本月打卡', value: monthCheckins, unit: '天', icon: '📅' },
    { label: '总运动时长', value: totalDuration, unit: '分钟', icon: '⏱' },
    { label: '总打卡次数', value: totalRecords, unit: '次', icon: '🏆' },
  ]

  return (
    <div className="stats-section">
      {stats.map(s => (
        <div key={s.label} className="stat-card">
          <span className="stat-icon">{s.icon}</span>
          <span className="stat-value">{s.value}</span>
          <span className="stat-unit">{s.unit}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  )
}
