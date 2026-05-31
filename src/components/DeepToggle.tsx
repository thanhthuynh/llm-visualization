import { accentHex, accentRgba } from '@/utils/accent'
import type { AccentToken } from '@/scenes/scenes.config'

interface DeepToggleProps {
  expanded: boolean
  onToggle: () => void
  controlsId?: string
  accent?: AccentToken
}

export function DeepToggle({ expanded, onToggle, controlsId, accent }: DeepToggleProps) {
  const tinted = expanded && accent
  const labelColor = tinted ? accentHex(accent) : 'var(--color-text-primary)'
  const borderColor = tinted ? accentHex(accent) : 'var(--color-border)'
  const boxShadow = tinted ? `0 0 6px 0 ${accentRgba(accent, 0.35)}` : 'none'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      {...(controlsId ? { 'aria-controls': controlsId } : {})}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px 12px 18px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--color-surface-card)',
        border: `1px solid ${borderColor}`,
        color: labelColor,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
        minHeight: 44,
        boxShadow,
        transition: 'color 160ms ease-out, border-color 160ms ease-out, box-shadow 160ms ease-out',
      }}
    >
      <span>{expanded ? 'Collapse' : 'Go deeper'}</span>
      <span aria-hidden="true">{expanded ? '⌃' : '⌄'}</span>
    </button>
  )
}
