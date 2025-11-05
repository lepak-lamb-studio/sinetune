import { InitDials } from './Dial'
import { STAGE_CUSTOM, STAGE_RANDOM } from './StageId'
import { InitWaves, type Wave } from './Wave'

export type Goal = {
  waves: Wave[]
  dials?: string[]
  previewMul?: number
  previewAdd?: number
}

export const Goals: Goal[] = [
  {
    // Adjust a dial, offset
    dials: ['offset'],
    waves: [{ amp: 20, freq: 20, phase: 0, offset: 10 }],
  },
  {
    // Adjust two dials, offset and phase
    dials: ['offset', 'phase'],
    waves: [{ amp: 20, freq: 20, phase: 5, offset: 10 }],
  },
  {
    // All four dials, adjust two dials, amplitude and freq
    previewMul: 2,
    waves: [{ amp: 10, freq: 10, phase: 0, offset: 0 }],
  },
  {
    // Adjust four dials, negative offset
    previewMul: 2,
    waves: [{ amp: 15, freq: 12, phase: 9, offset: -6 }],
  },
  {
    // Zero amplitude
    waves: [{ amp: 0, freq: 10, phase: 0, offset: 5 }],
  },
  // Two waves: tutorial
  {
    // Offset
    waves: [
      { amp: 10, freq: 10, phase: 0, offset: 10 },
      { amp: 20, freq: 20, phase: 0, offset: 0 },
    ],
  },
  {
    // Phase
    waves: [
      { amp: 10, freq: 10, phase: 10, offset: 0 },
      { amp: 20, freq: 20, phase: 0, offset: 0 },
    ],
  },
  {
    // Amplitude and freq
    waves: [
      { amp: 4, freq: 4, phase: 0, offset: 0 },
      { amp: 20, freq: 20, phase: 0, offset: 0 },
    ],
  },
  {
    // Amplitude sum
    previewMul: 2,
    waves: [
      { amp: 10, freq: 20, phase: 0, offset: 19 },
      { amp: 0, freq: 10, phase: 0, offset: 19 },
    ],
  },
  {
    // Regular 1
    previewAdd: -10,
    previewMul: 2,
    waves: [
      { amp: 12, freq: 12, phase: 12, offset: 0 },
      { amp: 6, freq: 6, phase: 9, offset: 9 },
    ],
  },
  {
    // Regular 2
    previewMul: 2,
    waves: [
      { amp: 10, freq: 30, phase: 0, offset: 0 },
      { amp: 10, freq: 10, phase: 0, offset: 0 },
    ],
  },
  {
    // Not obvious: amplitude and phase
    waves: [
      { amp: 3, freq: 10, phase: 10, offset: 0 },
      { amp: 20, freq: 20, phase: 0, offset: 0 },
    ],
  },
  {
    // Not obvious: amplitude and phase 2
    waves: [
      { amp: 4, freq: 10, phase: 5, offset: 0 },
      { amp: 20, freq: 20, phase: 0, offset: 0 },
    ],
  },
  {
    // Not obvious: amplitude and freq
    waves: [
      { amp: 7, freq: 12, phase: 0, offset: 0 },
      { amp: 20, freq: 20, phase: 0, offset: 0 },
    ],
  },
  {
    // Not obvious: freq and phase
    waves: [
      { amp: 10, freq: 30, phase: 5, offset: 0 },
      { amp: 20, freq: 20, phase: 0, offset: 0 },
    ],
  },
]

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getRandomWave = () => {
  const wave = {} as Wave
  for (const [key, min, max] of [
    ['offset', -5, 5],
    ['phase', 0, 19],
    ['amp', 5, 20],
    ['freq', 5, 20],
  ] as [keyof Wave, number, number][]) {
    wave[key] = getRandomInt(min, max)
  }
  return wave
}

export const saveGoal = (waves: Wave[]) => {
  return btoa(JSON.stringify(waves))
}

export const loadGoal = (s: string): Goal | null => {
  try {
    const waves = JSON.parse(atob(s))
    for (const wave of waves) {
      for (const dial of InitDials) {
        const value = wave[dial.key]
        if (value === undefined) return null
        if (typeof value !== 'number' || !Number.isInteger(value)) return null
        if (value < dial.min || value > dial.max) return null
      }
    }

    return { waves: waves }
  } catch {
    return null
  }
}

export const getGoal = (stageId: number, customGoal: string) => {
  if (stageId === STAGE_RANDOM) {
    const waves = []
    for (let i = 0; i < InitWaves.length; ++i) {
      waves.push(getRandomWave())
    }
    return { waves: waves }
  }

  if (stageId === STAGE_CUSTOM) {
    return loadGoal(customGoal)
  }

  return Goals[stageId]
}
