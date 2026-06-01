import type { CSSProperties } from 'react'

interface SceneNavProps {
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
}

const baseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '11px 18px',
  borderRadius: 'var(--radius-pill)',
  border: '1px solid var(--color-border)',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  minHeight: 44,
  transition: 'opacity 160ms ease-out, background-color 160ms ease-out',
}

export function SceneNav({
  onPrev,
  onNext,
  canPrev,
  canNext,
  label = 'Scene navigation',
}: SceneNavProps) {
  return (
    <nav
      aria-label={label}
      style={{
        marginTop: 24,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 8,
      }}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous scene"
        style={{
          ...baseStyle,
          background: 'transparent',
          color: 'var(--color-text-muted)',
          opacity: canPrev ? 1 : 0.4,
          cursor: canPrev ? 'pointer' : 'not-allowed',
        }}
      >
        ← Prev
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next scene"
        style={{
          ...baseStyle,
          background: 'var(--color-surface-card)',
          color: canNext ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
          opacity: canNext ? 1 : 0.4,
          cursor: canNext ? 'pointer' : 'not-allowed',
        }}
      >
        Next →
      </button>
    </nav>
  )
}
