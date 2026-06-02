import { supabase } from './supabase'

const BUCKET = 'post-images'

/**
 * 压缩图片到最大宽度1200px，质量0.8
 */
async function compressImage(file, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        if (img.width <= maxWidth) {
          resolve(file)
          return
        }
        const canvas = document.createElement('canvas')
        const ratio = maxWidth / img.width
        canvas.width = maxWidth
        canvas.height = img.height * ratio
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })),
          'image/jpeg',
          quality
        )
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

/**
 * 上传图片到 Supabase Storage，返回公开URL
 */
export async function uploadImage(file) {
  const compressed = await compressImage(file)
  const ext = compressed.name.split('.').pop() || 'jpg'
  const path = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, compressed, { contentType: compressed.type })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/**
 * 批量上传图片
 */
export async function uploadImages(files) {
  const urls = []
  for (const file of files) {
    const url = await uploadImage(file)
    urls.push(url)
  }
  return urls
}
