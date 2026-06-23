import { useTransform, type MotionValue } from 'motion/react'
import { BEATS, type BeatId } from '@/prologue/beats.config'

/** Small fade lead-in/out window (in scroll-progress units) around each beat's range. */
const FADE_EPS = 0.04
/** Vertical drift in px during the fade (transform-only — never animates layout). */
const DRIFT_PX = 24

function rangeFor(id: BeatId): readonly [number, number] {
  const beat = BEATS.find((b) => b.id === id)
  if (!beat) throw new Error(`unknown beat id: ${id}`)
  return beat.range
}

export interface BeatStyle {
  opacity: MotionValue<number>
  y: MotionValue<number>
}

/**
 * Derive a beat's opacity + translateY purely from scroll progress and the
 * beat's declared range. Compositor-only properties (opacity + transform);
 * no width/height/layout animation (perf gate).
 *
 * Fade in over [start-ε, start], hold across [start, end], fade out over
 * [end, end+ε]. translateY drifts up from +DRIFT to 0 on entry and continues
 * to -DRIFT on exit, so beats glide rather than pop.
 */
export function useBeatStyle(scrollYProgress: MotionValue<number>, id: BeatId): BeatStyle {
  const [start, end] = rangeFor(id)
  const inAt = Math.max(0, start - FADE_EPS)
  const outAt = Math.min(1, end + FADE_EPS)

  const opacity = useTransform(scrollYProgress, [inAt, start, end, outAt], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [inAt, start, end, outAt], [DRIFT_PX, 0, 0, -DRIFT_PX])

  return { opacity, y }
}
