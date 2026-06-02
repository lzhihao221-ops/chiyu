import { useState } from 'react'
import './MessagesPage.css'

const MOCK_CONVERSATIONS = [
  { id: 1, name: '健身小王', avatar: '🏃', lastMsg: '明天一起晨跑吗？', time: '刚刚', unread: 2 },
  { id: 2, name: '瑜伽Lily', avatar: '🧘', lastMsg: '今天的课程很棒！', time: '10分钟前', unread: 0 },
  { id: 3, name: '运动装备群', avatar: '👥', lastMsg: '推荐一款好用的筋膜枪', time: '1小时前', unread: 5 },
  { id: 4, name: '系统通知', avatar: '🔔', lastMsg: '恭喜获得连续打卡7天徽章！', time: '2小时前', unread: 1 },
  { id: 5, name: '营养师小李', avatar: '🥗', lastMsg: '减脂餐食谱已经发给你了', time: '昨天', unread: 0 },
]

const MOCK_SYSTEM = [
  { id: 1, title: '🏆 恭喜！获得「连续7天打卡」成就', time: '2小时前' },
  { id: 2, title: '📺 你关注的「健身小王」开播了', time: '3小时前' },
  { id: 3, title: '💬 「瑜伽入门教学」有新评论', time: '昨天' },
  { id: 4, title: '🛒 你收藏的商品降价了', time: '昨天' },
]

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <div className="messages-page">
      <div className="msg-tabs">
        <button className={activeTab === 'chat' ? 'active' : ''} onClick={() => setActiveTab('chat')}>
          💬 私信
          {MOCK_CONVERSATIONS.reduce((s, c) => s + c.unread, 0) > 0 && (
            <span className="msg-badge">{MOCK_CONVERSATIONS.reduce((s, c) => s + c.unread, 0)}</span>
          )}
        </button>
        <button className={activeTab === 'notify' ? 'active' : ''} onClick={() => setActiveTab('notify')}>
          🔔 通知
          <span className="msg-badge">2</span>
        </button>
        <button className={activeTab === '互动' ? 'active' : ''} onClick={() => setActiveTab('互动')}>
          ❤️ 互动
        </button>
      </div>

      {activeTab === 'chat' && (
        <div className="conversations-list">
          {MOCK_CONVERSATIONS.map(c => (
            <div key={c.id} className="conversation-item">
              <div className="conv-avatar">{c.avatar}</div>
              <div className="conv-info">
                <div className="conv-header">
                  <span className="conv-name">{c.name}</span>
                  <span className="conv-time">{c.time}</span>
                </div>
                <p className="conv-last-msg">{c.lastMsg}</p>
              </div>
              {c.unread > 0 && <span className="conv-unread">{c.unread}</span>}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'notify' && (
        <div className="notifications-list">
          {MOCK_SYSTEM.map(n => (
            <div key={n.id} className="notification-item">
              <span className="notif-content">{n.title}</span>
              <span className="notif-time">{n.time}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === '互动' && (
        <div className="interactions-list">
          <div className="interaction-item">
            <span className="inter-avatar">❤️</span>
            <div className="inter-info">
              <span><strong>用户A</strong> 赞了你的帖子「30天腹肌挑战」</span>
              <span className="inter-time">1小时前</span>
            </div>
          </div>
          <div className="interaction-item">
            <span className="inter-avatar">💬</span>
            <div className="inter-info">
              <span><strong>用户B</strong> 评论了你的打卡：太厉害了！</span>
              <span className="inter-time">2小时前</span>
            </div>
          </div>
          <div className="interaction-item">
            <span className="inter-avatar">👥</span>
            <div className="inter-info">
              <span><strong>用户C</strong> 关注了你</span>
              <span className="inter-time">昨天</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
