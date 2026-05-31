import { describe, it, expect } from 'vitest'
import { accentHex, accentRgba, accentGlow } from '@/utils/accent'

describe('accent utils', () => {
  it('returns the spec hex for predict', () => {
    expect(accentHex('predict')).toBe('#9D4EDD')
  })
  it('returns an rgba string with the requested alpha', () => {
    expect(accentRgba('predict', 0.55)).toBe('rgba(157, 78, 221, 0.55)')
  })
  it('builds rail glow per spec §6', () => {
    expect(accentGlow('predict', 'rail')).toBe('0 0 16px 2px rgba(157, 78, 221, 0.55)')
  })
  it('builds bar glow per spec §6', () => {
    expect(accentGlow('predict', 'bar')).toBe('0 0 14px 1px rgba(157, 78, 221, 0.55)')
  })
})
