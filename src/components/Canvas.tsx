import { useCallback, useEffect, useRef } from 'react'
import type { Goal } from '../logic/Goal'
import {
  GoalWaveColor,
  InitWaveColors,
  SubGoalWaveColor,
  SumWaveColors,
  type Wave,
} from '../logic/Wave'

type CanvasProps = {
  waves: Wave[]
  goal: Goal
  help: number
  setCleared?: () => void
}

const Canvas = ({ waves: currWaves, goal, help, setCleared }: CanvasProps) => {
  const threshold = 0.9 // Number.EPSILON
  const minorLineColor = 'rgba(0, 0, 0, 0.075)'
  const majorLineColor = 'rgba(0, 0, 0, 0.15)'
  const axisColor = 'rgba(0, 0, 0, 1.0)'

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isPreview = currWaves.length === 0

    const width = canvas.width
    const height = canvas.height

    let yMax = 50
    let yMin = -yMax
    let xMax = 120
    const xMin = 0

    const adjustAspectRatio = () => {
      const xRange = xMax - xMin
      const yRange = yMax - yMin
      const canvasAspect = width / height
      const dataAspect = xRange / yRange

      if (canvasAspect > dataAspect) {
        xMax = xMin + yRange * canvasAspect
      } else if (canvasAspect < dataAspect) {
        yMax = xRange / canvasAspect / 2
        yMin = -yMax
      }
    }

    adjustAspectRatio()

    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width
    const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height

    ctx.clearRect(0, 0, width, height)

    const drawGrid = (gridWidth: number, strokeStyle: string) => {
      ctx.strokeStyle = strokeStyle

      for (let x = Math.ceil(xMin / gridWidth) * gridWidth; x <= xMax; x += gridWidth) {
        const cx = toCanvasX(x)
        ctx.beginPath()
        ctx.moveTo(cx, 0)
        ctx.lineTo(cx, height)
        ctx.stroke()
      }

      for (let y = Math.ceil(yMin / gridWidth) * gridWidth; y <= yMax; y += gridWidth) {
        const cy = toCanvasY(y)
        ctx.beginPath()
        ctx.moveTo(0, cy)
        ctx.lineTo(width, cy)
        ctx.stroke()
      }
    }

    if (!isPreview) {
      drawGrid(1, minorLineColor)
      drawGrid(10, majorLineColor)
    }

    const drawAxes = (lineWidth: number, strokeStyle: string) => {
      ctx.strokeStyle = strokeStyle

      ctx.lineWidth = lineWidth * (xMin === 0 ? 2 : 1)
      ctx.beginPath()
      ctx.moveTo(toCanvasX(0), 0)
      ctx.lineTo(toCanvasX(0), height)
      ctx.stroke()

      ctx.lineWidth = lineWidth
      ctx.beginPath()
      ctx.moveTo(0, toCanvasY(0))
      ctx.lineTo(width, toCanvasY(0))
      ctx.stroke()
    }

    if (!isPreview) {
      drawAxes(1.5, axisColor)
    }

    const drawWaves = (waves: Wave[], isCurr: boolean) => {
      const sumY: number[] = []
      const isBg = waves.length > 1 && (isCurr || 0 < help)
      if (isBg) ctx.setLineDash([10, 5])

      for (let i = 0; i < waves.length; ++i) {
        const wave = waves[i]
        const coords: number[][] = []

        let amp = wave.amp
        let freq = wave.freq
        if (isPreview) {
          amp *= goal.previewMul || 1
          freq *= goal.previewMul || 1
        }

        let offset = wave.offset
        if (isPreview) {
          offset += goal.previewAdd || -wave.offset
        }

        for (let px = 0; px <= width; ++px) {
          const x = xMin + (px / width) * (xMax - xMin)
          const y = Math.sin((x / Math.max(1, freq) - wave.phase / 10) * Math.PI) * amp + offset
          coords.push([x, y])

          if (i == 0) {
            sumY.push(y)
          } else {
            sumY[px] += y
          }
        }

        if (isCurr || i < help) {
          let first = true
          ctx.strokeStyle = isCurr ? InitWaveColors[i][isBg ? 1 : 0] : SubGoalWaveColor
          ctx.lineWidth = isCurr ? 2 : 1
          ctx.beginPath()

          for (let p = 0; p < coords.length; ++p) {
            const cx = toCanvasX(coords[p][0])
            const cy = toCanvasY(coords[p][1])

            if (first) {
              first = false
              ctx.moveTo(cx, cy)
            } else {
              ctx.lineTo(cx, cy)
            }
          }

          ctx.stroke()
        }
      }

      if (isBg) ctx.setLineDash([])

      if (!isCurr || isBg) {
        let first = true
        ctx.strokeStyle = isCurr ? SumWaveColors[waves.length - 2] : GoalWaveColor
        ctx.lineWidth = isCurr ? 2 : 3
        if (!isCurr) ctx.setLineDash([])
        ctx.beginPath()

        for (let px = 0; px <= width; ++px) {
          const x = xMin + (px / width) * (xMax - xMin)
          const y = sumY[px]
          const cx = toCanvasX(x)
          const cy = toCanvasY(y)

          if (first) {
            first = false
            ctx.moveTo(cx, cy)
          } else {
            ctx.lineTo(cx, cy)
          }
        }

        ctx.stroke()
        if (!isCurr) ctx.setLineDash([])
      }

      return sumY
    }

    const goalY = drawWaves(goal.waves, false)
    if (!isPreview) {
      const currY = drawWaves(currWaves, true)
      if (
        setCleared &&
        goalY.length === currY.length &&
        goalY.every((y, i) => Math.abs(y - currY[i]) < threshold)
      ) {
        setCleared()
      }
    }
  }, [currWaves, goal, help, setCleared])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const resize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = Math.floor((rect.width + 1) / 10) * 10
      canvas.height = Math.floor((rect.height + 1) / 10) * 10
      draw()
    }

    const observer = new ResizeObserver(resize)
    observer.observe(container)
    resize()

    return () => observer.disconnect()
  }, [draw])

  return (
    <div className='canvas-container' ref={containerRef}>
      <canvas className='canvas' ref={canvasRef} />
    </div>
  )
}

export default Canvas
