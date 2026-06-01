import type { CSSProperties } from 'react'
import type { Tier } from '@/data/compare.config'

interface ClaimTierProps {
  tier: Tier
}

const STYLES: Record<Tier, { border: string; color: string; bg: string }> = {
  a: {
    border: 'rgba(46, 230, 214, 0.6)',
    color: '#2EE6D6',
    bg: 'color-mix(in srgb, #2EE6D6 14%, var(--color-surface-card))',
  },
  b: {
    border: 'rgba(251, 191, 36, 0.6)',
    color: '#FBBF24',
    bg: 'color-mix(in srgb, #FBBF24 14%, var(--color-surface-card))',
  },
  c: {
    border: 'var(--color-border)',
    color: 'var(--color-text-muted)',
    bg: 'var(--color-surface-card)',
  },
}

export function ClaimTier({ tier }: ClaimTierProps) {
  const s = STYLES[tier]
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: 'var(--radius-pill)',
    border: `1px solid ${s.border}`,
    background: s.bg,
    color: s.color,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    lineHeight: '16px',
  }
  return (
    <span data-tier={tier} style={style}>
      ({tier})
    </span>
  )
}
