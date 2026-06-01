import { useState, useEffect, useCallback, useMemo } from 'react'

const STORAGE_KEY = 'workout-checkin-data'
const GOALS_KEY = 'workout-goals'
const THEME_KEY = 'workout-theme'

const EXERCISE_TYPES = [
  { id: 'running', name: '跑步', icon: '🏃', color: '#ff6b6b' },
  { id: 'walking', name: '健走', icon: '🚶', color: '#51cf66' },
  { id: 'cycling', name: '骑行', icon: '🚴', color: '#339af0' },
  { id: 'swimming', name: '游泳', icon: '🏊', color: '#22b8cf' },
  { id: 'yoga', name: '瑜伽', icon: '🧘', color: '#cc5de8' },
  { id: 'gym', name: '健身', icon: '💪', color: '#ff922b' },
  { id: 'basketball', name: '篮球', icon: '🏀', color: '#f76707' },
  { id: 'badminton', name: '羽毛球', icon: '🏸', color: '#20c997' },
  { id: 'jumping', name: '跳绳', icon: '⚡', color: '#fcc419' },
  { id: 'other', name: '其他', icon: '🎯', color: '#868e96' },
]

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveJSON(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持定位'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  })
}

export function useWorkouts() {
  const [records, setRecords] = useState(() => loadJSON(STORAGE_KEY, []))
  const [goals, setGoals] = useState(() => loadJSON(GOALS_KEY, { weeklyDays: 5, dailyMinutes: 30 }))
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')

  useEffect(() => { saveJSON(STORAGE_KEY, records) }, [records])
  useEffect(() => { saveJSON(GOALS_KEY, goals) }, [goals])
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const addRecord = useCallback(async (type, duration, note = '') => {
    let location = null
    try { location = await getCurrentPosition() } catch {}
    const newRecord = {
      id: Date.now().toString(),
      date: getDateKey(),
      type, duration, note, location,
      createdAt: new Date().toISOString(),
    }
    setRecords(prev => [newRecord, ...prev])
  }, [])

  const deleteRecord = useCallback((id) => {
    setRecords(prev => prev.filter(r => r.id !== id))
  }, [])

  const todayRecords = useMemo(() => records.filter(r => r.date === getDateKey()), [records])
  const isCheckedInToday = todayRecords.length > 0

  const streak = useMemo(() => {
    const dateSet = new Set(records.map(r => r.date))
    let s = 0
    const d = new Date()
    if (!dateSet.has(getDateKey(d))) d.setDate(d.getDate() - 1)
    while (dateSet.has(getDateKey(d))) { s++; d.setDate(d.getDate() - 1) }
    return s
  }, [records])

  const monthCheckins = useMemo(() => {
    const now = new Date()
    const dates = new Set()
    records.forEach(r => {
      const d = new Date(r.date)
      if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) dates.add(r.date)
    })
    return dates.size
  }, [records])

  const totalDuration = useMemo(() => records.reduce((sum, r) => sum + r.duration, 0), [records])

  const getMonthDates = (year, month) => {
    const dates = new Set()
    records.forEach(r => {
      const d = new Date(r.date)
      if (d.getFullYear() === year && d.getMonth() === month) dates.add(r.date)
    })
    return dates
  }

  const getWeekStats = () => {
    const now = new Date()
    const dayOfWeek = now.getDay() || 7
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - dayOfWeek + 1)
    weekStart.setHours(0, 0, 0, 0)

    let activeDays = 0
    let totalMinutes = 0
    const dailyData = []

    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(weekStart.getDate() + i)
      const key = getDateKey(d)
      const dayRecords = records.filter(r => r.date === key)
      const minutes = dayRecords.reduce((s, r) => s + r.duration, 0)
      if (dayRecords.length > 0) activeDays++
      totalMinutes += minutes
      dailyData.push({ date: key, day: ['一','二','三','四','五','六','日'][i], minutes, records: dayRecords.length })
    }
    return { activeDays, totalMinutes, dailyData }
  }

  const getRecentRecords = (limit = 20) => records.slice(0, limit)

  const getTypeStats = () => {
    const stats = {}
    records.forEach(r => {
      if (!stats[r.type]) stats[r.type] = { count: 0, duration: 0 }
      stats[r.type].count++
      stats[r.type].duration += r.duration
    })
    return EXERCISE_TYPES.map(t => ({
      ...t,
      count: stats[t.id]?.count || 0,
      duration: stats[t.id]?.duration || 0,
    })).filter(s => s.count > 0).sort((a, b) => b.count - a.count)
  }

  const getRecordsWithLocation = () => records.filter(r => r.location)

  return {
    records, addRecord, deleteRecord,
    todayRecords, isCheckedInToday,
    streak, monthCheckins,
    totalDuration, getMonthDates, exerciseTypes: EXERCISE_TYPES,
    getRecordsWithLocation, getWeekStats, getRecentRecords, getTypeStats,
    goals, setGoals, theme, setTheme,
  }
}
