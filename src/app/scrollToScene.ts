/** True when the user asked for reduced motion (read at call time). */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Scroll a scene/anchor element into view. `smooth` requests a smooth scroll
 * for user-initiated navigation, but reduced-motion always forces an instant
 * jump. No-ops safely if the element isn't mounted.
 */
export function scrollToScene(id: string, opts: { smooth?: boolean } = {}): void {
  if (typeof document === 'undefined') return
  const el = document.getElementById(id)
  if (!el) return
  const behavior = opts.smooth && !prefersReducedMotion() ? 'smooth' : 'auto'
  el.scrollIntoView({ behavior, block: 'start' })
}
