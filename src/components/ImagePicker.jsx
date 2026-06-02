import { useState, useRef } from 'react'
import { uploadImages } from '../lib/upload'

export default function ImagePicker({ images, setImages, useCloud }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  const handlePick = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    if (useCloud) {
      setUploading(true)
      try {
        const urls = await uploadImages(files)
        setImages(prev => [...prev, ...urls])
      } catch (err) {
        console.error('Upload failed:', err)
        alert('图片上传失败，请重试')
      }
      setUploading(false)
    } else {
      // 本地模式用base64
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (ev) => setImages(prev => [...prev, ev.target.result])
        reader.readAsDataURL(file)
      })
    }
    e.target.value = ''
  }

  return (
    <div className="image-picker">
      <label className="image-picker-btn" onClick={() => inputRef.current?.click()}>
        {uploading ? '⏳ 上传中...' : '📷 添加图片'}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handlePick}
        style={{ display: 'none' }}
      />
      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((img, i) => (
            <div key={i} className="preview-thumb">
              <img src={img} alt="" />
              <button className="preview-remove" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
