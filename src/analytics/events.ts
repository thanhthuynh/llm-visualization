import type { SceneId } from '@/scenes/scenes.config'
import type { Depth } from '@/app/DepthContext'

export type AnalyticsEvent =
  | 'scene-reached'
  | 'cta-start-explore'
  | 'cta-depth-toggle'
  | 'cta-scene-nav'
  | 'cta-rail-jump'
  | 'cta-chip'
  | 'cta-head-select'

export interface SceneReachedProps {
  scene: SceneId
  depth: Depth
}

export interface DepthToggleProps {
  to: Depth
  scene?: SceneId
}

export interface SceneNavProps {
  direction: 'next' | 'prev'
}

export interface RailJumpProps {
  scene: SceneId
}

export interface HeadSelectProps {
  head: 0 | 1 | 2
}
