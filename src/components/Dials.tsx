import { useState } from 'react'
import { HighContrast } from 'react-dial-knob'
import { useWindowSize } from 'react-use'
import { InitDials } from '../logic/Dial'
import type { Goal } from '../logic/Goal'
import { WaveKeys, type Wave } from '../logic/Wave'

type DialsProps = {
  wave: Wave
  setWave: (newWave: Wave) => void
  dialColors: string[][]
  goal: Goal
  hint: boolean
}

const Dials = ({ wave, setWave, dialColors, goal, hint }: DialsProps) => {
  const [moved, setMoved] = useState(false)
  const { width, height } = useWindowSize()
  const diameter = Math.min(width, height) / 7
  const dials = goal.dials || WaveKeys

  return (
    <>
      {InitDials.filter((d) => dials.includes(d.key)).map((d, i) => (
        <div className={`dial ${hint && !moved ? 'dial-hint' : ''}`} key={d.key}>
          <HighContrast
            min={d.min}
            max={d.max}
            step={d.step}
            offsetAngle={d.offset}
            value={wave[d.key]}
            onValueChange={(value) => {
              setMoved(true)
              setWave({ ...wave, [d.key]: value })
            }}
            displayValue={(value, interacting) => (interacting ? value.toString() : d.symbol)}
            diameter={diameter}
            theme={{
              defaultColor: dialColors[0][i],
              activeColor: dialColors[1][i],
            }}
          />
        </div>
      ))}
    </>
  )
}

export default Dials
