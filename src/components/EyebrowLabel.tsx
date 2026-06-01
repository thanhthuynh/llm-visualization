import type { ReactNode } from 'react'

interface EyebrowLabelProps {
  children: ReactNode
  className?: string
}

export function EyebrowLabel({ children, className }: EyebrowLabelProps) {
  const base =
    'font-[family-name:--font-body] font-medium text-[10px] tracking-widest uppercase text-(--color-text-muted)'
  return <span className={className ? `${base} ${className}` : base}>{children}</span>
}
