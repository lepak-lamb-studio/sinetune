import { useEffect, useState } from 'react'
import { InitDialColors } from '../logic/Dial'
import { type Goal } from '../logic/Goal'
import { getNextStageId, STAGE_CUSTOM, STAGE_RANDOM, STAGE_SELECTOR } from '../logic/StageId'
import { InitWaves, type Wave } from '../logic/Wave'
import Canvas from './Canvas'
import Dials from './Dials'

type StageProps = {
  goal: Goal
  stageId: number
  setStageId: (stageId: number) => void
  cleared: Record<number, boolean>
  setCleared: () => void
}

const Stage = ({ goal, stageId, setStageId, cleared, setCleared }: StageProps) => {
  const [waves, setWaves] = useState<Wave[]>(InitWaves.slice(0, goal.waves.length))
  const [help, setHelp] = useState(0)

  const getStageName = () => {
    if (stageId === STAGE_RANDOM) return 'Random'
    if (stageId === STAGE_CUSTOM) return 'Custom'
    return `#${stageId + 1}`
  }

  const setWave = (i: number, newWave: Wave) => {
    setWaves((prev) => {
      const copy = [...prev]
      copy[i] = newWave
      return copy
    })
  }

  /*
  const copyButton = (copyWaves: Wave[], label: string, color: string) => {
    return (
      <button
        className='btn-header'
        onClick={async () => {
          await navigator.clipboard.writeText(saveGoal(copyWaves))
          alert('Copied to clipboard!\nFeel free to share it with your friends!')
        }}
        style={{ color: color }}
      >
        {label}
      </button>
    )
  }

  const copyWaveColor = waves.length >= 2 ? SumWaveColors[waves.length - 2] : InitWaveColors[0][0]
  */

  useEffect(() => {
    console.log(
      "Give up? Here's the answer: ",
      JSON.stringify(goal.waves.map((wave) => [wave.offset, wave.phase, wave.amp, wave.freq])),
    )
  }, [goal])

  return (
    <>
      <div className='header'>
        <div className='header-left'>
          <button
            className='btn-header'
            onClick={() => {
              setStageId(STAGE_SELECTOR)
            }}
          >
            &lt;
          </button>
          <h1>{`\u{222b}inetune ${getStageName()}`}</h1>
          {cleared[stageId] && (
            <button
              className='btn-header pulse'
              onClick={() => {
                setStageId(getNextStageId(stageId, cleared))
              }}
            >
              &gt;
            </button>
          )}
        </div>
        {waves.length >= 2 && (
          <div className='header-right'>
            {/*
            {copyButton(waves, `Copy Mine \u{1F4CB}`, copyWaveColor)}
            {copyButton(goal.waves, `Copy Goal \u{1F4CB}`, GoalWaveColor)}
            */}
            <button
              className={`btn-header ${help >= 1 ? 'depressed' : ''}`}
              onClick={() => setHelp((help) => +(help < 1) - help)}
            >
              {`Hint \u{1F64F}`}
            </button>
          </div>
        )}
      </div>
      <div className='stage-body'>
        <Canvas waves={waves} goal={goal} setCleared={setCleared} help={help} />
        <div className='stage-body-dials'>
          {waves.map((wave, i) => (
            <div className='dials' key={i}>
              <Dials
                wave={wave}
                setWave={(newWave) => setWave(i, newWave)}
                dialColors={InitDialColors[i]}
                goal={goal}
                hint={stageId === 0 && !cleared[stageId]}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Stage
