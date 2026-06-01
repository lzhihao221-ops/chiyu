import { useState } from 'react'

export default function PostFeed({ posts, categories, onLike, onDelete, onComment, userId }) {
  const [expandedPost, setExpandedPost] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const filteredPosts = filterCategory === 'all'
    ? posts
    : posts.filter(p => p.category === filterCategory)

  const getCategoryInfo = (catId) => {
    return categories.find(c => c.id === catId) || { icon: '📌', name: '其他' }
  }

  const formatTime = (iso) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = now - d
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  const handleComment = (postId) => {
    if (!commentText.trim()) return
    onComment(postId, commentText.trim())
    setCommentText('')
  }

  if (posts.length === 0) {
    return (
      <div className="feed-empty">
        <p>📭 还没有帖子</p>
        <p className="feed-empty-hint">点击右下角 + 发布第一条内容吧！</p>
      </div>
    )
  }

  return (
    <div className="feed-container">
      <div className="category-filter">
        <button
          className={`filter-chip ${filterCategory === 'all' ? 'active' : ''}`}
          onClick={() => setFilterCategory('all')}
        >全部</button>
        {categories.map(c => (
          <button
            key={c.id}
            className={`filter-chip ${filterCategory === c.id ? 'active' : ''}`}
            onClick={() => setFilterCategory(c.id)}
          >{c.icon} {c.name}</button>
        ))}
      </div>

      <div className="post-list">
        {filteredPosts.map(post => {
          const cat = getCategoryInfo(post.category)
          const isLiked = post.likes.includes(userId)
          const isExpanded = expandedPost === post.id

          return (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <span className="post-avatar">{post.authorName.charAt(0)}</span>
                <div className="post-meta">
                  <span className="post-author">{post.authorName}</span>
                  <span className="post-time">{formatTime(post.createdAt)}</span>
                </div>
                <span className="post-category-badge">{cat.icon} {cat.name}</span>
              </div>

              <h3 className="post-title">{post.title}</h3>
              <p className="post-content">{post.content}</p>

              {post.images && post.images.length > 0 && (
                <div className="post-images">
                  {post.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="post-image" />
                  ))}
                </div>
              )}

              <div className="post-actions">
                <button
                  className={`action-btn ${isLiked ? 'liked' : ''}`}
                  onClick={() => onLike(post.id)}
                >
                  {isLiked ? '❤️' : '🤍'} {post.likes.length}
                </button>
                <button
                  className="action-btn"
                  onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                >
                  💬 {post.comments.length}
                </button>
                {post.authorId === userId && (
                  <button className="action-btn delete" onClick={() => onDelete(post.id)}>
                    🗑
                  </button>
                )}
              </div>

              {isExpanded && (
                <div className="comments-section">
                  {post.comments.length > 0 ? (
                    <div className="comments-list">
                      {post.comments.map(c => (
                        <div key={c.id} className="comment-item">
                          <span className="comment-author">{c.authorName}</span>
                          <span className="comment-text">{c.content}</span>
                          <span className="comment-time">{formatTime(c.createdAt)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-comments">暂无评论</p>
                  )}
                  <div className="comment-input-row">
                    <input
                      type="text"
                      placeholder="写评论..."
                      value={expandedPost === post.id ? commentText : ''}
                      onChange={e => setCommentText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleComment(post.id)}
                    />
                    <button onClick={() => handleComment(post.id)}>发送</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
