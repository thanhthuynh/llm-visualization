import { useEffect } from 'react'

export const SECTION_JUMP_EVENT = 'atlas:section-jump'

/** Strip the `#/` (or legacy `#`) prefix from a location hash. */
export function parseSectionHash(hash: string): string {
  return hash.replace(/^#\/?/, '').trim().toLowerCase()
}

/**
 * Two-way hash sync using the `#/{id}` slug format:
 * - writes the active section to the URL via replaceState (no scroll jump,
 *   no history spam);
 * - turns external hashchange events (URL edits, back/forward) into a
 *   SECTION_JUMP_EVENT the shell listens for.
 */
export function useHashSync(activeId: string): void {
  useEffect(() => {
    if (!activeId) return
    const target = `#/${activeId}`
    if (window.location.hash !== target) {
      window.history.replaceState(null, '', target)
    }
  }, [activeId])

  useEffect(() => {
    function onHash() {
      const id = parseSectionHash(window.location.hash)
      if (id) {
        window.dispatchEvent(new window.CustomEvent(SECTION_JUMP_EVENT, { detail: { id } }))
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
}
