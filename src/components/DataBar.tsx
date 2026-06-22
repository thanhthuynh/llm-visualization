import type { CSSProperties } from 'react'
import { accentHex, accentGlow } from '@/utils/accent'
import type { AccentToken } from '@/scenes/scenes.config'
import { useReducedMotionPref } from '@/app/useReducedMotionPref'

interface DataBarProps {
  label: string
  value: string
  fraction: number
  dominant?: boolean
  accent?: AccentToken
}

export function DataBar({ label, value, fraction, dominant = false, accent }: DataBarProps) {
  const reduce = useReducedMotionPref()
  const useAccent = dominant && accent
  const fillColor = useAccent ? accentHex(accent) : 'rgb(74, 74, 92)'
  const glow = useAccent ? accentGlow(accent, 'bar') : 'none'
  const pct = Math.round(fraction * 100)
  const valueColor = useAccent ? accentHex(accent) : 'var(--color-text-muted)'

  const fillStyle = {
    '--bar-w': `${pct}%`,
    '--bar-fill': fillColor,
    '--bar-glow': glow,
    transition: reduce ? 'none' : 'width 240ms ease-out',
  } as CSSProperties
  const valueStyle = { '--bar-value-color': valueColor } as CSSProperties

  return (
    <div
      className="grid items-center gap-3.5 my-1.5"
      style={{ gridTemplateColumns: '70px 1fr 52px' }}
    >
      <span className="font-mono text-[15px] leading-[22px] text-right">{label}</span>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-7 rounded-pill bg-surface-track overflow-hidden"
      >
        <div
          data-testid="databar-fill"
          style={fillStyle}
          className="h-full w-[var(--bar-w)] rounded-pill bg-(--bar-fill) shadow-[var(--bar-glow)]"
        />
      </div>
      <span
        style={valueStyle}
        className="font-mono text-[15px] leading-[22px] text-(--bar-value-color)"
      >
        {value}
      </span>
    </div>
  )
}
