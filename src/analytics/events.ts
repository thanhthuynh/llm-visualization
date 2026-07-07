import type { SectionId } from '@/plates/plates.config'

/**
 * The Atlas event taxonomy — hard ceiling ≤15 named events (currently 5).
 * `scene-reached` fires from the useTrackSceneReach hook; the cta-* events
 * fire declaratively via `data-umami-event` attributes on routable elements
 * (no JS tracking calls for clicks).
 */
export type AnalyticsEvent =
  | 'scene-reached' // a section became active for the first time this session
  | 'cta-rail-jump' // station rail click
  | 'cta-nav' // header CHARTS/GLOSSARY/ABOUT click
  | 'cta-route-link' // in-chart cross-link (hero map, gazetteer, colophon index)
  | 'cta-decode-control' // Plate IV·Detail SAMPLING/GREEDY toggle

export interface SceneReachedProps {
  scene: SectionId
}
