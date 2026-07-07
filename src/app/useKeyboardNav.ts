import { useEffect } from 'react'

interface Handlers {
  onPrev: () => void
  onNext: () => void
}

const PREV_KEYS = new Set(['ArrowLeft', 'k'])
const NEXT_KEYS = new Set(['ArrowRight', 'j'])
const INTERACTIVE = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

/**
 * Section paging: ←/k previous, →/j next. Ignored while focus is in a form
 * control (the Plate IV·Detail sliders) or editable content; natural page
 * scrolling (↑/↓/PageUp/PageDown/space) stays untouched.
 */
export function useKeyboardNav({ onPrev, onNext }: Handlers): void {
  useEffect(() => {
    function handle(event: globalThis.KeyboardEvent) {
      const target = event.target as globalThis.HTMLElement | null
      if (target && INTERACTIVE.has(target.tagName)) return
      if (target?.isContentEditable) return
      if (PREV_KEYS.has(event.key)) {
        event.preventDefault()
        onPrev()
      } else if (NEXT_KEYS.has(event.key)) {
        event.preventDefault()
        onNext()
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onPrev, onNext])
}
