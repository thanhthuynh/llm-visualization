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
  const dynamicStyle = {
    '--tier-border': s.border,
    '--tier-bg': s.bg,
    '--tier-color': s.color,
  } as CSSProperties
  return (
    <span
      data-tier={tier}
      style={dynamicStyle}
      className="inline-flex items-center px-2 py-0.5 rounded-pill border border-(--tier-border) bg-(--tier-bg) text-(--tier-color) font-mono text-[11px] leading-4"
    >
      ({tier})
    </span>
  )
}
