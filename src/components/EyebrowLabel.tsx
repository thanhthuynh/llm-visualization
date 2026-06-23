import type { ReactNode } from 'react'

interface EyebrowLabelProps {
  children: ReactNode
  className?: string
}

export function EyebrowLabel({ children, className }: EyebrowLabelProps) {
  const base = 'font-body font-medium text-[10px] tracking-widest uppercase text-text-muted'
  return <span className={className ? `${base} ${className}` : base}>{children}</span>
}
