import confetti from 'canvas-confetti'
import { useCallback, useEffect, useRef, useState } from 'react'
import usePersistentState from '../hooks/PersistentState'
import { getGoal, Goals, saveGoal, type Goal } from '../logic/Goal'
import { getNextStageId, STAGE_CUSTOM, STAGE_RANDOM, STAGE_SELECTOR } from '../logic/StageId'
import Canvas from './Canvas'
import Stage from './Stage'

const Selector = () => {
  const [cleared, setCleared] = usePersistentState<Record<number, boolean>>('cleared', {})
  const nextStageId = getNextStageId(STAGE_SELECTOR, cleared)
  const [stageId, setStageId] = useState(nextStageId)
  const [goal, setGoal] = useState<Goal | null>(null)
  const stageRefs = useRef<(HTMLButtonElement | null)[]>([])

  const setStageIdAndGoal = useCallback(
    async (nextStageId: number) => {
      let customGoal = ''
      if (nextStageId === STAGE_CUSTOM) {
        if (nextStageId === stageId) return
        try {
          customGoal = await navigator.clipboard.readText()
        } catch {
          alert('Unable to access clipboard!')
        }
      }

      const nextGoal = getGoal(nextStageId, customGoal)
      if (nextGoal === null) {
        alert('Invalid wave!')
      } else {
        setCleared((prev) => ({ ...prev, [STAGE_RANDOM]: false, [STAGE_CUSTOM]: false }))
        setStageId(nextStageId)
        setGoal(nextGoal)
      }
    },
    [setCleared, stageId],
  )

  const setClearedAndCelebrate = useCallback(() => {
    if (!cleared[stageId]) {
      setCleared((prev) => ({ ...prev, [stageId]: true }))
      confetti({
        particleCount: 100,
        spread: 360,
      })
    }
  }, [cleared, setCleared, stageId])

  useEffect(() => {
    if (goal === null) {
      setStageIdAndGoal(stageId)
    }
  }, [stageId, goal, setStageIdAndGoal])

  useEffect(() => {
    if (stageId === STAGE_SELECTOR) {
      stageRefs.current[nextStageId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [nextStageId, stageId])

  return (
    <div className='main'>
      {stageId === STAGE_SELECTOR && (
        <>
          <div className='header'>
            <div className='header-left'>
              <h1>&#x222b;inetune</h1>
            </div>
            <div className='header-right'>
              <button
                className={`btn-header ${nextStageId === STAGE_SELECTOR ? 'pulse' : ''}`}
                onClick={() => setStageIdAndGoal(STAGE_RANDOM)}
              >
                {`Random \u{1F3B2}`}
              </button>
              {/*
              <button className='btn-header' onClick={() => setStageIdAndGoal(STAGE_CUSTOM)}>
                {`Paste \u{1F4CB}`}
              </button>
              */}
              <button
                className='btn-header'
                onClick={() => {
                  if (window.confirm('Reset all progress?')) {
                    setCleared({})
                  }
                }}
              >
                {`\u{1F5D1}`}
              </button>
            </div>
          </div>
          <div className='selector-body'>
            {Goals.map((goal, i) => (
              <button
                className={cleared[i] ? 'btn-stage cleared' : 'btn-stage'}
                key={i}
                ref={(el) => {
                  stageRefs.current[i] = el
                }}
                onClick={() => setStageIdAndGoal(i)}
              >
                <div className='btn-stage-id'>{i + 1}</div>
                <div className='btn-stage-id tick'>{cleared[i] ? `\u{2713}` : ''}</div>
                <div className='btn-stage-canvas'>
                  <Canvas waves={[]} goal={goal} help={0} />
                </div>
              </button>
            ))}
          </div>
        </>
      )}
      {stageId !== STAGE_SELECTOR && goal !== null && (
        <Stage
          key={`${stageId}-${saveGoal(goal.waves)}`}
          goal={goal}
          stageId={stageId}
          setStageId={setStageIdAndGoal}
          cleared={cleared}
          setCleared={setClearedAndCelebrate}
        />
      )}
    </div>
  )
}

export default Selector
