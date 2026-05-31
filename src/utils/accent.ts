import { ACCENT_HEX, type AccentToken } from '@/scenes/scenes.config'

export function accentHex(token: AccentToken): string {
  return ACCENT_HEX[token]
}

export function accentRgba(token: AccentToken, alpha: number): string {
  const hex = ACCENT_HEX[token].slice(1)
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function accentGlow(token: AccentToken, kind: 'rail' | 'bar'): string {
  return kind === 'rail'
    ? `0 0 16px 2px ${accentRgba(token, 0.55)}`
    : `0 0 14px 1px ${accentRgba(token, 0.55)}`
}
