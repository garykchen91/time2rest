import { useState, useEffect } from 'react'
import HomeScreen from './screens/HomeScreen.jsx'
import ReminderScreen from './screens/ReminderScreen.jsx'
import SettingsScreen from './screens/SettingsScreen.jsx'

const DEFAULT_SETTINGS = {
  soundOn: true,
  loopMode: true,
  snoozeMinutes: 5,
  timerMinutes: 25
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  useEffect(() => {
    const saved = localStorage.getItem('time2rest_settings')
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) })
      } catch (e) {
        console.warn('Failed to load settings')
      }
    }
  }, [])

  const updateSettings = (newSettings) => {
    const merged = { ...settings, ...newSettings }
    setSettings(merged)
    localStorage.setItem('time2rest_settings', JSON.stringify(merged))
  }

  if (screen === 'reminder') {
    return (
      <ReminderScreen
        settings={settings}
        onEnd={() => setScreen('home')}
        onSnooze={() => setScreen('home')}
      />
    )
  }

  if (screen === 'settings') {
    return (
      <SettingsScreen
        settings={settings}
        updateSettings={updateSettings}
        onBack={() => setScreen('home')}
      />
    )
  }

  return (
    <HomeScreen
      settings={settings}
      updateSettings={updateSettings}
      onTimeUp={() => setScreen('reminder')}
      onOpenSettings={() => setScreen('settings')}
    />
  )
}
