import { describe, it, expect } from 'vitest'
import { beatFadeKeyframes } from '@/prologue/beats/useBeatStyle'
import { BEATS } from '@/prologue/beats.config'

/**
 * Regression guard for the prologue "blank hero on landing" bug: the opening
 * beat (range start === 0) must settle to full visibility (opacity 1, y 0) at
 * progress 0, and the closing beat (range end === 1) at progress 1. A degenerate
 * duplicate breakpoint there used to resolve to the edge keyframe (opacity 0 /
 * y 24), leaving the hero at translateY(24px) and unpainted until first scroll.
 */
describe('beatFadeKeyframes', () => {
  it('opening beat (start 0) settles to opacity 1 / y 0 at the progress-0 boundary', () => {
    const { stops, opacity, y } = beatFadeKeyframes(0, 0.12)
    expect(stops[0]).toBe(0)
    expect(opacity[0]).toBe(1) // NOT 0 — hero is fully visible at scroll 0
    expect(y[0]).toBe(0) // NOT 24 — hero is settled, not drifted
    // still fades out at the trailing edge
    expect(opacity[opacity.length - 1]).toBe(0)
  })

  it('closing beat (end 1) holds opacity 1 / y 0 at the progress-1 boundary', () => {
    const { stops, opacity, y } = beatFadeKeyframes(0.84, 1)
    expect(stops[stops.length - 1]).toBe(1)
    expect(opacity[opacity.length - 1]).toBe(1)
    expect(y[y.length - 1]).toBe(0)
    // still fades in at the leading edge
    expect(opacity[0]).toBe(0)
  })

  it('interior beat keeps a symmetric fade in and out (4 stops)', () => {
    const { stops, opacity, y } = beatFadeKeyframes(0.12, 0.3)
    expect(stops).toHaveLength(4)
    expect(opacity).toEqual([0, 1, 1, 0])
    expect(y).toEqual([24, 0, 0, -24])
  })

  it('every beat in the real config produces strictly-increasing stops (no degenerate breakpoints)', () => {
    for (const beat of BEATS) {
      const { stops, opacity, y } = beatFadeKeyframes(beat.range[0], beat.range[1])
      expect(stops.length).toBe(opacity.length)
      expect(stops.length).toBe(y.length)
      for (let i = 1; i < stops.length; i++) {
        expect(stops[i]).toBeGreaterThan(stops[i - 1]!)
      }
    }
  })
})
