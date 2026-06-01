import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const POSTS_KEY = 'community-posts'
const KNOWLEDGE_KEY = 'community-knowledge'
const LINKS_KEY = 'community-links'

const CATEGORIES = [
  { id: 'tech', name: '科技', icon: '💻' },
  { id: 'life', name: '生活', icon: '🌿' },
  { id: 'work', name: '工作', icon: '💼' },
  { id: 'learn', name: '学习', icon: '📚' },
  { id: 'idea', name: '想法', icon: '💡' },
  { id: 'share', name: '分享', icon: '🔗' },
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

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function useCommunity(user, useCloud) {
  const [posts, setPosts] = useState(() => loadJSON(POSTS_KEY, []))
  const [knowledge, setKnowledge] = useState(() => loadJSON(KNOWLEDGE_KEY, []))
  const [links, setLinks] = useState(() => loadJSON(LINKS_KEY, []))
  const [userName, setUserNameState] = useState(() => localStorage.getItem('user-name') || '匿名用户')
  const userId = user?.id || localStorage.getItem('user-id') || (() => { const id = 'user_' + generateId(); localStorage.setItem('user-id', id); return id })()

  // 云端模式：加载数据
  useEffect(() => {
    if (!useCloud || !user) return

    const loadAll = async () => {
      // 加载帖子（含点赞和评论数）
      const { data: postsData } = await supabase
        .from('posts').select('*, likes(user_id), comments(*)')
        .order('created_at', { ascending: false })
      if (postsData) {
        const formatted = postsData.map(p => ({
          ...p,
          authorId: p.user_id,
          authorName: p.author_name || '匿名用户',
          likes: (p.likes || []).map(l => l.user_id),
          comments: (p.comments || []).map(c => ({
            ...c,
            authorId: c.user_id,
            authorName: c.author_name || '匿名用户',
          })),
        }))
        setPosts(formatted)
      }

      // 加载知识库
      const { data: kbData } = await supabase
        .from('knowledge').select('*').order('created_at', { ascending: false })
      if (kbData) setKnowledge(kbData.map(k => ({ ...k, authorId: k.user_id })))

      // 加载链接
      const { data: linkData } = await supabase
        .from('links').select('*').order('created_at', { ascending: false })
      if (linkData) setLinks(linkData.map(l => ({ ...l, authorId: l.user_id })))

      // 加载用户名
      const { data: profile } = await supabase
        .from('profiles').select('username').eq('id', user.id).single()
      if (profile?.username) setUserNameState(profile.username)
    }
    loadAll()
  }, [useCloud, user])

  // 本地模式：写 localStorage
  useEffect(() => { if (!useCloud) saveJSON(POSTS_KEY, posts) }, [posts, useCloud])
  useEffect(() => { if (!useCloud) saveJSON(KNOWLEDGE_KEY, knowledge) }, [knowledge, useCloud])
  useEffect(() => { if (!useCloud) saveJSON(LINKS_KEY, links) }, [links, useCloud])

  const setUserName = useCallback(async (name) => {
    setUserNameState(name)
    localStorage.setItem('user-name', name)
    if (useCloud && user) {
      await supabase.from('profiles').update({ username: name }).eq('id', user.id)
    }
  }, [useCloud, user])

  // === 帖子 ===
  const addPost = useCallback(async (title, content, category, images = []) => {
    const id = generateId()
    const newPost = {
      id, title, content, category, images,
      authorId: userId,
      authorName: userName,
      likes: [],
      comments: [],
      created_at: new Date().toISOString(),
    }

    if (useCloud && user) {
      await supabase.from('posts').insert({
        id, user_id: user.id, title, content, category, images,
        author_name: userName,
      })
      // 实时订阅会更新，但本地也先加
    }
    setPosts(prev => [newPost, ...prev])
    return id
  }, [useCloud, user, userId, userName])

  const deletePost = useCallback(async (id) => {
    if (useCloud && user) {
      await supabase.from('posts').delete().eq('id', id).eq('user_id', user.id)
    }
    setPosts(prev => prev.filter(p => p.id !== id))
  }, [useCloud, user])

  const toggleLike = useCallback(async (postId) => {
    if (useCloud && user) {
      const existing = posts.find(p => p.id === postId)
      const liked = existing?.likes?.includes(userId)
      if (liked) {
        await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id)
      } else {
        await supabase.from('likes').insert({ post_id: postId, user_id: user.id })
      }
    }
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const liked = p.likes.includes(userId)
      return { ...p, likes: liked ? p.likes.filter(id => id !== userId) : [...p.likes, userId] }
    }))
  }, [useCloud, user, userId, posts])

  const addComment = useCallback(async (postId, content) => {
    const comment = {
      id: generateId(),
      content,
      authorId: userId,
      authorName: userName,
      created_at: new Date().toISOString(),
    }

    if (useCloud && user) {
      await supabase.from('comments').insert({
        id: comment.id, post_id: postId, user_id: user.id, content, author_name: userName,
      })
    }
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return { ...p, comments: [...p.comments, comment] }
    }))
  }, [useCloud, user, userId, userName])

  // === 知识库 ===
  const addKnowledge = useCallback(async (title, content, category, tags = []) => {
    const id = generateId()
    const entry = { id, title, content, category, tags, authorId: userId, authorName: userName, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }

    if (useCloud && user) {
      await supabase.from('knowledge').insert({ id, user_id: user.id, title, content, category, tags })
    }
    setKnowledge(prev => [entry, ...prev])
  }, [useCloud, user, userId, userName])

  const updateKnowledge = useCallback(async (id, updates) => {
    if (useCloud && user) {
      await supabase.from('knowledge').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id)
    }
    setKnowledge(prev => prev.map(k => k.id === id ? { ...k, ...updates, updated_at: new Date().toISOString() } : k))
  }, [useCloud, user])

  const deleteKnowledge = useCallback(async (id) => {
    if (useCloud && user) {
      await supabase.from('knowledge').delete().eq('id', id).eq('user_id', user.id)
    }
    setKnowledge(prev => prev.filter(k => k.id !== id))
  }, [useCloud, user])

  // === 链接收藏 ===
  const addLink = useCallback(async (url, title, description, category) => {
    const id = generateId()
    const link = { id, url, title, description, category, authorId: userId, authorName: userName, created_at: new Date().toISOString() }

    if (useCloud && user) {
      await supabase.from('links').insert({ id, user_id: user.id, url, title, description, category })
    }
    setLinks(prev => [link, ...prev])
  }, [useCloud, user, userId, userName])

  const deleteLink = useCallback(async (id) => {
    if (useCloud && user) {
      await supabase.from('links').delete().eq('id', id).eq('user_id', user.id)
    }
    setLinks(prev => prev.filter(l => l.id !== id))
  }, [useCloud, user])

  return {
    posts, addPost, deletePost, toggleLike, addComment,
    knowledge, addKnowledge, updateKnowledge, deleteKnowledge,
    links, addLink, deleteLink,
    userName, setUserName, userId,
    categories: CATEGORIES,
  }
}
