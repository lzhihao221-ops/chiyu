import { useState } from 'react'
import './GoalSetting.css'

export default function GoalSetting({ goals, onSave }) {
  const [weeklyDays, setWeeklyDays] = useState(goals.weeklyDays)
  const [dailyMinutes, setDailyMinutes] = useState(goals.dailyMinutes)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave({ weeklyDays: Number(weeklyDays), dailyMinutes: Number(dailyMinutes) })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="goal-section">
      <h2>🎯 运动目标</h2>
      {saved && <div className="success-toast-small">✅ 已保存</div>}
      <div className="goal-form">
        <div className="goal-row">
          <label>每周运动天数</label>
          <div className="goal-input-group">
            <button type="button" onClick={() => setWeeklyDays(Math.max(1, weeklyDays - 1))}>-</button>
            <span>{weeklyDays}</span>
            <button type="button" onClick={() => setWeeklyDays(Math.min(7, weeklyDays + 1))}>+</button>
          </div>
        </div>
        <div className="goal-row">
          <label>每日运动时长（分钟）</label>
          <div className="goal-input-group">
            <button type="button" onClick={() => setDailyMinutes(Math.max(5, dailyMinutes - 5))}>-</button>
            <span>{dailyMinutes}</span>
            <button type="button" onClick={() => setDailyMinutes(Math.min(300, dailyMinutes + 5))}>+</button>
          </div>
        </div>
        <button className="goal-save-btn" onClick={handleSave}>保存目标</button>
      </div>
    </div>
  )
}
