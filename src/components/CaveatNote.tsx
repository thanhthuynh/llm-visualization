import type { ReactNode } from 'react'

interface CaveatNoteProps {
  children: ReactNode
}

export function CaveatNote({ children }: CaveatNoteProps) {
  return (
    <div
      role="note"
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        padding: '14px 16px',
        marginTop: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'var(--color-accent-caveat)',
        backgroundColor: 'var(--color-surface-card)',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        lineHeight: '20px',
      }}
    >
      <span aria-hidden="true" style={{ color: 'var(--color-accent-caveat)', fontSize: 16 }}>
        ⚐
      </span>
      <span style={{ color: 'var(--color-text-muted)' }}>{children}</span>
    </div>
  )
}
