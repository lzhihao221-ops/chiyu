import { useState, lazy, Suspense } from 'react'
import { useAuth } from './hooks/useAuth'
import { useWorkouts } from './hooks/useWorkouts'
import { useCommunity } from './hooks/useCommunity'
import { useTreeHole } from './hooks/useTreeHole'
import HomePage from './components/HomePage'
import BottomNav from './components/BottomNav'
import AuthPage from './components/AuthPage'

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
const TreeHolePage = lazy(() => import('./components/TreeHolePage'))
const CreateTreeHole = lazy(() => import('./components/CreateTreeHole'))
const TypeManager = lazy(() => import('./components/TypeManager'))

const TITLES = {
  home: '🐟 吃鱼',
  treehole: '🕳️ 树洞',
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
  const auth = useAuth()
  const [activeTab, setActiveTab] = useState('home')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showCreateHole, setShowCreateHole] = useState(false)
  const [showTypeManager, setShowTypeManager] = useState(false)
  const [communitySubTab, setCommunitySubTab] = useState('feed')
  const hook = useWorkouts(auth.user, auth.useCloud)
  const comm = useCommunity(auth.user, auth.useCloud)
  const tree = useTreeHole(auth.user, auth.useCloud)

  const navigate = (tab) => setActiveTab(tab)

  if (auth.loading) {
    return <div style={{ textAlign: 'center', paddingTop: '40vh', color: 'var(--text-secondary)' }}>加载中...</div>
  }

  if (!auth.isLoggedIn) {
    return <AuthPage onAuth={auth.handleAuth} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={navigate} />
      case 'treehole':
        return (
          <>
            <TreeHolePage
              holes={tree.holes}
              categories={tree.categories}
              reactions={tree.reactions}
              onDelete={tree.deleteHole}
              onReaction={tree.addReaction}
              onComment={tree.addComment}
              userId={auth.user?.id}
              onCreate={() => setShowCreateHole(true)}
            />
          </>
        )
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
            isGuest={auth.isGuest}
            useCloud={auth.useCloud}
            onLogout={auth.logout}
            profile={auth.profile}
            onManageTypes={() => setShowTypeManager(true)}
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
            {auth.useCloud && <span className="header-cloud">☁️</span>}
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
      <Suspense fallback={null}>
        {showCreatePost && (
          <CreatePost
            categories={comm.categories}
            onSubmit={comm.addPost}
            onClose={() => setShowCreatePost(false)}
            useCloud={auth.useCloud}
          />
        )}
        {showCreateHole && (
          <CreateTreeHole
            categories={tree.categories}
            onSubmit={tree.addHole}
            onClose={() => setShowCreateHole(false)}
            useCloud={auth.useCloud}
          />
        )}
        {showTypeManager && (
          <TypeManager
            exerciseTypes={hook.exerciseTypes}
            customTypes={hook.customTypes}
            onAdd={hook.addExerciseType}
            onDelete={hook.deleteExerciseType}
            onClose={() => setShowTypeManager(false)}
          />
        )}
      </Suspense>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
