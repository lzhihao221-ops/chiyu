import { useState } from 'react'
import './Calendar.css'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

export default function Calendar({ getMonthDates }) {
  const [current, setCurrent] = useState(new Date())
  const year = current.getFullYear()
  const month = current.getMonth()

  const checkedDates = getMonthDates(year, month)
  const today = new Date().toISOString().slice(0, 10)

  // 本月第一天是周几
  const firstDay = new Date(year, month, 1).getDay()
  // 本月天数
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1))

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty" />)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const isChecked = checkedDates.has(dateKey)
    const isToday = dateKey === today
    days.push(
      <div
        key={dateKey}
        className={`calendar-day ${isChecked ? 'checked' : ''} ${isToday ? 'today' : ''}`}
      >
        <span>{d}</span>
        {isChecked && <span className="check-dot">✓</span>}
      </div>
    )
  }

  return (
    <div className="calendar-section">
      <div className="calendar-header">
        <button onClick={prevMonth} className="cal-nav">◀</button>
        <h3>{year} 年 {month + 1} 月</h3>
        <button onClick={nextMonth} className="cal-nav">▶</button>
      </div>
      <div className="calendar-weekdays">
        {WEEKDAYS.map(w => (
          <div key={w} className="weekday-label">{w}</div>
        ))}
      </div>
      <div className="calendar-grid">{days}</div>
    </div>
  )
}
