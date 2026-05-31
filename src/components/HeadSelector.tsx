import type { CSSProperties } from 'react'

interface HeadSelectorProps {
  active: 0 | 1 | 2
  onSelect: (index: 0 | 1 | 2) => void
}

const HEADS = [0, 1, 2] as const

function buttonStyle(isActive: boolean): CSSProperties {
  return {
    padding: '6px 14px',
    borderRadius: 'var(--radius-pill)',
    border: `1px solid ${isActive ? 'var(--color-accent-attention)' : 'var(--color-border)'}`,
    background: isActive
      ? 'color-mix(in srgb, var(--color-accent-attention) 16%, var(--color-surface-card))'
      : 'var(--color-surface-card)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    minHeight: 44,
  }
}

export function HeadSelector({ active, onSelect }: HeadSelectorProps) {
  return (
    <div role="group" aria-label="Attention head" style={{ display: 'flex', gap: 8 }}>
      {HEADS.map((i) => (
        <button
          key={i}
          type="button"
          aria-pressed={active === i}
          onClick={() => onSelect(i)}
          style={buttonStyle(active === i)}
        >
          Head {i + 1}
        </button>
      ))}
    </div>
  )
}
