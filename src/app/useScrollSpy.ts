import { useEffect } from 'react'

interface UseScrollSpyOptions {
  ids: ReadonlyArray<string>
  onActiveChange: (id: string) => void
}

/**
 * Midpoint scroll-spy: the active section is the *last* one whose top edge has
 * passed the vertical midpoint of the viewport. Runs on scroll/resize behind
 * requestAnimationFrame. (IntersectionObserver can't express "last top above
 * the midpoint", so this is a measured scroll listener by design.)
 */
export function useScrollSpy({ ids, onActiveChange }: UseScrollSpyOptions): void {
  useEffect(() => {
    if (ids.length === 0 || typeof window === 'undefined') return

    let raf: number | null = null

    function spy() {
      const mid = window.innerHeight * 0.5
      let current: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= mid) current = id
      }
      if (current !== null) onActiveChange(current)
    }

    function onScroll() {
      if (raf !== null) return
      raf = window.requestAnimationFrame(() => {
        raf = null
        spy()
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf !== null) window.cancelAnimationFrame(raf)
    }
  }, [ids, onActiveChange])
}
