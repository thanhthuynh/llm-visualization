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

export function ContextWindowBar({ rows, maxTokens }: ContextWindowBarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map((r) => {
        const pct = Math.round((r.tokens / maxTokens) * 100)
        const label = formatTokens(r.tokens)
        return (
          <div
            key={`${r.vendor}-${r.family}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 64px',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13 }}>{r.family}</span>
            <div
              role="progressbar"
              aria-label={`${r.family} context window`}
              aria-valuenow={r.tokens}
              aria-valuemin={0}
              aria-valuemax={maxTokens}
              style={{
                height: 18,
                borderRadius: 9,
                background: 'var(--color-surface-track)',
                overflow: 'hidden',
              }}
            >
              <div
                data-testid={`ctx-fill-${r.vendor}`}
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background:
                    r.vendor === 'anthropic'
                      ? 'var(--color-accent-predict, #9D4EDD)'
                      : 'var(--color-accent-output, #2EE6D6)',
                }}
              />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, textAlign: 'right' }}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
