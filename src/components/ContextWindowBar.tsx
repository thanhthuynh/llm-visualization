interface ContextWindowRow {
  vendor: 'anthropic' | 'openai'
  family: string
  tokens: number
}

interface ContextWindowBarProps {
  rows: ReadonlyArray<ContextWindowRow>
  maxTokens: number
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

import type { CSSProperties } from 'react'

export function ContextWindowBar({ rows, maxTokens }: ContextWindowBarProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((r) => {
        const pct = Math.round((r.tokens / maxTokens) * 100)
        const label = formatTokens(r.tokens)
        const fillStyle = {
          '--ctx-w': `${pct}%`,
          '--ctx-fill':
            r.vendor === 'anthropic'
              ? 'var(--color-accent-predict, #9D4EDD)'
              : 'var(--color-accent-output, #2EE6D6)',
        } as CSSProperties
        return (
          <div
            key={`${r.vendor}-${r.family}`}
            className="grid items-center gap-3"
            style={{ gridTemplateColumns: '120px 1fr 64px' }}
          >
            <span className="font-body text-[13px]">{r.family}</span>
            <div
              role="progressbar"
              aria-label={`${r.family} context window`}
              aria-valuenow={r.tokens}
              aria-valuemin={0}
              aria-valuemax={maxTokens}
              className="h-4.5 rounded-[9px] bg-surface-track overflow-hidden"
            >
              <div
                data-testid={`ctx-fill-${r.vendor}`}
                style={fillStyle}
                className="h-full w-[var(--ctx-w)] bg-(--ctx-fill)"
              />
            </div>
            <span className="font-mono text-[13px] text-right">{label}</span>
          </div>
        )
      })}
    </div>
  )
}
