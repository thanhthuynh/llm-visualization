import type { ReactNode } from 'react'

interface CaveatNoteProps {
  children: ReactNode
}

export function CaveatNote({ children }: CaveatNoteProps) {
  return (
    <div
      role="note"
      className="flex items-start gap-3 px-4 py-3.5 mt-3 rounded-caveat border border-accent-caveat bg-surface-card font-body text-sm leading-5"
    >
      <span aria-hidden="true" className="text-accent-caveat text-base">
        ⚐
      </span>
      <span className="text-text-muted">{children}</span>
    </div>
  )
}
