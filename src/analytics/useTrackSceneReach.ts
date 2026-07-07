import { useEffect, useRef } from 'react'
import type { SectionId } from '@/plates/plates.config'
import { track } from './umami'

/** Fire `scene-reached` once per section per session as it becomes active. */
export function useTrackSceneReach(sectionId: SectionId | null): void {
  const reached = useRef<Set<SectionId>>(new Set())

  useEffect(() => {
    if (sectionId === null) return
    if (reached.current.has(sectionId)) return
    reached.current.add(sectionId)
    track('scene-reached', { scene: sectionId })
  }, [sectionId])
}
