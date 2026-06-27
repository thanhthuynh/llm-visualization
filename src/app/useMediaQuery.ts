import { useEffect, useState } from 'react'

/**
 * Reactive `matchMedia`. Returns whether `query` currently matches and updates
 * on change. SSR-safe (returns `false` when `window` is undefined).
 *
 * Used to switch a few wide diagram vizes to a mobile-native layout below the
 * `xl` breakpoint, e.g. `useMediaQuery('(max-width: 1279px)')`.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}
