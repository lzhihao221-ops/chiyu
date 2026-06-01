import { useState, useEffect, useCallback } from 'react'

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

// 模拟用户（本地存储）
function getUserId() {
  let uid = localStorage.getItem('user-id')
  if (!uid) {
    uid = 'user_' + generateId()
    localStorage.setItem('user-id', uid)
  }
  return uid
}

function getUserName() {
  return localStorage.getItem('user-name') || '匿名用户'
}

export function useCommunity() {
  const [posts, setPosts] = useState(() => loadJSON(POSTS_KEY, []))
  const [knowledge, setKnowledge] = useState(() => loadJSON(KNOWLEDGE_KEY, []))
  const [links, setLinks] = useState(() => loadJSON(LINKS_KEY, []))
  const [userName, setUserNameState] = useState(getUserName)
  const userId = getUserId()

  useEffect(() => { saveJSON(POSTS_KEY, posts) }, [posts])
  useEffect(() => { saveJSON(KNOWLEDGE_KEY, knowledge) }, [knowledge])
  useEffect(() => { saveJSON(LINKS_KEY, links) }, [links])

  const setUserName = useCallback((name) => {
    setUserNameState(name)
    localStorage.setItem('user-name', name)
  }, [])

  // === 帖子 ===
  const addPost = useCallback((title, content, category, images = []) => {
    const post = {
      id: generateId(),
      title, content, category, images,
      authorId: userId,
      authorName: userName,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    }
    setPosts(prev => [post, ...prev])
    return post.id
  }, [userId, userName])

  const deletePost = useCallback((id) => {
    setPosts(prev => prev.filter(p => p.id !== id))
  }, [])

  const toggleLike = useCallback((postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const liked = p.likes.includes(userId)
      return {
        ...p,
        likes: liked ? p.likes.filter(id => id !== userId) : [...p.likes, userId]
      }
    }))
  }, [userId])

  const addComment = useCallback((postId, content) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return {
        ...p,
        comments: [...p.comments, {
          id: generateId(),
          content,
          authorId: userId,
          authorName: userName,
          createdAt: new Date().toISOString(),
        }]
      }
    }))
  }, [userId, userName])

  // === 知识库 ===
  const addKnowledge = useCallback((title, content, category, tags = []) => {
    const entry = {
      id: generateId(),
      title, content, category, tags,
      authorId: userId,
      authorName: userName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setKnowledge(prev => [entry, ...prev])
  }, [userId, userName])

  const updateKnowledge = useCallback((id, updates) => {
    setKnowledge(prev => prev.map(k =>
      k.id === id ? { ...k, ...updates, updatedAt: new Date().toISOString() } : k
    ))
  }, [])

  const deleteKnowledge = useCallback((id) => {
    setKnowledge(prev => prev.filter(k => k.id !== id))
  }, [])

  // === 链接收藏 ===
  const addLink = useCallback((url, title, description, category) => {
    const link = {
      id: generateId(),
      url, title, description, category,
      authorId: userId,
      authorName: userName,
      createdAt: new Date().toISOString(),
    }
    setLinks(prev => [link, ...prev])
  }, [userId, userName])

  const deleteLink = useCallback((id) => {
    setLinks(prev => prev.filter(l => l.id !== id))
  }, [])

  return {
    // 帖子
    posts, addPost, deletePost, toggleLike, addComment,
    // 知识库
    knowledge, addKnowledge, updateKnowledge, deleteKnowledge,
    // 链接
    links, addLink, deleteLink,
    // 用户
    userName, setUserName, userId,
    // 分类
    categories: CATEGORIES,
  }
}
