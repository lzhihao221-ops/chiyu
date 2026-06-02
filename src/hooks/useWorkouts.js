import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'workout-checkin-data'
const GOALS_KEY = 'workout-goals'
const THEME_KEY = 'workout-theme'
const CUSTOM_TYPES_KEY = 'custom-exercise-types'

const BUILTIN_TYPES = [
  { id: 'running', name: '跑步', icon: '🏃', color: '#ff6b6b', builtin: true },
  { id: 'walking', name: '健走', icon: '🚶', color: '#51cf66', builtin: true },
  { id: 'cycling', name: '骑行', icon: '🚴', color: '#339af0', builtin: true },
  { id: 'swimming', name: '游泳', icon: '🏊', color: '#22b8cf', builtin: true },
  { id: 'yoga', name: '瑜伽', icon: '🧘', color: '#cc5de8', builtin: true },
  { id: 'gym', name: '健身', icon: '💪', color: '#ff922b', builtin: true },
  { id: 'basketball', name: '篮球', icon: '🏀', color: '#f76707', builtin: true },
  { id: 'badminton', name: '羽毛球', icon: '🏸', color: '#20c997', builtin: true },
  { id: 'jumping', name: '跳绳', icon: '⚡', color: '#fcc419', builtin: true },
  { id: 'other', name: '其他', icon: '🎯', color: '#868e96', builtin: true },
]

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function saveJSON(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error('浏览器不支持定位')); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  })
}

export function useWorkouts(user, useCloud) {
  const [records, setRecords] = useState(() => loadJSON(STORAGE_KEY, []))
  const [goals, setGoals] = useState(() => loadJSON(GOALS_KEY, { weeklyDays: 5, dailyMinutes: 30 }))
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')
  const [customTypes, setCustomTypes] = useState(() => loadJSON(CUSTOM_TYPES_KEY, []))

  // 合并内置+自定义类型
  const exerciseTypes = [...BUILTIN_TYPES, ...customTypes]

  // 云端模式：加载数据
  useEffect(() => {
    if (!useCloud || !user) return

    const loadData = async () => {
      // 加载运动记录
      const { data: workouts } = await supabase
        .from('workouts').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      if (workouts) setRecords(workouts)

      // 加载目标
      const { data: goalData } = await supabase
        .from('goals').select('*').eq('user_id', user.id).single()
      if (goalData) setGoals({ weeklyDays: goalData.weekly_days, dailyMinutes: goalData.daily_minutes })
    }
    loadData()

    // 实时订阅
    const channel = supabase.channel('workouts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workouts', filter: `user_id=eq.${user.id}` },
        () => {
          supabase.from('workouts').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
            .then(({ data }) => { if (data) setRecords(data) })
        }
      ).subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [useCloud, user])

  // 本地模式：写 localStorage
  useEffect(() => { if (!useCloud) saveJSON(STORAGE_KEY, records) }, [records, useCloud])
  useEffect(() => { if (!useCloud) saveJSON(GOALS_KEY, goals) }, [goals, useCloud])
  useEffect(() => { saveJSON(CUSTOM_TYPES_KEY, customTypes) }, [customTypes])
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const addRecord = useCallback(async (type, duration, note = '') => {
    let location = null
    try { location = await getCurrentPosition() } catch {}
    const id = Date.now().toString()
    const date = getDateKey()
    const newRecord = { id, date, type, duration, note, location, created_at: new Date().toISOString() }

    if (useCloud && user) {
      await supabase.from('workouts').insert({ ...newRecord, user_id: user.id })
      // 实时订阅会自动更新
    } else {
      setRecords(prev => [newRecord, ...prev])
    }
  }, [useCloud, user])

  const deleteRecord = useCallback(async (id) => {
    if (useCloud && user) {
      await supabase.from('workouts').delete().eq('id', id).eq('user_id', user.id)
    }
    setRecords(prev => prev.filter(r => r.id !== id))
  }, [useCloud, user])

  // 自定义运动类型管理
  const addExerciseType = useCallback((name, icon, color) => {
    const id = 'custom_' + Date.now().toString(36)
    const newType = { id, name, icon, color, builtin: false }
    setCustomTypes(prev => [...prev, newType])
    return id
  }, [])

  const deleteExerciseType = useCallback((id) => {
    setCustomTypes(prev => prev.filter(t => t.id !== id))
  }, [])

  const saveGoals = useCallback(async (newGoals) => {
    setGoals(newGoals)
    if (useCloud && user) {
      await supabase.from('goals').upsert({
        user_id: user.id,
        weekly_days: newGoals.weeklyDays,
        daily_minutes: newGoals.dailyMinutes,
      })
    }
  }, [useCloud, user])

  // 计算值（缓存）
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

  const totalDuration = useMemo(() => records.reduce((sum, r) => sum + (r.duration || 0), 0), [records])

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

    let activeDays = 0, totalMinutes = 0
    const dailyData = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(weekStart.getDate() + i)
      const key = getDateKey(d)
      const dayRecords = records.filter(r => r.date === key)
      const minutes = dayRecords.reduce((s, r) => s + (r.duration || 0), 0)
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
      stats[r.type].duration += (r.duration || 0)
    })
    return exerciseTypes.map(t => ({
      ...t,
      count: stats[t.id]?.count || 0,
      duration: stats[t.id]?.duration || 0,
    })).filter(s => s.count > 0).sort((a, b) => b.count - a.count)
  }

  return {
    records, addRecord, deleteRecord,
    todayRecords, isCheckedInToday,
    streak, monthCheckins,
    totalDuration, getMonthDates, exerciseTypes,
    getWeekStats, getRecentRecords, getTypeStats,
    goals, setGoals: saveGoals, theme, setTheme,
    addExerciseType, deleteExerciseType, customTypes,
  }
}
