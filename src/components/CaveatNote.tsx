import type { ReactNode } from 'react'

interface CaveatNoteProps {
  children: ReactNode
}

export function CaveatNote({ children }: CaveatNoteProps) {
  return (
    <div
      role="note"
      className="flex items-start gap-3 px-4 py-[14px] mt-3 rounded-[12px] border border-(--color-accent-caveat) bg-(--color-surface-card) font-[family-name:--font-body] text-sm leading-5"
    >
      <span aria-hidden="true" className="text-(--color-accent-caveat) text-base">
        ⚐
      </span>
      <span className="text-(--color-text-muted)">{children}</span>
    </div>
  )
}
