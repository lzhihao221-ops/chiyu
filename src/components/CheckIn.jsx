import { useState } from 'react'
import './CheckIn.css'

export default function CheckIn({ exerciseTypes, onAdd, isCheckedInToday }) {
  const [selectedType, setSelectedType] = useState('')
  const [duration, setDuration] = useState(30)
  const [note, setNote] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedType) return
    setSubmitting(true)
    await onAdd(selectedType, duration, note)
    setShowSuccess(true)
    setSelectedType('')
    setDuration(30)
    setNote('')
    setSubmitting(false)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  return (
    <div className="checkin-section">
      <h2>
        {isCheckedInToday ? '✅ 今日已打卡' : '📝 今日打卡'}
      </h2>
      {isCheckedInToday && (
        <p className="checkin-hint">今天已打卡，继续加油！再来一次？</p>
      )}

      {showSuccess && (
        <div className="success-toast">🎉 打卡成功！</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="exercise-grid">
          {exerciseTypes.map(t => (
            <button
              key={t.id}
              type="button"
              className={`exercise-btn ${selectedType === t.id ? 'selected' : ''}`}
              onClick={() => setSelectedType(t.id)}
            >
              <span className="exercise-icon">{t.icon}</span>
              <span className="exercise-name">{t.name}</span>
            </button>
          ))}
        </div>

        <div className="form-row">
          <label>
            ⏱ 运动时长（分钟）
            <input
              type="number"
              min="1"
              max="600"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            📝 备注（可选）
            <input
              type="text"
              placeholder="今天感觉怎么样？"
              value={note}
              onChange={e => setNote(e.target.value)}
              maxLength={100}
            />
          </label>
        </div>

        <button type="submit" className="submit-btn" disabled={!selectedType || submitting}>
          {submitting ? '📍 定位中...' : isCheckedInToday ? '🔥 再来一次' : '✅ 打卡'}
        </button>
        <p className="location-hint">📍 打卡时会自动获取位置，在地图上记录你的运动轨迹</p>
      </form>
    </div>
  )
}
