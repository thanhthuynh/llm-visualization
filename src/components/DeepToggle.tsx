interface DeepToggleProps {
  expanded: boolean
  onToggle: () => void
  controlsId?: string
}

export function DeepToggle({ expanded, onToggle, controlsId }: DeepToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      {...(controlsId ? { 'aria-controls': controlsId } : {})}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--color-surface-card)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
        minHeight: 44,
      }}
    >
      <span>{expanded ? 'Collapse' : 'Go deeper'}</span>
      <span aria-hidden="true">{expanded ? '⌃' : '⌄'}</span>
    </button>
  )
}
