import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const ADJECTIVES = ['害羞的', '失眠的', '开心的', '迷茫的', '勇敢的', '孤独的', '温柔的', '暴躁的', '佛系的', '社恐的', '话痨的', '纠结的', '乐观的', '敏感的', '慢热的', '酷酷的', '软萌的', '疲惫的', '自由的', '浪漫的']
const ANIMALS = ['猫咪', '企鹅', '柴犬', '兔子', '仓鼠', '树懒', '海豚', '熊猫', '狐狸', '刺猬', '水獭', '考拉', '小鹿', '海鸥', '鲸鱼', '蝴蝶', '松鼠', '天鹅', '猫头鹰', '小鱼']
const EMOJIS = ['🐱', '🐧', '🐶', '🐰', '🐹', '🦥', '🐬', '🐼', '🦊', '🦔', '🦦', '🐨', '🦌', '🐋', '🦋', '🐿️', '🦢', '🦉', '🐟', '🐝']

const CATEGORIES = [
  { id: 'emotion', name: '情感', icon: '💗' },
  { id: 'work', name: '职场', icon: '💼' },
  { id: 'school', name: '校园', icon: '🎓' },
  { id: 'life', name: '生活', icon: '🌿' },
  { id: 'secret', name: '秘密', icon: '🤫' },
  { id: 'rant', name: '吐槽', icon: '😤' },
]

const REACTIONS = [
  { id: 'hug', emoji: '🤗', label: '抱抱' },
  { id: 'cheer', emoji: '💪', label: '加油' },
  { id: 'resonate', emoji: '❤️', label: '共鸣' },
  { id: 'haha', emoji: '😂', label: '哈哈' },
]

function randomIdentity() {
  const adjIdx = Math.floor(Math.random() * ADJECTIVES.length)
  const animalIdx = Math.floor(Math.random() * ANIMALS.length)
  return {
    name: ADJECTIVES[adjIdx] + ANIMALS[animalIdx],
    emoji: EMOJIS[animalIdx],
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function useTreeHole(user, useCloud) {
  const [holes, setHoles] = useState([])
  const userId = user?.id || localStorage.getItem('user-id') || 'local'

  // 加载树洞数据
  useEffect(() => {
    if (!useCloud) return

    const loadHoles = async () => {
      const { data } = await supabase
        .from('tree_holes')
        .select('*, tree_hole_comments(*), tree_hole_reactions(*)')
        .order('created_at', { ascending: false })

      if (data) {
        const formatted = data.map(h => ({
          ...h,
          comments: (h.tree_hole_comments || []).map(c => ({
            ...c,
            authorName: c.anon_name,
            authorEmoji: c.anon_emoji,
          })),
          reactions: (h.tree_hole_reactions || []).map(r => ({
            userId: r.user_id,
            reaction: r.reaction,
          })),
        }))
        setHoles(formatted)
      }
    }
    loadHoles()

    // 实时订阅
    const channel = supabase
      .channel('tree-holes-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tree_holes' }, loadHoles)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tree_hole_comments' }, loadHoles)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tree_hole_reactions' }, loadHoles)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [useCloud])

  // 发布树洞
  const addHole = useCallback(async (content, category) => {
    if (!useCloud || !user) return
    const id = generateId()
    const identity = randomIdentity()

    await supabase.from('tree_holes').insert({
      id,
      user_id: user.id,
      content,
      category,
      anon_name: identity.name,
      anon_emoji: identity.emoji,
    })

    const newHole = {
      id,
      content,
      category,
      anon_name: identity.name,
      anon_emoji: identity.emoji,
      created_at: new Date().toISOString(),
      comments: [],
      reactions: [],
    }
    setHoles(prev => [newHole, ...prev])
    return id
  }, [useCloud, user])

  // 删除树洞
  const deleteHole = useCallback(async (id) => {
    if (!useCloud || !user) return
    await supabase.from('tree_holes').delete().eq('id', id).eq('user_id', user.id)
    setHoles(prev => prev.filter(h => h.id !== id))
  }, [useCloud, user])

  // 添加反应
  const addReaction = useCallback(async (holeId, reaction) => {
    if (!useCloud || !user) return

    // 检查是否已有该反应
    const hole = holes.find(h => h.id === holeId)
    const existing = hole?.reactions?.find(r => r.userId === user.id && r.reaction === reaction)
    if (existing) return

    await supabase.from('tree_hole_reactions').insert({
      hole_id: holeId,
      user_id: user.id,
      reaction,
    })

    setHoles(prev => prev.map(h => {
      if (h.id !== holeId) return h
      return { ...h, reactions: [...h.reactions, { userId: user.id, reaction }] }
    }))
  }, [useCloud, user, holes])

  // 添加评论
  const addComment = useCallback(async (holeId, content) => {
    if (!useCloud || !user) return
    const id = generateId()
    const identity = randomIdentity()

    await supabase.from('tree_hole_comments').insert({
      id,
      hole_id: holeId,
      user_id: user.id,
      content,
      anon_name: identity.name,
      anon_emoji: identity.emoji,
    })

    const comment = {
      id,
      content,
      anon_name: identity.name,
      anon_emoji: identity.emoji,
      authorName: identity.name,
      authorEmoji: identity.emoji,
      created_at: new Date().toISOString(),
    }
    setHoles(prev => prev.map(h => {
      if (h.id !== holeId) return h
      return { ...h, comments: [...h.comments, comment] }
    }))
  }, [useCloud, user])

  return {
    holes,
    addHole,
    deleteHole,
    addReaction,
    addComment,
    categories: CATEGORIES,
    reactions: REACTIONS,
  }
}
