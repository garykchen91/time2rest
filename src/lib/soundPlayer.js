// 音效播放器 - 用 Web Audio API 產生電子音
// 未來 v1.2 會加入 mp3 檔案支援

const VOLUME_MAP = {
  large: 0.9,
  medium: 0.6,
  small: 0.3
}

// 音效定義:每個是一組音符 [frequency, duration] 陣列
const SOUND_TYPES = {
  ding: {
    notes: [
      { freq: 1200, duration: 0.25 },
      { freq: 1200, duration: 0.25 },
      { freq: 1200, duration: 0.4 }
    ],
    gap: 0.15,
    type: 'sine'
  },
  beep: {
    notes: [
      { freq: 660, duration: 0.3 },
      { freq: 660, duration: 0.3 },
      { freq: 660, duration: 0.5 }
    ],
    gap: 0.15,
    type: 'square'
  },
  chime: {
    notes: [
      { freq: 523, duration: 0.3 },  // C5
      { freq: 659, duration: 0.3 },  // E5
      { freq: 784, duration: 0.6 }   // G5
    ],
    gap: 0.05,
    type: 'triangle'
  }
}

export function playSound(soundType = 'ding', volume = 'medium') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return

    const ctx = new AudioContext()
    const sound = SOUND_TYPES[soundType] || SOUND_TYPES.ding
    const volumeLevel = VOLUME_MAP[volume] || VOLUME_MAP.medium

    let currentTime = ctx.currentTime

    sound.notes.forEach((note) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = sound.type
      osc.frequency.value = note.freq

      // 音量包絡: 快速起音 -> 保持 -> 淡出
      gain.gain.setValueAtTime(0, currentTime)
      gain.gain.linearRampToValueAtTime(volumeLevel, currentTime + 0.02)
      gain.gain.setValueAtTime(volumeLevel, currentTime + note.duration - 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(currentTime)
      osc.stop(currentTime + note.duration)

      currentTime += note.duration + sound.gap
    })
  } catch (e) {
    // silent fail
  }
}

export const SOUND_OPTIONS = [
  { value: 'ding', label: '叮叮' },
  { value: 'beep', label: '嗶嗶' },
  { value: 'chime', label: '登登' }
]

export const VOLUME_OPTIONS = [
  { value: 'large', label: '大' },
  { value: 'medium', label: '中' },
  { value: 'small', label: '小' }
]
