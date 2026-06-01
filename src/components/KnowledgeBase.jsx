import { useState } from 'react'

export default function KnowledgeBase({ knowledge, categories, onAdd, onDelete, onUpdate }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = knowledge.filter(k => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return k.title.toLowerCase().includes(q) ||
           k.content.toLowerCase().includes(q) ||
           k.tags.some(t => t.toLowerCase().includes(q))
  })

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)
    if (editingId) {
      onUpdate(editingId, { title: title.trim(), content: content.trim(), category, tags: tagList })
    } else {
      onAdd(title.trim(), content.trim(), category, tagList)
    }
    resetForm()
  }

  const resetForm = () => {
    setTitle(''); setContent(''); setCategory(''); setTags('')
    setShowForm(false); setEditingId(null)
  }

  const startEdit = (entry) => {
    setEditingId(entry.id)
    setTitle(entry.title)
    setContent(entry.content)
    setCategory(entry.category)
    setTags(entry.tags.join(', '))
    setShowForm(true)
  }

  const getCategoryInfo = (catId) => categories.find(c => c.id === catId) || { icon: '📌', name: '其他' }

  return (
    <div className="kb-section">
      <div className="kb-header">
        <h2>📚 知识库</h2>
        <button className="kb-add-btn" onClick={() => setShowForm(true)}>+ 新建</button>
      </div>

      <div className="kb-search">
        <input
          type="text"
          placeholder="🔍 搜索知识..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="kb-form">
          <input
            type="text" placeholder="标题" value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <div className="kb-cat-row">
            {categories.map(c => (
              <button
                key={c.id}
                className={`kb-cat-btn ${category === c.id ? 'selected' : ''}`}
                onClick={() => setCategory(c.id)}
              >{c.icon}</button>
            ))}
          </div>
          <textarea
            placeholder="知识内容..." value={content}
            onChange={e => setContent(e.target.value)} rows={5}
          />
          <input
            type="text" placeholder="标签（用逗号分隔）" value={tags}
            onChange={e => setTags(e.target.value)}
          />
          <div className="kb-form-actions">
            <button onClick={resetForm}>取消</button>
            <button className="primary" onClick={handleSubmit}>{editingId ? '更新' : '保存'}</button>
          </div>
        </div>
      )}

      <div className="kb-list">
        {filtered.length === 0 ? (
          <p className="kb-empty">📭 {searchQuery ? '没有找到相关内容' : '还没有知识条目'}</p>
        ) : (
          filtered.map(entry => {
            const cat = getCategoryInfo(entry.category)
            return (
              <div key={entry.id} className="kb-card">
                <div className="kb-card-header">
                  <span className="kb-card-cat">{cat.icon}</span>
                  <h3>{entry.title}</h3>
                </div>
                <p className="kb-card-content">{entry.content}</p>
                {entry.tags.length > 0 && (
                  <div className="kb-tags">
                    {entry.tags.map((t, i) => <span key={i} className="kb-tag">#{t}</span>)}
                  </div>
                )}
                <div className="kb-card-footer">
                  <span className="kb-card-time">{new Date(entry.updatedAt).toLocaleDateString('zh-CN')}</span>
                  <div className="kb-card-actions">
                    <button onClick={() => startEdit(entry)}>✏️</button>
                    <button onClick={() => onDelete(entry.id)}>🗑</button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
