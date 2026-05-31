import { useEffect } from 'react'

export const SCENE_JUMP_EVENT = 'llm-explainer:scene-jump'

export function useHashSync(activeId: string): void {
  useEffect(() => {
    if (!activeId) return
    const target = `#${activeId}`
    if (window.location.hash !== target) {
      window.history.replaceState(null, '', target)
    }
  }, [activeId])

  useEffect(() => {
    function onHash() {
      const id = window.location.hash.replace(/^#/, '')
      if (id) {
        window.dispatchEvent(new window.CustomEvent(SCENE_JUMP_EVENT, { detail: { id } }))
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
}
