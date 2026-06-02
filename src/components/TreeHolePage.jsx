import { useState } from 'react'
import './TreeHole.css'

export default function TreeHolePage({ holes, categories, reactions, onDelete, onReaction, onComment, userId, onCreate }) {
  const [expandedHole, setExpandedHole] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const filtered = filterCategory === 'all' ? holes : holes.filter(h => h.category === filterCategory)

  const getCatInfo = (catId) => categories.find(c => c.id === catId) || { icon: '📌', name: '其他' }

  const formatTime = (iso) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = now - d
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  const getReactionCount = (hole, reactionId) => {
    return (hole.reactions || []).filter(r => r.reaction === reactionId).length
  }

  const hasReacted = (hole, reactionId) => {
    return (hole.reactions || []).some(r => r.userId === userId && r.reaction === reactionId)
  }

  const handleComment = (holeId) => {
    if (!commentText.trim()) return
    onComment(holeId, commentText.trim())
    setCommentText('')
  }

  const randomPlaceholder = () => {
    const tips = ['今天的你，辛苦了...', '有件事一直没说出口...', '其实我想说...', '藏在心里很久了...', '在这里没人认识我...']
    return tips[Math.floor(Math.random() * tips.length)]
  }

  return (
    <div className="treehole-container">
      {/* 标签筛选 */}
      <div className="treehole-categories">
        <button
          className={`treehole-chip ${filterCategory === 'all' ? 'active' : ''}`}
          onClick={() => setFilterCategory('all')}
        >🌀 全部</button>
        {categories.map(c => (
          <button
            key={c.id}
            className={`treehole-chip ${filterCategory === c.id ? 'active' : ''}`}
            onClick={() => setFilterCategory(c.id)}
          >{c.icon} {c.name}</button>
        ))}
      </div>

      {/* 帖子列表 */}
      {filtered.length === 0 ? (
        <div className="treehole-empty">
          <div className="treehole-empty-icon">🕳️</div>
          <p>树洞里还很安静...</p>
          <p className="treehole-empty-hint">第一个说出来的人，最勇敢</p>
        </div>
      ) : (
        <div className="treehole-list">
          {filtered.map(hole => {
            const cat = getCatInfo(hole.id)
            const isExpanded = expandedHole === hole.id

            return (
              <div key={hole.id} className="treehole-card">
                <div className="treehole-card-header">
                  <span className="treehole-avatar">{hole.anon_emoji}</span>
                  <div className="treehole-meta">
                    <span className="treehole-anon-name">{hole.anon_name}</span>
                    <span className="treehole-time">{formatTime(hole.created_at)}</span>
                  </div>
                  <span className="treehole-cat-badge">{getCatInfo(hole.category).icon}</span>
                </div>

                <p className="treehole-content">{hole.content}</p>

                {hole.images && hole.images.length > 0 && (
                  <div className="post-images treehole-images">
                    {hole.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="post-image" />
                    ))}
                  </div>
                )}

                {/* 反应按钮 */}
                <div className="treehole-reactions">
                  {reactions.map(r => {
                    const count = getReactionCount(hole, r.id)
                    const reacted = hasReacted(hole, r.id)
                    return (
                      <button
                        key={r.id}
                        className={`treehole-reaction-btn ${reacted ? 'reacted' : ''}`}
                        onClick={() => onReaction(hole.id, r.id)}
                      >
                        {r.emoji} {count > 0 && count}
                      </button>
                    )
                  })}
                  <button
                    className="treehole-comment-toggle"
                    onClick={() => setExpandedHole(isExpanded ? null : hole.id)}
                  >
                    💬 {hole.comments?.length || 0}
                  </button>
                </div>

                {/* 评论区 */}
                {isExpanded && (
                  <div className="treehole-comments">
                    {hole.comments?.length > 0 ? (
                      <div className="treehole-comment-list">
                        {hole.comments.map(c => (
                          <div key={c.id} className="treehole-comment-item">
                            <span className="treehole-comment-avatar">{c.authorEmoji || c.anon_emoji}</span>
                            <div className="treehole-comment-body">
                              <span className="treehole-comment-name">{c.authorName || c.anon_name}</span>
                              <span className="treehole-comment-text">{c.content}</span>
                              <span className="treehole-comment-time">{formatTime(c.created_at)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="treehole-no-comments">还没有人回应...</p>
                    )}
                    <div className="treehole-comment-input">
                      <input
                        type="text"
                        placeholder="匿名回应..."
                        value={isExpanded ? commentText : ''}
                        onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleComment(hole.id)}
                      />
                      <button onClick={() => handleComment(hole.id)}>发送</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* 发布按钮 */}
      <button className="treehole-fab" onClick={onCreate}>🕳️</button>
    </div>
  )
}
