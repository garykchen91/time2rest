import { useEffect } from 'react'

export default function ReminderScreen({ settings, onEnd, onSnooze }) {
  useEffect(() => {
    if (settings.soundOn) {
      playPlaceholderSound()
    }
  }, [])

  const playPlaceholderSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 660
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start()
      osc.stop(ctx.currentTime + 0.5)
    } catch (e) {
      // silent fail
    }
  }

  const handleSnooze = () => {
    onSnooze()
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 20px',
      background: 'var(--primary-dark)',
      minHeight: '100dvh',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{
          fontSize: '13px',
          color: 'var(--primary-mute)',
          letterSpacing: '2px',
          marginBottom: '10px'
        }}>
          時間到了
        </p>
        <p style={{ fontSize: '26px', fontWeight: 500 }}>該休息一下囉</p>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <PlaceholderAnimation />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={onEnd}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: '14px',
            background: 'white',
            color: 'var(--primary-dark)',
            fontSize: '17px',
            fontWeight: 500
          }}
        >
          ✓ 結束
        </button>
        <button
          onClick={handleSnooze}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: '14px',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.4)',
            color: 'white',
            fontSize: '17px',
            fontWeight: 500
          }}
        >
          🕐 延遲 {settings.snoozeMinutes} 分鐘
        </button>
      </div>
    </div>
  )
}

function PlaceholderAnimation() {
  return (
    <>
      <style>{`
        @keyframes placeholder-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .placeholder-anim {
          animation: placeholder-pulse 1.5s ease-in-out infinite;
        }
      `}</style>
      <div
        className="placeholder-anim"
        style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '80px'
        }}
      >
        🐶
      </div>
    </>
  )
}
