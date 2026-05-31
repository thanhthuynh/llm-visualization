import type { CSSProperties, ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  onClick?: () => void
  active?: boolean
  accent?: string
  variant?: 'token' | 'example'
}

export function Chip({ children, onClick, active = false, accent, variant = 'token' }: ChipProps) {
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: variant === 'example' ? '10px 16px' : '10px 16px',
    borderRadius: 'var(--radius-pill)',
    border: `1px solid ${active && accent ? accent : 'var(--color-border)'}`,
    background: 'var(--color-surface-card)',
    color: 'var(--color-text-primary)',
    fontFamily: variant === 'token' ? 'var(--font-mono)' : 'var(--font-body)',
    fontSize: variant === 'token' ? 15 : 14,
    lineHeight: variant === 'token' ? '22px' : 1.3,
    cursor: onClick ? 'pointer' : 'default',
    boxShadow: active && accent ? `0 0 8px 1px ${accent}66` : 'none',
  }
  if (!onClick) return <span style={style}>{children}</span>
  return (
    <button type="button" style={style} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  )
}
