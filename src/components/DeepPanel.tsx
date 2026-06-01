import type { ReactNode } from 'react'

interface DeepPanelProps {
  children: ReactNode
}

export function DeepPanel({ children }: DeepPanelProps) {
  return (
    <div className="flex flex-col gap-4 px-5 py-[18px] bg-(--color-surface-deep) border border-(--color-border) rounded-(--radius-deep-panel)">
      {children}
    </div>
  )
}
