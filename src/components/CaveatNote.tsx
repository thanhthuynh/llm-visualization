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
        gap: 10,
        alignItems: 'flex-start',
        padding: '10px 14px',
        marginTop: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'var(--color-accent-caveat)',
        backgroundColor:
          'color-mix(in srgb, var(--color-accent-caveat) 8%, var(--color-surface-card))',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        lineHeight: '20px',
      }}
    >
      <span aria-hidden="true" style={{ color: 'var(--color-accent-caveat)', fontSize: 16 }}>
        ⚐
      </span>
      <span>{children}</span>
    </div>
  )
}
