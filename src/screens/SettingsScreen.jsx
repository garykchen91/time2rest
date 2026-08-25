import { playSound, SOUND_OPTIONS, VOLUME_OPTIONS } from '../lib/soundPlayer.js'

const SNOOZE_OPTIONS = [1, 3, 5, 10, 15]

export default function SettingsScreen({ settings, updateSettings, onBack }) {
  const version = '1.0.3'

  const handleSoundTypeChange = (v) => {
    updateSettings({ soundType: v })
    // 切換時自動試聽
    playSound(v, settings.soundVolume || 'medium')
  }

  const handleVolumeChange = (v) => {
    updateSettings({ soundVolume: v })
    // 切換時自動試聽
    playSound(settings.soundType || 'ding', v)
  }

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
        gap: '16px',
        marginBottom: '32px'
      }}>
        <button onClick={onBack} aria-label="Back" style={{ fontSize: '24px' }}>
          ←
        </button>
        <span style={{ fontSize: '17px', fontWeight: 500 }}>設定</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <ToggleRow
          title="音效"
          subtitle="動畫觸發時播放音效"
          value={settings.soundOn}
          onChange={(v) => updateSettings({ soundOn: v })}
        />
        <SelectRowGeneric
          title="音效類型"
          subtitle="切換時可試聽"
          value={settings.soundType || 'ding'}
          options={SOUND_OPTIONS}
          onChange={handleSoundTypeChange}
        />
        <SelectRowGeneric
          title="音量"
          subtitle="切換時可試聽"
          value={settings.soundVolume || 'medium'}
          options={VOLUME_OPTIONS}
          onChange={handleVolumeChange}
        />
        <ToggleRow
          title="循環模式"
          subtitle="休息完自動開始下一輪"
          value={settings.loopMode}
          onChange={(v) => updateSettings({ loopMode: v })}
        />
        <SelectRowNumber
          title="延遲時間"
          subtitle="按延遲後多久再提醒"
          value={settings.snoozeMinutes}
          options={SNOOZE_OPTIONS}
          onChange={(v) => updateSettings({ snoozeMinutes: v })}
          suffix="分鐘"
        />
      </div>

      <div style={{
        marginTop: 'auto',
        paddingTop: '32px',
        borderTop: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '15px',
          fontWeight: 500,
          color: 'var(--text-dark)',
          marginBottom: '4px'
        }}>
          Gent Ventures
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-medium)', marginBottom: '8px' }}>
          Time to Rest v{version}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>
          gentventures.com
        </p>
      </div>
    </div>
  )
}

function ToggleRow({ title, subtitle, value, onChange }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 12px',
      borderRadius: '8px'
    }}>
      <div>
        <p style={{ fontSize: '15px', color: 'var(--text-dark)' }}>{title}</p>
        <p style={{ fontSize: '12px', color: 'var(--text-medium)', marginTop: '2px' }}>{subtitle}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: '48px',
          height: '28px',
          background: value ? 'var(--primary)' : '#ccc',
          borderRadius: '14px',
          position: 'relative',
          transition: 'background 0.2s'
        }}
        aria-label={title}
      >
        <div style={{
          width: '22px',
          height: '22px',
          background: 'white',
          borderRadius: '50%',
          position: 'absolute',
          top: '3px',
          left: value ? '23px' : '3px',
          transition: 'left 0.2s'
        }} />
      </button>
    </div>
  )
}

function SelectRowGeneric({ title, subtitle, value, options, onChange }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 12px',
      borderRadius: '8px'
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '15px', color: 'var(--text-dark)' }}>{title}</p>
        <p style={{ fontSize: '12px', color: 'var(--text-medium)', marginTop: '2px' }}>{subtitle}</p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontSize: '14px',
          padding: '8px 12px',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          background: 'white',
          color: 'var(--text-dark)',
          fontFamily: 'inherit'
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function SelectRowNumber({ title, subtitle, value, options, onChange, suffix }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 12px',
      borderRadius: '8px'
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '15px', color: 'var(--text-dark)' }}>{title}</p>
        <p style={{ fontSize: '12px', color: 'var(--text-medium)', marginTop: '2px' }}>{subtitle}</p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          fontSize: '14px',
          padding: '8px 12px',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          background: 'white',
          color: 'var(--text-dark)',
          fontFamily: 'inherit'
        }}
      >
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt} {suffix}
          </option>
        ))}
      </select>
    </div>
  )
}
