export default function History({ records, exerciseTypes, onDelete }) {
  const getTypeInfo = (typeId) => {
    return exerciseTypes.find(t => t.id === typeId) || { icon: '🎯', name: '其他' }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const month = d.getMonth() + 1
    const day = d.getDate()
    const weekday = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
    return `${month}月${day}日 周${weekday}`
  }

  if (records.length === 0) {
    return (
      <div className="history-section">
        <h2>📋 打卡记录</h2>
        <p className="empty-hint">还没有打卡记录，快去运动吧！</p>
      </div>
    )
  }

  return (
    <div className="history-section">
      <h2>📋 打卡记录</h2>
      <div className="history-list">
        {records.map(r => {
          const info = getTypeInfo(r.type)
          return (
            <div key={r.id} className="history-item">
              <span className="history-icon">{info.icon}</span>
              <div className="history-info">
                <div className="history-main">
                  <span className="history-type">{info.name}</span>
                  <span className="history-duration">{r.duration} 分钟</span>
                </div>
                <div className="history-sub">
                  <span className="history-date">{formatDate(r.date)}</span>
                  {r.note && <span className="history-note"> · {r.note}</span>}
                </div>
              </div>
              <button className="delete-btn" onClick={() => onDelete(r.id)} title="删除">×</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
