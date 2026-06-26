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
export interface BeatFadeKeyframes {
  /** Strictly-increasing scroll-progress stops. */
  stops: number[]
  /** Opacity at each stop. */
  opacity: number[]
  /** translateY (px) at each stop. */
  y: number[]
}

/**
 * Pure: derive the fade keyframes for a beat's [start, end] range.
 *
 * Omits the lead-in (or lead-out) segment when the beat sits FLUSH against the
 * scroll-progress boundary — i.e. start === 0 (the opening beat) or end === 1
 * (the closing beat). Without this guard, inAt === start (or end === outAt)
 * produces a DEGENERATE duplicate breakpoint, and at exactly progress 0 (or 1)
 * the transform resolves to the edge keyframe (opacity 0 / y DRIFT_PX) instead
 * of the settled one — so the opening hero beat lands at translateY(24px) and
 * never paints until the first scroll nudges progress off the boundary. Flush
 * beats must hold full visibility (opacity 1, y 0) at their boundary.
 */
export function beatFadeKeyframes(start: number, end: number): BeatFadeKeyframes {
  const inAt = Math.max(0, start - FADE_EPS)
  const outAt = Math.min(1, end + FADE_EPS)

  const stops: number[] = []
  const opacity: number[] = []
  const y: number[] = []

  if (inAt < start) {
    stops.push(inAt)
    opacity.push(0)
    y.push(DRIFT_PX)
  }
  stops.push(start, end)
  opacity.push(1, 1)
  y.push(0, 0)
  if (end < outAt) {
    stops.push(outAt)
    opacity.push(0)
    y.push(-DRIFT_PX)
  }

  return { stops, opacity, y }
}

export function useBeatStyle(scrollYProgress: MotionValue<number>, id: BeatId): BeatStyle {
  const [start, end] = rangeFor(id)
  const { stops, opacity: opacityRange, y: yRange } = beatFadeKeyframes(start, end)

  const opacity = useTransform(scrollYProgress, stops, opacityRange)
  const y = useTransform(scrollYProgress, stops, yRange)

  return { opacity, y }
}
