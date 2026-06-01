import { describe, it, expect } from 'vitest'
import { softmaxWithTemperature } from '@/utils/softmax'

describe('softmaxWithTemperature', () => {
  it('returns a uniform distribution for equal logits at T=1', () => {
    const probs = softmaxWithTemperature([1, 1, 1], 1)
    expect(probs[0]).toBeCloseTo(1 / 3, 6)
    expect(probs[1]).toBeCloseTo(1 / 3, 6)
    expect(probs[2]).toBeCloseTo(1 / 3, 6)
  })

  it('matches the canonical softmax at T=1 for distinct logits', () => {
    const probs = softmaxWithTemperature([2, 1, 0], 1)
    const e = [Math.exp(2), Math.exp(1), Math.exp(0)]
    const Z = e[0] + e[1] + e[2]
    expect(probs[0]).toBeCloseTo(e[0] / Z, 6)
    expect(probs[1]).toBeCloseTo(e[1] / Z, 6)
    expect(probs[2]).toBeCloseTo(e[2] / Z, 6)
  })

  it('sums to 1 for any T in the supported range', () => {
    for (const T of [0.1, 0.5, 1, 1.5, 2]) {
      const probs = softmaxWithTemperature([3, 1.5, 0.5, 0.2, 0.1], T)
      const sum = probs.reduce((a, b) => a + b, 0)
      expect(sum).toBeCloseTo(1, 6)
    }
  })

  it('collapses toward one-hot on the max logit as T → 0', () => {
    const probs = softmaxWithTemperature([3, 1, 0.5], 0.05)
    expect(probs[0]).toBeGreaterThan(0.99)
    expect(probs[1]).toBeLessThan(0.01)
    expect(probs[2]).toBeLessThan(0.01)
  })

  it('approaches uniform as T → ∞', () => {
    const probs = softmaxWithTemperature([3, 1, 0.5], 10000)
    expect(probs[0]).toBeCloseTo(1 / 3, 3)
    expect(probs[1]).toBeCloseTo(1 / 3, 3)
    expect(probs[2]).toBeCloseTo(1 / 3, 3)
  })

  it('is numerically stable for large logits', () => {
    const probs = softmaxWithTemperature([1000, 999, 998], 1)
    const sum = probs.reduce((a, b) => a + b, 0)
    expect(Number.isFinite(sum)).toBe(true)
    expect(sum).toBeCloseTo(1, 6)
    expect(probs[0]).toBeGreaterThan(probs[1])
    expect(probs[1]).toBeGreaterThan(probs[2])
  })

  it('throws on non-positive temperature', () => {
    expect(() => softmaxWithTemperature([1, 2, 3], 0)).toThrow()
    expect(() => softmaxWithTemperature([1, 2, 3], -0.5)).toThrow()
  })

  it('throws on empty logits', () => {
    expect(() => softmaxWithTemperature([], 1)).toThrow()
  })
})
