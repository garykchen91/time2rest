import { useState, useEffect, useRef } from 'react'

const TIME_OPTIONS = [5, 10, 15, 25, 30, 45, 60]
const MIN_CUSTOM_MINUTES = 3
const MAX_CUSTOM_MINUTES = 300

export default function HomeScreen({ settings, updateSettings, onTimeUp, onOpenSettings }) {
  const [isRunning, setIsRunning] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(settings.timerMinutes * 60)
  const intervalRef = useRef(null)

  const isCustomTime = !TIME_OPTIONS.includes(settings.timerMinutes)

  useEffect(() => {
    if (!isRunning) {
      setRemainingSeconds(settings.timerMinutes * 60)
    }
  }, [settings.timerMinutes, isRunning])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            onTimeUp()
            return settings.timerMinutes * 60
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  const handleStart = () => {
    setRemainingSeconds(settings.timerMinutes * 60)
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
    setRemainingSeconds(settings.timerMinutes * 60)
  }

  const handleSelectTime = (minutes) => {
    if (isRunning) return
    updateSettings({ timerMinutes: minutes })
  }

  const handleCustomTime = () => {
    if (isRunning) return
    const currentValue = isCustomTime ? settings.timerMinutes : ''
    const input = window.prompt(
      `請輸入自訂提醒間隔 (${MIN_CUSTOM_MINUTES} 到 ${MAX_CUSTOM_MINUTES} 分鐘)`,
      currentValue
    )
    if (input === null) return
    const num = Number(input.trim())
    if (!Number.isFinite(num) || !Number.isInteger(num) || num < MIN_CUSTOM_MINUTES || num > MAX_CUSTOM_MINUTES) {
      window.alert(`請輸入 ${MIN_CUSTOM_MINUTES} 到 ${MAX_CUSTOM_MINUTES} 之間的整數`)
      return
    }
    updateSettings({ timerMinutes: num })
  }

  const toggleSound = () => {
    updateSettings({ soundOn: !settings.soundOn })
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const progress = isRunning
    ? ((settings.timerMinutes * 60 - remainingSeconds) / (settings.timerMinutes * 60)) * 100
    : 0

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 24px',
      minHeight: '100dvh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <span style={{ fontSize: '17px', fontWeight: 500 }}>Time to Rest</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button onClick={toggleSound} aria-label="Sound">
            <span style={{ fontSize: '22px' }}>{settings.soundOn ? '🔊' : '🔇'}</span>
          </button>
          <button onClick={onOpenSettings} aria-label="Settings">
            <span style={{ fontSize: '22px' }}>⚙️</span>
          </button>
        </div>
      </div>

      {/* 動畫區 - 用 flex: 1 自動吃掉剩餘空間 */}
      <PlaceholderAnimationArea />

      {/* 時間顯示 */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <p style={{
          fontSize: '13px',
          color: isRunning ? 'var(--primary)' : 'var(--text-medium)',
          letterSpacing: '2px',
          marginBottom: '6px',
          fontWeight: isRunning ? 500 : 400
        }}>
          {isRunning ? '倒數中' : '提醒間隔'}
        </p>
        <p style={{
          fontSize: '56px',
          fontWeight: 500,
          color: isRunning ? 'var(--primary)' : 'var(--text-dark)',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums'
        }}>
          {formatTime(remainingSeconds)}
        </p>
        {isRunning && (
          <p style={{
            fontSize: '13px',
            color: 'var(--text-medium)',
            marginTop: '8px'
          }}>
            距離下次休息
          </p>
        )}
      </div>

      {/* 進度條 (倒數中) */}
      {isRunning && (
        <div style={{
          margin: '16px 8px 0',
          height: '6px',
          background: 'var(--bg-soft)',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'var(--primary)',
            transition: 'width 1s linear'
          }} />
        </div>
      )}

      {/* 時間選項按鈕 (未啟動時顯示) */}
      {!isRunning && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '6px',
          margin: '16px 0 0'
        }}>
          {TIME_OPTIONS.map(min => (
            <button
              key={min}
              onClick={() => handleSelectTime(min)}
              style={{
                fontSize: '13px',
                padding: '8px 14px',
                borderRadius: '18px',
                background: settings.timerMinutes === min ? 'var(--primary-pale)' : 'var(--bg-soft)',
                color: settings.timerMinutes === min ? 'var(--primary-dark)' : 'var(--text-medium)',
                fontWeight: settings.timerMinutes === min ? 500 : 400
              }}
            >
              {min} 分鐘
            </button>
          ))}
          <button
            onClick={handleCustomTime}
            style={{
              fontSize: '13px',
              padding: '8px 14px',
              borderRadius: '18px',
              background: isCustomTime ? 'var(--primary-pale)' : 'var(--bg-soft)',
              color: isCustomTime ? 'var(--primary-dark)' : 'var(--text-medium)',
              fontWeight: isCustomTime ? 500 : 400
            }}
          >
            {isCustomTime ? `⚙ ${settings.timerMinutes} 分鐘` : '⚙ 自訂'}
          </button>
        </div>
      )}

      {/* 開始/停止 按鈕 */}
      <div style={{ paddingTop: '20px' }}>
        {!isRunning ? (
          <button
            onClick={handleStart}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '14px',
              background: 'var(--primary)',
              color: 'white',
              fontSize: '17px',
              fontWeight: 500
            }}
          >
            ▶ 開始
          </button>
        ) : (
          <button
            onClick={handleStop}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '14px',
              background: 'white',
              border: '1px solid var(--border)',
              color: 'var(--text-dark)',
              fontSize: '17px',
              fontWeight: 500
            }}
          >
            ■ 停止
          </button>
        )}
        {settings.loopMode && !isRunning && (
          <p style={{
            fontSize: '12px',
            color: 'var(--text-light)',
            textAlign: 'center',
            marginTop: '12px'
          }}>
            循環模式已啟用
          </p>
        )}
      </div>
    </div>
  )
}

// 動畫區 佔位 - flex:1 自動吃剩餘空間
function PlaceholderAnimationArea() {
  return (
    <>
      <style>{`
        @keyframes dog-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        .dog-idle {
          animation: dog-breathe 3s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
      <div style={{
        flex: 1,
        minHeight: '260px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-soft)',
        borderRadius: '16px'
      }}>
        <div className="dog-idle">
          <svg width="200" height="170" viewBox="0 0 200 160">
            <ellipse cx="100" cy="130" rx="80" ry="22" fill="#E88E3A"/>
            <ellipse cx="100" cy="130" rx="60" ry="14" fill="#FBE5C4"/>
            <ellipse cx="55" cy="120" rx="18" ry="10" fill="#D97A28"/>
            <circle cx="150" cy="110" r="32" fill="#E88E3A"/>
            <ellipse cx="152" cy="120" rx="15" ry="12" fill="#FBE5C4"/>
            <path d="M 130 82 L 120 62 Q 128 68 138 82 Z" fill="#D97A28"/>
            <path d="M 172 82 L 182 62 Q 174 68 164 82 Z" fill="#D97A28"/>
            <path d="M 138 108 Q 143 106 148 108" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M 155 108 Q 160 106 165 108" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <ellipse cx="152" cy="120" rx="3" ry="2.5" fill="#1a1a1a"/>
          </svg>
        </div>
      </div>
    </>
  )
}
