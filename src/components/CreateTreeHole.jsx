import { useState } from 'react'

export default function CreateTreeHole({ categories, onSubmit, onClose }) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = () => {
    if (!content.trim() || !category) return
    onSubmit(content.trim(), category)
    setContent('')
    setCategory('')
    onClose()
  }

  return (
    <div className="treehole-overlay">
      <div className="treehole-modal">
        <div className="treehole-modal-header">
          <button className="treehole-modal-close" onClick={onClose}>取消</button>
          <h3>🕳️ 投入树洞</h3>
          <button
            className="treehole-modal-submit"
            onClick={handleSubmit}
            disabled={!content.trim() || !category}
          >投入</button>
        </div>

        <div className="treehole-modal-body">
          <div className="treehole-cat-grid">
            {categories.map(c => (
              <button
                key={c.id}
                className={`treehole-cat-btn ${category === c.id ? 'selected' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          <textarea
            className="treehole-textarea"
            placeholder="在这里，没人知道你是谁..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
            maxLength={2000}
            autoFocus
          />

          <div className="treehole-modal-footer">
            <span className="treehole-char-count">{content.length}/2000</span>
            <span className="treehole-privacy-hint">🔒 匿名发布，无人知晓</span>
          </div>
        </div>
      </div>
    </div>
  )
}
