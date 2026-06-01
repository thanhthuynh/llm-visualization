interface TokenizerCountExample {
  vendor: 'anthropic' | 'openai'
  label: string
  prompt: string
  tokenCount: number
  note: string
}

interface TokenizerCountProps {
  examples: ReadonlyArray<TokenizerCountExample>
}

export function TokenizerCount({ examples }: TokenizerCountProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {examples.map((e) => (
        <div
          key={e.vendor}
          style={{
            padding: 14,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            background: 'var(--color-surface-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: 13,
              color: 'var(--color-text-primary)',
            }}
          >
            {e.label}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              color: 'var(--color-text-muted)',
            }}
          >
            &quot;{e.prompt}&quot;
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--color-text-primary)',
              }}
            >
              {e.tokenCount}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--color-text-muted)',
              }}
            >
              tokens
            </span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--color-text-muted)',
              fontStyle: 'italic',
            }}
          >
            {e.note}
          </div>
        </div>
      ))}
    </div>
  )
}
