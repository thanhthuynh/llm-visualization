import type { ReactNode } from 'react'

interface DeepPanelProps {
  children: ReactNode
}

export function DeepPanel({ children }: DeepPanelProps) {
  return (
    <div
      style={{
        background: 'var(--color-surface-deep)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-deep-panel)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {children}
    </div>
  )
}
