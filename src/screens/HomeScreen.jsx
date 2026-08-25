import { useState, useEffect, useRef } from 'react'

const TIME_OPTIONS = [5, 10, 15, 25, 30, 45, 60]

export default function HomeScreen({ settings, updateSettings, onTimeUp, onOpenSettings }) {
  const [isRunning, setIsRunning] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(settings.timerMinutes * 60)
  const intervalRef = useRef(null)

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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px'
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

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{
          fontSize: '13px',
          color: isRunning ? 'var(--primary)' : 'var(--text-medium)',
          letterSpacing: '2px',
          marginBottom: '16px',
          fontWeight: isRunning ? 500 : 400
        }}>
          {isRunning ? '倒數中' : '提醒間隔'}
        </p>
        <p style={{
          fontSize: '84px',
          fontWeight: 500,
          color: isRunning ? 'var(--primary)' : 'var(--text-dark)',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums'
        }}>
          {formatTime(remainingSeconds)}
        </p>
        {isRunning && (
          <p style={{
            fontSize: '14px',
            color: 'var(--text-medium)',
            marginTop: '16px'
          }}>
            距離下次休息
          </p>
        )}
      </div>

      {isRunning && (
        <div style={{
          margin: '32px 8px 0',
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

      {!isRunning && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '8px',
          margin: '40px 0 0'
        }}>
          {TIME_OPTIONS.map(min => (
            <button
              key={min}
              onClick={() => handleSelectTime(min)}
              style={{
                fontSize: '14px',
                padding: '10px 16px',
                borderRadius: '20px',
                background: settings.timerMinutes === min ? 'var(--primary-pale)' : 'var(--bg-soft)',
                color: settings.timerMinutes === min ? 'var(--primary-dark)' : 'var(--text-medium)',
                fontWeight: settings.timerMinutes === min ? 500 : 400
              }}
            >
              {min} 分鐘
            </button>
          ))}
        </div>
      )}

      <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
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
