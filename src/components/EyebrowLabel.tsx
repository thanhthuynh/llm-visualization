import type { CSSProperties, ReactNode } from 'react'

interface EyebrowLabelProps {
  children: ReactNode
  className?: string
  accent?: string // hex; tints the eyebrow (else muted default)
}

export function EyebrowLabel({ children, className, accent }: EyebrowLabelProps) {
  const base = 'font-body font-medium text-[10px] tracking-widest uppercase'
  const color = accent ? '' : 'text-text-muted'
  const style = accent ? ({ color: accent } as CSSProperties) : undefined
  return (
    <span className={[base, color, className].filter(Boolean).join(' ')} style={style}>
      {children}
    </span>
  )
}
