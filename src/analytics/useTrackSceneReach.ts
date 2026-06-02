import { useEffect, useRef } from 'react'
import type { SceneId } from '@/scenes/scenes.config'
import type { Depth } from '@/app/DepthContext'
import { track } from './umami'

export function useTrackSceneReach(sceneId: SceneId | null, depth: Depth): void {
  const reached = useRef<Set<SceneId>>(new Set())

  useEffect(() => {
    if (sceneId === null) return
    if (reached.current.has(sceneId)) return
    reached.current.add(sceneId)
    track('scene-reached', { scene: sceneId, depth })
  }, [sceneId, depth])
}
