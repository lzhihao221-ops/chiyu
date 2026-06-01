export default function WeeklyChart({ weekStats, goals }) {
  const maxMinutes = Math.max(...weekStats.dailyData.map(d => d.minutes), goals.dailyMinutes)
  const goalPercent = Math.min(100, Math.round((weekStats.activeDays / goals.weeklyDays) * 100))

  return (
    <div className="chart-section">
      <h2>📊 本周统计</h2>
      <div className="chart-summary">
        <div className="chart-stat">
          <span className="chart-stat-value">{weekStats.activeDays}</span>
          <span className="chart-stat-label">运动天数</span>
          <span className="chart-stat-goal">目标 {goals.weeklyDays} 天</span>
        </div>
        <div className="chart-stat">
          <span className="chart-stat-value">{weekStats.totalMinutes}</span>
          <span className="chart-stat-label">运动分钟</span>
        </div>
        <div className="chart-stat">
          <span className="chart-stat-value">{goalPercent}%</span>
          <span className="chart-stat-label">目标完成</span>
        </div>
      </div>
      <div className="chart-bars">
        {weekStats.dailyData.map((d, i) => (
          <div key={i} className="bar-col">
            <div className="bar-wrapper">
              <div
                className="bar-fill"
                style={{ height: maxMinutes > 0 ? `${(d.minutes / maxMinutes) * 100}%` : '0%' }}
              >
                {d.minutes > 0 && <span className="bar-value">{d.minutes}</span>}
              </div>
            </div>
            <span className={`bar-label ${d.records > 0 ? 'active' : ''}`}>{d.day}</span>
          </div>
        ))}
      </div>
      <div className="chart-goal-line">
        <span>日目标 {goals.dailyMinutes} 分钟</span>
      </div>
    </div>
  )
}
