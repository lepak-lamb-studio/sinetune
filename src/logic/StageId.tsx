import { Goals } from './Goal'

export const STAGE_SELECTOR = -1
export const STAGE_RANDOM = -2
export const STAGE_CUSTOM = -3

export const getNextStageId = (stageId: number, cleared: Record<number, boolean>) => {
  if (stageId === STAGE_RANDOM) return STAGE_RANDOM
  if (stageId === STAGE_CUSTOM) return STAGE_SELECTOR

  let nextStageId = stageId
  for (let i = 0; i < Goals.length; ++i) {
    nextStageId = (nextStageId + 1) % Goals.length
    if (!cleared[nextStageId]) return nextStageId
  }

  return STAGE_SELECTOR
}
