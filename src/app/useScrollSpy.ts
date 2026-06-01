import { useEffect } from 'react'

interface UseScrollSpyOptions {
  ids: ReadonlyArray<string>
  onActiveChange: (id: string) => void
  rootSelector?: string
  threshold?: number | number[]
}

export function useScrollSpy({
  ids,
  onActiveChange,
  rootSelector,
  threshold = 0.5,
}: UseScrollSpyOptions): void {
  useEffect(() => {
    if (ids.length === 0) return
    if (typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined') {
      return
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const root = rootSelector ? document.querySelector(rootSelector) : null

    const observer = new window.IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        const top = visible.reduce((best, e) =>
          e.intersectionRatio > best.intersectionRatio ? e : best,
        )
        const id = (top.target as HTMLElement).id
        if (id) onActiveChange(id)
      },
      { root, threshold },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids, onActiveChange, rootSelector, threshold])
}
