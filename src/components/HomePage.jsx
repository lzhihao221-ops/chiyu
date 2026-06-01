import { useState } from 'react'

const BANNERS = [
  { id: 1, title: '🔥 热门直播中', subtitle: '健身达人在线教学', color: '#ff6b6b' },
  { id: 2, title: '🎯 今日特惠', subtitle: '运动装备低至3折', color: '#4f8cff' },
  { id: 3, title: '📚 精选课程', subtitle: '7天塑形计划免费领', color: '#34c759' },
]

const QUICK_ACTIONS = [
  { icon: '📺', label: '直播', color: '#ff4757' },
  { icon: '🛒', label: '商城', color: '#ff922b' },
  { icon: '📚', label: '课程', color: '#34c759' },
  { icon: '🎯', label: '打卡', color: '#4f8cff' },
  { icon: '💬', label: '圈子', color: '#cc5de8' },
  { icon: '🏆', label: '排行', color: '#fcc419' },
  { icon: '📸', label: '动态', color: '#20c997' },
  { icon: '⚙️', label: '更多', color: '#868e96' },
]

const MOCK_LIVE = [
  { id: 1, title: '晨跑30分钟燃脂', streamer: '健身小王', viewers: 1234, avatar: '🏃', cover: '#ff6b6b', tag: '直播中' },
  { id: 2, title: '瑜伽入门教学', streamer: '瑜伽Lily', viewers: 856, avatar: '🧘', cover: '#cc5de8', tag: '直播中' },
  { id: 3, title: '篮球技巧分享', streamer: '灌篮高手', viewers: 2341, avatar: '🏀', cover: '#ff922b', tag: '热门' },
]

const MOCK_PRODUCTS = [
  { id: 1, name: '智能运动手环', price: '¥199', original: '¥399', sales: '3.2万', emoji: '⌚' },
  { id: 2, name: '瑜伽垫加厚款', price: '¥89', original: '¥159', sales: '1.8万', emoji: '🧘' },
  { id: 3, name: '运动蓝牙耳机', price: '¥129', original: '¥299', sales: '5.6万', emoji: '🎧' },
  { id: 4, name: '蛋白粉补剂', price: '¥158', original: '¥268', sales: '2.1万', emoji: '🥤' },
]

const MOCK_TOPICS = [
  { id: 1, title: '每天跑步5公里的变化', posts: '2.3万', icon: '🔥' },
  { id: 2, title: '减脂餐食谱分享', posts: '1.8万', icon: '🥗' },
  { id: 3, title: '新手健身避坑指南', posts: '9.5千', icon: '💡' },
  { id: 4, title: '在家也能做的运动', posts: '1.2万', icon: '🏠' },
]

export default function HomePage({ onNavigate }) {
  const [bannerIdx, setBannerIdx] = useState(0)

  return (
    <div className="home-page">
      {/* Banner 轮播 */}
      <div className="banner-carousel">
        {BANNERS.map((b, i) => (
          <div
            key={b.id}
            className={`banner-card ${i === bannerIdx ? 'active' : ''}`}
            style={{ background: `linear-gradient(135deg, ${b.color}, ${b.color}dd)` }}
            onClick={() => setBannerIdx((i + 1) % BANNERS.length)}
          >
            <div className="banner-text">
              <h3>{b.title}</h3>
              <p>{b.subtitle}</p>
            </div>
          </div>
        ))}
        <div className="banner-dots">
          {BANNERS.map((_, i) => (
            <span key={i} className={`dot ${i === bannerIdx ? 'active' : ''}`} onClick={() => setBannerIdx(i)} />
          ))}
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="quick-actions">
        {QUICK_ACTIONS.map((a, i) => (
          <button
            key={i}
            className="quick-action-btn"
            onClick={() => {
              if (a.label === '打卡') onNavigate('checkin')
              else if (a.label === '直播') onNavigate('live')
              else if (a.label === '商城') onNavigate('shop')
              else if (a.label === '课程') onNavigate('knowledge')
              else if (a.label === '圈子') onNavigate('community')
              else if (a.label === '动态') onNavigate('community')
              else if (a.label === '排行') onNavigate('stats')
              else if (a.label === '更多') onNavigate('profile')
            }}
          >
            <span className="qa-icon" style={{ background: a.color + '20', color: a.color }}>{a.icon}</span>
            <span className="qa-label">{a.label}</span>
          </button>
        ))}
      </div>

      {/* 直播推荐 */}
      <div className="section-block">
        <div className="section-header">
          <h2>📺 正在直播</h2>
          <span className="section-more" onClick={() => onNavigate('live')}>更多 ›</span>
        </div>
        <div className="live-scroll">
          {MOCK_LIVE.map(live => (
            <div key={live.id} className="live-card">
              <div className="live-cover" style={{ background: `linear-gradient(135deg, ${live.cover}, ${live.cover}88)` }}>
                <span className="live-avatar">{live.avatar}</span>
                <span className="live-tag">🔴 {live.tag}</span>
                <span className="live-viewers">👁 {live.viewers}</span>
              </div>
              <div className="live-info">
                <h4>{live.title}</h4>
                <span className="live-streamer">{live.streamer}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 热门话题 */}
      <div className="section-block">
        <div className="section-header">
          <h2>🔥 热门话题</h2>
          <span className="section-more">更多 ›</span>
        </div>
        <div className="topics-list">
          {MOCK_TOPICS.map((topic, i) => (
            <div key={topic.id} className="topic-item">
              <span className="topic-rank">{i + 1}</span>
              <span className="topic-icon">{topic.icon}</span>
              <div className="topic-info">
                <h4>{topic.title}</h4>
                <span>{topic.posts} 讨论</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 精选商城 */}
      <div className="section-block">
        <div className="section-header">
          <h2>🛒 精选好物</h2>
          <span className="section-more" onClick={() => onNavigate('shop')}>更多 ›</span>
        </div>
        <div className="products-grid">
          {MOCK_PRODUCTS.map(p => (
            <div key={p.id} className="product-card">
              <div className="product-emoji">{p.emoji}</div>
              <div className="product-info">
                <h4>{p.name}</h4>
                <div className="product-prices">
                  <span className="product-price">{p.price}</span>
                  <span className="product-original">{p.original}</span>
                </div>
                <span className="product-sales">已售 {p.sales}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 推荐内容 */}
      <div className="section-block">
        <div className="section-header">
          <h2>📝 推荐内容</h2>
          <span className="section-more" onClick={() => onNavigate('community')}>更多 ›</span>
        </div>
        <div className="recommend-list">
          {[
            { title: '30天腹肌挑战计划', author: '健身教练老张', likes: '3.2万', tag: '健身' },
            { title: '如何养成早起运动的习惯', author: '晨跑达人', likes: '1.8万', tag: '生活' },
            { title: '减脂期怎么吃？完整食谱', author: '营养师小李', likes: '2.5万', tag: '饮食' },
          ].map((item, i) => (
            <div key={i} className="recommend-card">
              <div className="recommend-content">
                <span className="recommend-tag">{item.tag}</span>
                <h4>{item.title}</h4>
                <div className="recommend-meta">
                  <span>{item.author}</span>
                  <span>❤️ {item.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
