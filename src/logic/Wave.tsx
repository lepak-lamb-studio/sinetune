export type Wave = {
  amp: number
  freq: number
  phase: number
  offset: number
}

export const WaveKeys: (keyof Wave)[] = ['amp', 'freq', 'phase', 'offset']

export const InitWaves: Wave[] = [
  { amp: 20, freq: 20, phase: 0, offset: 0 },
  { amp: 10, freq: 10, phase: 0, offset: 0 },
]

// InitWaveColors.length === InitWaves.length
// InitDialColors[*].length === 2
export const InitWaveColors: string[][] = [
  ['#ff0000', '#ff4444'],
  ['#0000ff', '#4444ff'],
]

// SumWaveColors.length === InitWaves.length - 1
export const SumWaveColors: string[] = ['#ff00ff']

export const GoalWaveColor: string = 'gold'
export const SubGoalWaveColor: string = 'green'
