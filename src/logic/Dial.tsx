import { type Wave } from './Wave'

export type Dial = {
  key: keyof Wave
  min: number
  max: number
  step: number
  offset: number
  symbol: string
}

export const InitDials: Dial[] = [
  { key: 'offset', min: -20, max: 19, step: 1, offset: 180, symbol: '\u{2191}\u{FE0E}' },
  { key: 'phase', min: 0, max: 19, step: 1, offset: 0, symbol: '\u{2192}\u{FE0E}' },
  { key: 'amp', min: 0, max: 39, step: 1, offset: 0, symbol: '\u{2195}\u{FE0E}' },
  { key: 'freq', min: 0, max: 39, step: 1, offset: 0, symbol: '\u{2194}\u{FE0E}' },
]

// InitDialColors.length === InitWaves.length
// InitDialColors[*].length === 2
// InitDialColors[*][*].length === InitDials.length
export const InitDialColors: string[][][] = [
  [
    ['#ff4444', '#ff4444', '#ff4444', '#ff4444'],
    ['#ff0000', '#ff0000', '#ff0000', '#ff0000'],
  ],
  [
    ['#4444ff', '#4444ff', '#4444ff', '#4444ff'],
    ['#0000ff', '#0000ff', '#0000ff', '#0000ff'],
  ],
]
