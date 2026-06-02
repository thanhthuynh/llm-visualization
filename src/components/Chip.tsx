import type { CSSProperties, ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  onClick?: () => void
  active?: boolean
  accent?: string
  variant?: 'token' | 'example'
}

export function Chip({ children, onClick, active = false, accent, variant = 'token' }: ChipProps) {
  const isToken = variant === 'token'
  const ringColor = active && accent ? accent : 'var(--color-border)'
  const shadow = active && accent ? `0 0 8px 1px ${accent}66` : 'none'

  const dynamicStyle = {
    '--chip-ring': ringColor,
    '--chip-shadow': shadow,
  } as CSSProperties

  const baseClass = [
    'inline-flex items-center px-4 py-2.5',
    'rounded-pill',
    'border border-(--chip-ring)',
    'bg-surface-card text-text-primary',
    'shadow-[var(--chip-shadow)]',
    isToken
      ? 'font-mono text-[15px] leading-[22px]'
      : 'font-body text-sm leading-[1.3]',
    onClick ? 'cursor-pointer' : 'cursor-default',
  ].join(' ')

  if (!onClick) {
    return (
      <span style={dynamicStyle} className={baseClass}>
        {children}
      </span>
    )
  }
  return (
    <button
      type="button"
      aria-pressed={active}
      data-umami-event="cta-chip"
      data-umami-event-variant={variant}
      style={dynamicStyle}
      className={baseClass}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
