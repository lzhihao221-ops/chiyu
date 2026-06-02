import { useState } from 'react'
import ImagePicker from './ImagePicker'

export default function CreatePost({ categories, onSubmit, onClose, useCloud }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [images, setImages] = useState([])

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !category) return
    onSubmit(title.trim(), content.trim(), category, images)
    setTitle('')
    setContent('')
    setCategory('')
    setImages([])
    onClose()
  }

  return (
    <div className="create-overlay">
      <div className="create-modal">
        <div className="create-header">
          <button className="create-close" onClick={onClose}>取消</button>
          <h3>发布内容</h3>
          <button
            className="create-submit"
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || !category}
          >发布</button>
        </div>

        <div className="create-body">
          <div className="create-category-grid">
            {categories.map(c => (
              <button
                key={c.id}
                className={`create-cat-btn ${category === c.id ? 'selected' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          <input
            type="text"
            className="create-title-input"
            placeholder="标题"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={50}
          />

          <textarea
            className="create-content-input"
            placeholder="分享你的想法、知识或内容..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            maxLength={2000}
          />

          <ImagePicker images={images} setImages={setImages} useCloud={useCloud} />
        </div>
      </div>
    </div>
  )
}
