interface PhilosophyCardProps {
  title: string
  description: string
  publicDoc: string
  vendor: 'anthropic' | 'openai'
}

export function PhilosophyCard({ title, description, publicDoc, vendor }: PhilosophyCardProps) {
  return (
    <div
      style={{
        padding: 16,
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-surface-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 17,
          color: vendor === 'anthropic' ? '#9D4EDD' : '#2EE6D6',
        }}
      >
        {title}
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          lineHeight: '22px',
          color: 'var(--color-text-primary)',
        }}
      >
        {description}
      </p>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--color-text-muted)',
        }}
      >
        ref: {publicDoc}
      </div>
    </div>
  )
}
