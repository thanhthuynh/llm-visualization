import type { SceneId } from '@/scenes/scenes.config'
import type { Depth } from '@/app/DepthContext'

export type AnalyticsEvent =
  | 'scene-reached'
  | 'cta-start-explore'
  | 'cta-depth-toggle'
  | 'cta-scene-card'
  | 'cta-scene-nav'

export interface SceneReachedProps {
  scene: SceneId
  depth: Depth
}

export interface DepthToggleProps {
  to: Depth
}

export interface SceneCardProps {
  scene: SceneId
}

export interface SceneNavProps {
  direction: 'next' | 'prev'
}
