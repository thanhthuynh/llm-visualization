import { useState, type RefObject } from 'react'
import { useScroll, useMotionValueEvent, type MotionValue } from 'motion/react'
import { beatAtProgress, type BeatId } from './beats.config'

export interface BeatProgress {
  scrollYProgress: MotionValue<number>
  activeBeat: BeatId
}

/**
 * Thin motion/useScroll wrapper that tracks discrete beat transitions.
 *
 * - `scrollYProgress` is forwarded so beat components can derive their own
 *   opacity/translateY via `useTransform` in Phase 4.
 * - `activeBeat` is a discrete state updated only when the beat actually
 *   changes, avoiding needless re-renders within a beat's range.
 *
 * offset: ['start start', 'end end'] — progress 0 when the top of the track
 * meets the top of the viewport; 1 when the bottom of the track meets the
 * bottom of the viewport.
 */
export function useBeatProgress(trackRef: RefObject<HTMLElement | null>): BeatProgress {
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const [activeBeat, setActiveBeat] = useState<BeatId>('hook')

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = beatAtProgress(p)
    setActiveBeat((prev) => (prev === next ? prev : next))
  })

  return { scrollYProgress, activeBeat }
}
