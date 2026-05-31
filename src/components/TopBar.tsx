interface TopBarProps {
  prompt: string
}

export function TopBar({ prompt }: TopBarProps) {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 72,
        right: 0,
        height: 72,
        background: 'var(--color-bg-base)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        zIndex: 9,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: '-0.2px',
        }}
      >
        Inside an LLM
      </span>
      {prompt && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--color-surface-card)',
            border: '1px solid var(--color-border)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}
          >
            Prompt
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{prompt}</span>
        </div>
      )}
    </header>
  )
}
