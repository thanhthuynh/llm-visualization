import type { CSSProperties } from 'react'
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

  const dynamicStyle = {
    '--dt-label': labelColor,
    '--dt-border': borderColor,
    '--dt-shadow': boxShadow,
    transition: 'color 160ms ease-out, border-color 160ms ease-out, box-shadow 160ms ease-out',
  } as CSSProperties

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      {...(controlsId ? { 'aria-controls': controlsId } : {})}
      style={dynamicStyle}
      className="inline-flex items-center gap-2.5 pl-4.5 pr-4 py-3 rounded-pill bg-surface-card border border-(--dt-border) text-(--dt-label) font-body font-semibold text-sm cursor-pointer min-h-11 shadow-[var(--dt-shadow)]"
    >
      <span>{expanded ? 'Collapse' : 'Go deeper'}</span>
      <span aria-hidden="true">{expanded ? '⌃' : '⌄'}</span>
    </button>
  )
}
