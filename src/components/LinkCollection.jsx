import { useState } from 'react'
import './LinkCollection.css'

export default function LinkCollection({ links, categories, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = () => {
    if (!url.trim() || !title.trim()) return
    let finalUrl = url.trim()
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl
    onAdd(finalUrl, title.trim(), description.trim(), category)
    setUrl(''); setTitle(''); setDescription(''); setCategory('')
    setShowForm(false)
  }

  const getCategoryInfo = (catId) => categories.find(c => c.id === catId) || { icon: '🔗', name: '其他' }

  const getDomain = (urlStr) => {
    try { return new URL(urlStr).hostname } catch { return urlStr }
  }

  return (
    <div className="links-section">
      <div className="links-header">
        <h2>🔗 链接收藏</h2>
        <button className="links-add-btn" onClick={() => setShowForm(true)}>+ 收藏</button>
      </div>

      {showForm && (
        <div className="links-form">
          <input type="text" placeholder="网址 URL" value={url} onChange={e => setUrl(e.target.value)} />
          <input type="text" placeholder="标题" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea placeholder="描述/摘要（可选）" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          <div className="links-cat-row">
            {categories.map(c => (
              <button
                key={c.id}
                className={`links-cat-btn ${category === c.id ? 'selected' : ''}`}
                onClick={() => setCategory(c.id)}
              >{c.icon}</button>
            ))}
          </div>
          <div className="links-form-actions">
            <button onClick={() => setShowForm(false)}>取消</button>
            <button className="primary" onClick={handleSubmit}>保存</button>
          </div>
        </div>
      )}

      <div className="links-list">
        {links.length === 0 ? (
          <p className="links-empty">📭 还没有收藏的链接</p>
        ) : (
          links.map(link => {
            const cat = getCategoryInfo(link.category)
            return (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="link-card">
                <div className="link-card-main">
                  <span className="link-card-cat">{cat.icon}</span>
                  <div className="link-card-info">
                    <h3>{link.title}</h3>
                    {link.description && <p className="link-desc">{link.description}</p>}
                    <span className="link-domain">{getDomain(link.url)}</span>
                  </div>
                </div>
                <button
                  className="link-delete"
                  onClick={(e) => { e.preventDefault(); onDelete(link.id) }}
                >×</button>
              </a>
            )
          })
        )}
      </div>
    </div>
  )
}
