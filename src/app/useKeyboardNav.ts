import { useEffect } from 'react'

interface Handlers {
  onPrev: () => void
  onNext: () => void
}

const PREV_KEYS = new Set(['ArrowUp', 'PageUp'])
const NEXT_KEYS = new Set(['ArrowDown', 'PageDown'])
const INTERACTIVE = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

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
