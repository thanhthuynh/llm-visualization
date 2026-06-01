import type { ReactNode } from 'react'

interface DeepPanelProps {
  children: ReactNode
}

export function DeepPanel({ children }: DeepPanelProps) {
  return (
    <div className="flex flex-col gap-4 px-5 py-4.5 bg-surface-deep border border-border rounded-deep-panel">
      {children}
    </div>
  )
}
