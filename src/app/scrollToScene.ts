import { getStageZoom } from './stageZoom'

/** Sticky header height on the (unzoomed) 1280px canvas. */
const HEADER_HEIGHT = 60
/** Breathing room between the header and a scrolled-to section. */
const SCROLL_GAP = 26

/** True when the user asked for reduced motion (read at call time). */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Scroll a section into view, offset by the rendered header height (header
 * height × stage zoom) plus a 26px gap. `smooth` requests a smooth scroll for
 * user-initiated navigation; reduced-motion always forces an instant jump.
 * No-ops safely if the element isn't mounted.
 */
export function scrollToScene(id: string, opts: { smooth?: boolean } = {}): void {
  if (typeof document === 'undefined') return
  const el = document.getElementById(id)
  if (!el) return
  const offset = HEADER_HEIGHT * getStageZoom() + SCROLL_GAP
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  const behavior = opts.smooth && !prefersReducedMotion() ? 'smooth' : 'auto'
  window.scrollTo({ top: Math.max(0, top), behavior })
}
