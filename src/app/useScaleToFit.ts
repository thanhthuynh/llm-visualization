import { useEffect, type RefObject } from 'react'
import { setStageZoom } from './stageZoom'

const CANVAS_WIDTH = 1280
/** Rail (170px @ left:28px) plus breathing room on both sides. */
const RAIL_ALLOWANCE = 430
/** Page gutter (24px each side) when the rail is hidden. */
const GUTTER_ALLOWANCE = 48
/** Below this viewport width the station rail is hidden (CSS min-[1100px]). */
const RAIL_MIN_VIEWPORT = 1100

/**
 * Scales the fixed 1280px design canvas down to fit the viewport using CSS
 * `zoom` (layout-affecting, unlike transform:scale, so document height stays
 * correct). Never scales up past 1. Mirrors the design reference behavior.
 */
export function useScaleToFit(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    function fit() {
      if (!el) return
      const vw = window.innerWidth
      const railOn = vw >= RAIL_MIN_VIEWPORT
      const avail = railOn ? vw - RAIL_ALLOWANCE : vw - GUTTER_ALLOWANCE
      const scale = Math.min(avail / CANVAS_WIDTH, 1)
      const zoom = scale > 0 ? scale : 1
      setStageZoom(zoom)
      el.style.setProperty('zoom', String(zoom))
    }

    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [ref])
}
