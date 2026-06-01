import { useState, lazy, Suspense } from 'react'
import { useWorkouts } from './hooks/useWorkouts'
import { useCommunity } from './hooks/useCommunity'
import HomePage from './components/HomePage'
import BottomNav from './components/BottomNav'

const LivePage = lazy(() => import('./components/LivePage'))
const ShopPage = lazy(() => import('./components/ShopPage'))
const MessagesPage = lazy(() => import('./components/MessagesPage'))
const CheckIn = lazy(() => import('./components/CheckIn'))
const Calendar = lazy(() => import('./components/Calendar'))
const Stats = lazy(() => import('./components/Stats'))
const History = lazy(() => import('./components/History'))
const WeeklyChart = lazy(() => import('./components/WeeklyChart'))
const TypeStats = lazy(() => import('./components/TypeStats'))
const GoalSetting = lazy(() => import('./components/GoalSetting'))
const Profile = lazy(() => import('./components/Profile'))
const PostFeed = lazy(() => import('./components/PostFeed'))
const CreatePost = lazy(() => import('./components/CreatePost'))
const KnowledgeBase = lazy(() => import('./components/KnowledgeBase'))
const LinkCollection = lazy(() => import('./components/LinkCollection'))

const TITLES = {
  home: '🐟 吃鱼',
  live: '📺 直播',
  community: '🌐 社区',
  shop: '🛒 商城',
  messages: '💬 消息',
  checkin: '🎯 打卡',
  knowledge: '📚 知识库',
  stats: '📊 统计',
  profile: '👤 我的',
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [communitySubTab, setCommunitySubTab] = useState('feed')
  const hook = useWorkouts()
  const comm = useCommunity()

  const navigate = (tab) => setActiveTab(tab)

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={navigate} />
      case 'live':
        return <LivePage />
      case 'community':
        return (
          <>
            <div className="sub-tabs">
              <button className={communitySubTab === 'feed' ? 'active' : ''} onClick={() => setCommunitySubTab('feed')}>💬 动态</button>
              <button className={communitySubTab === 'knowledge' ? 'active' : ''} onClick={() => setCommunitySubTab('knowledge')}>📚 知识</button>
              <button className={communitySubTab === 'links' ? 'active' : ''} onClick={() => setCommunitySubTab('links')}>🔗 链接</button>
            </div>
            {communitySubTab === 'feed' && (
              <>
                <PostFeed
                  posts={comm.posts}
                  categories={comm.categories}
                  onLike={comm.toggleLike}
                  onDelete={comm.deletePost}
                  onComment={comm.addComment}
                  userId={comm.userId}
                />
                <button className="fab" onClick={() => setShowCreatePost(true)}>+</button>
              </>
            )}
            {communitySubTab === 'knowledge' && (
              <KnowledgeBase
                knowledge={comm.knowledge}
                categories={comm.categories}
                onAdd={comm.addKnowledge}
                onDelete={comm.deleteKnowledge}
                onUpdate={comm.updateKnowledge}
              />
            )}
            {communitySubTab === 'links' && (
              <LinkCollection
                links={comm.links}
                categories={comm.categories}
                onAdd={comm.addLink}
                onDelete={comm.deleteLink}
              />
            )}
          </>
        )
      case 'shop':
        return <ShopPage />
      case 'messages':
        return <MessagesPage />
      case 'checkin':
        return (
          <>
            <Stats
              streak={hook.streak}
              monthCheckins={hook.monthCheckins}
              totalDuration={hook.totalDuration}
              totalRecords={hook.records.length}
            />
            <CheckIn
              exerciseTypes={hook.exerciseTypes}
              onAdd={hook.addRecord}
              isCheckedInToday={hook.isCheckedInToday}
            />
            <WeeklyChart weekStats={hook.getWeekStats()} goals={hook.goals} />
            <History
              records={hook.getRecentRecords(10)}
              exerciseTypes={hook.exerciseTypes}
              onDelete={hook.deleteRecord}
            />
          </>
        )
      case 'stats':
        return (
          <>
            <WeeklyChart weekStats={hook.getWeekStats()} goals={hook.goals} />
            <TypeStats typeStats={hook.getTypeStats()} />
            <Calendar getMonthDates={hook.getMonthDates} />
            <GoalSetting goals={hook.goals} onSave={hook.setGoals} />
          </>
        )
      case 'profile':
        return (
          <Profile
            theme={hook.theme}
            setTheme={hook.setTheme}
            totalDuration={hook.totalDuration}
            records={hook.records}
            streak={hook.streak}
            exerciseTypes={hook.exerciseTypes}
            userName={comm.userName}
            setUserName={comm.setUserName}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <h1>{TITLES[activeTab] || '🐟 吃鱼'}</h1>
          <div className="header-actions">
            <button className="header-btn" onClick={() => navigate('profile')}>👤</button>
            <button className="header-btn" onClick={() => navigate('stats')}>📊</button>
            <button className="header-btn" onClick={() => navigate('checkin')}>🎯</button>
          </div>
        </div>
      </header>
      <main className="app-main">
        <Suspense fallback={<div style={{textAlign:'center',padding:'40px',color:'var(--text-secondary)'}}>加载中...</div>}>
          {renderContent()}
        </Suspense>
      </main>
      {showCreatePost && (
        <CreatePost
          categories={comm.categories}
          onSubmit={comm.addPost}
          onClose={() => setShowCreatePost(false)}
        />
      )}
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
