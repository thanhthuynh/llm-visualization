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
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '70px 1fr 52px',
        alignItems: 'center',
        gap: 14,
        margin: '6px 0',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 15,
          lineHeight: '22px',
          textAlign: 'right',
        }}
      >
        {label}
      </span>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          height: 28,
          borderRadius: 'var(--radius-pill)',
          background: 'var(--color-surface-track)',
          overflow: 'hidden',
        }}
      >
        <div
          data-testid="databar-fill"
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: fillColor,
            borderRadius: 'var(--radius-pill)',
            boxShadow: glow,
            transition: reduce ? 'none' : 'width 240ms ease-out',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 15,
          lineHeight: '22px',
          color: valueColor,
        }}
      >
        {value}
      </span>
    </div>
  )
}
