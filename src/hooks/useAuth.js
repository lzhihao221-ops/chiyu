import { useState, useEffect, useCallback } from 'react'
import { supabase, isOnline } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  // 获取 session
  useEffect(() => {
    if (!isOnline) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) setProfile(data)
  }

  const handleAuth = useCallback(async (type, payload) => {
    if (type === 'guest') {
      setIsGuest(true)
      return
    }

    if (type === 'register') {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: { data: { username: payload.username } }
      })
      if (error) throw error
      // Supabase 默认开启邮箱确认，如果没开则自动登录
      if (data.session) setUser(data.user)
      else throw new Error('注册成功，请检查邮箱确认链接')
    }

    if (type === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      })
      if (error) throw error
    }
  }, [])

  const logout = useCallback(async () => {
    if (isOnline) await supabase.auth.signOut()
    setIsGuest(false)
    setUser(null)
    setProfile(null)
    localStorage.clear()
  }, [])

  const updateProfile = useCallback(async (updates) => {
    if (!user) return
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
    if (!error) setProfile(prev => ({ ...prev, ...updates }))
  }, [user])

  // 是否已登录（Supabase用户 或 游客）
  const isLoggedIn = !!user || isGuest
  // 是否使用云端
  const useCloud = !!user && isOnline

  return {
    user, profile, loading, isGuest, isLoggedIn, useCloud,
    handleAuth, logout, updateProfile,
  }
}
