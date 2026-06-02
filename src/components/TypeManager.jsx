import { useState } from 'react'

const EMOJI_OPTIONS = ['🏃','🚶','🚴','🏊','🧘','💪','🏀','🏸','⚡','🎯','🤸','🤾','🏋️','⛷️','🏄','🪂','🧗','🏒','🎾','⚽','🥊','🛹','🪁','🏄‍♀️','🤺']
const COLOR_OPTIONS = ['#ff6b6b','#51cf66','#339af0','#22b8cf','#cc5de8','#ff922b','#f76707','#20c997','#fcc419','#868e96','#e64980','#7950f2','#15aabf','#fab005']

export default function TypeManager({ exerciseTypes, customTypes, onAdd, onDelete, onClose }) {
  const [tab, setTab] = useState('list')
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🎯')
  const [color, setColor] = useState('#868e96')

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd(name.trim(), icon, color)
    setName('')
    setIcon('🎯')
    setColor('#868e96')
    setTab('list')
  }

  return (
    <div className="create-overlay">
      <div className="create-modal" style={{ maxHeight: '80vh', overflow: 'auto' }}>
        <div className="create-header">
          <button className="create-close" onClick={onClose}>关闭</button>
          <h3>运动类型管理</h3>
          {tab === 'list' ? (
            <button className="create-submit" onClick={() => setTab('add')}>+ 添加</button>
          ) : (
            <button className="create-submit" onClick={() => setTab('list')}>返回</button>
          )}
        </div>

        {tab === 'list' ? (
          <div style={{ padding: '12px 0' }}>
            {exerciseTypes.map(t => (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 24 }}>{t.icon}</span>
                <span style={{ flex: 1, fontSize: 15 }}>{t.name}</span>
                <span style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: t.color, display: 'inline-block',
                }} />
                {t.builtin ? (
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>内置</span>
                ) : (
                  <button
                    onClick={() => onDelete(t.id)}
                    style={{
                      background: 'none', border: 'none', color: '#ff4757',
                      cursor: 'pointer', fontSize: 13, padding: '4px 8px',
                    }}
                  >删除</button>
                )}
              </div>
            ))}
            {exerciseTypes.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 20 }}>
                暂无运动类型
              </p>
            )}
          </div>
        ) : (
          <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
                运动名称
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="如：攀岩、滑板..."
                maxLength={10}
                style={{
                  width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)',
                  borderRadius: 8, fontSize: 15, background: 'var(--bg)', color: 'var(--text)',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
                选择图标
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {EMOJI_OPTIONS.map(e => (
                  <button
                    key={e}
                    onClick={() => setIcon(e)}
                    style={{
                      fontSize: 22, width: 38, height: 38,
                      border: icon === e ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                      borderRadius: 8, background: icon === e ? 'var(--primary-light)' : 'var(--card)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >{e}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
                选择颜色
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: c, cursor: 'pointer',
                      border: color === c ? '3px solid var(--text)' : '2px solid transparent',
                      outline: color === c ? '2px solid var(--primary)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{
              background: 'var(--bg)', borderRadius: 12, padding: 16,
              textAlign: 'center', marginBottom: 16,
            }}>
              <span style={{ fontSize: 36 }}>{icon}</span>
              <p style={{ fontWeight: 600, marginTop: 4 }}>{name || '预览'}</p>
            </div>

            <button
              onClick={handleAdd}
              disabled={!name.trim()}
              style={{
                width: '100%', padding: 12, borderRadius: 10,
                background: name.trim() ? 'var(--primary)' : 'var(--border)',
                color: 'white', border: 'none', fontSize: 15, fontWeight: 600,
                cursor: name.trim() ? 'pointer' : 'not-allowed',
              }}
            >添加「{name || '...'}」</button>
          </div>
        )}
      </div>
    </div>
  )
}
