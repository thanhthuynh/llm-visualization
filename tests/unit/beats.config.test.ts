import { describe, it, expect } from 'vitest'
import { BEATS, beatAtProgress, type BeatId } from '@/prologue/beats.config'

describe('BEATS table', () => {
  it('has exactly 7 beats', () => {
    expect(BEATS).toHaveLength(7)
  })

  it('has ids in the exact order specified', () => {
    const ids: BeatId[] = [
      'hook',
      'tokenize',
      'embed',
      'attention',
      'predict-output',
      'provenance',
      'choose-path',
    ]
    expect(BEATS.map((b) => b.id)).toEqual(ids)
  })

  it('has ranges that are contiguous — no gaps or overlaps', () => {
    for (let i = 1; i < BEATS.length; i++) {
      const prev = BEATS[i - 1]
      const curr = BEATS[i]
      expect(curr!.range[0]).toBe(prev!.range[1])
    }
  })

  it('first range starts at 0', () => {
    expect(BEATS[0]!.range[0]).toBe(0)
  })

  it('last range ends at 1', () => {
    expect(BEATS[BEATS.length - 1]!.range[1]).toBe(1)
  })
})

describe('beatAtProgress', () => {
  it('0 → hook', () => expect(beatAtProgress(0)).toBe('hook'))
  it('0.2 → tokenize', () => expect(beatAtProgress(0.2)).toBe('tokenize'))
  it('0.4 → embed', () => expect(beatAtProgress(0.4)).toBe('embed'))
  it('0.5 → attention', () => expect(beatAtProgress(0.5)).toBe('attention'))
  it('0.65 → predict-output', () => expect(beatAtProgress(0.65)).toBe('predict-output'))
  it('0.8 → provenance', () => expect(beatAtProgress(0.8)).toBe('provenance'))
  it('0.9 → choose-path', () => expect(beatAtProgress(0.9)).toBe('choose-path'))
  it('1 → choose-path (last beat covers p===1)', () =>
    expect(beatAtProgress(1)).toBe('choose-path'))
  it('-0.5 → hook (clamp below 0)', () => expect(beatAtProgress(-0.5)).toBe('hook'))
  it('1.5 → choose-path (clamp above 1)', () => expect(beatAtProgress(1.5)).toBe('choose-path'))
})
