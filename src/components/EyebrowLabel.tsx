import type { ReactNode } from 'react'

interface EyebrowLabelProps {
  children: ReactNode
  className?: string
}

export function EyebrowLabel({ children, className }: EyebrowLabelProps) {
  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        fontSize: 10,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
      }}
    >
      {children}
    </span>
  )
}
