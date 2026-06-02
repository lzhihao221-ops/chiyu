import { useState } from 'react'
import './LivePage.css'

const MOCK_STREAMS = [
  { id: 1, title: '晨跑30分钟燃脂训练', streamer: '健身小王', viewers: 1234, avatar: '🏃', cover: '#ff6b6b', category: '跑步', started: '07:00' },
  { id: 2, title: '瑜伽入门·柔韧性提升', streamer: '瑜伽Lily', viewers: 856, avatar: '🧘', cover: '#cc5de8', category: '瑜伽', started: '08:30' },
  { id: 3, title: '篮球技巧·投篮训练', streamer: '灌篮高手', viewers: 2341, avatar: '🏀', cover: '#ff922b', category: '篮球', started: '09:00' },
  { id: 4, title: 'HIIT 高强度间歇训练', streamer: '魔鬼教练', viewers: 3456, avatar: '💪', cover: '#ef4444', category: '健身', started: '10:00' },
  { id: 5, title: '游泳技巧分解教学', streamer: '水中飞鱼', viewers: 678, avatar: '🏊', cover: '#22b8cf', category: '游泳', started: '14:00' },
  { id: 6, title: '骑行100公里挑战', streamer: '骑行天下', viewers: 1567, avatar: '🚴', cover: '#339af0', category: '骑行', started: '06:00' },
]

const CATEGORIES = ['全部', '跑步', '健身', '瑜伽', '篮球', '游泳', '骑行']

export default function LivePage() {
  const [selectedCat, setSelectedCat] = useState('全部')
  const [watching, setWatching] = useState(null)

  const filtered = selectedCat === '全部'
    ? MOCK_STREAMS
    : MOCK_STREAMS.filter(s => s.category === selectedCat)

  if (watching) {
    const stream = MOCK_STREAMS.find(s => s.id === watching)
    return (
      <div className="live-watching">
        <div className="live-player" style={{ background: `linear-gradient(135deg, ${stream.cover}, ${stream.cover}88)` }}>
          <div className="live-player-overlay">
            <span className="live-player-avatar">{stream.avatar}</span>
            <span className="live-badge">🔴 直播中</span>
          </div>
          <div className="live-player-info">
            <h3>{stream.title}</h3>
            <span>👁 {stream.viewers} 观看</span>
          </div>
          <button className="live-back-btn" onClick={() => setWatching(null)}>← 返回</button>
        </div>
        <div className="live-chat">
          <div className="chat-messages">
            {[
              { user: '用户A', msg: '教练好棒！' },
              { user: '用户B', msg: '跟练打卡 ✅' },
              { user: '用户C', msg: '今天第3天了' },
              { user: '用户D', msg: '动作好标准' },
              { user: '用户E', msg: '坚持💪' },
            ].map((c, i) => (
              <div key={i} className="chat-msg">
                <span className="chat-user">{c.user}</span>
                <span>{c.msg}</span>
              </div>
            ))}
          </div>
          <div className="chat-input-row">
            <input type="text" placeholder="说点什么..." />
            <button>发送</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="live-page">
      <div className="live-categories">
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={`live-cat-btn ${selectedCat === c ? 'active' : ''}`}
            onClick={() => setSelectedCat(c)}
          >{c}</button>
        ))}
      </div>

      <div className="live-grid">
        {filtered.map(stream => (
          <div key={stream.id} className="live-grid-card" onClick={() => setWatching(stream.id)}>
            <div className="live-grid-cover" style={{ background: `linear-gradient(135deg, ${stream.cover}, ${stream.cover}88)` }}>
              <span className="live-grid-avatar">{stream.avatar}</span>
              <span className="live-grid-tag">🔴 直播中</span>
              <span className="live-grid-viewers">👁 {stream.viewers}</span>
            </div>
            <div className="live-grid-info">
              <h4>{stream.title}</h4>
              <div className="live-grid-meta">
                <span>{stream.streamer}</span>
                <span>{stream.started} 开播</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="live-create-section">
        <h2>📹 我要开播</h2>
        <p className="live-create-hint">分享你的运动时刻，与大家一起运动！</p>
        <button className="live-create-btn">🔴 开始直播</button>
      </div>
    </div>
  )
}
