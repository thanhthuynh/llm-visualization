import { accentHex } from '@/utils/accent'
import type { AccentToken } from '@/scenes/scenes.config'

interface AccentRuleProps {
  accent: AccentToken
}

export function AccentRule({ accent }: AccentRuleProps) {
  return (
    <div
      role="presentation"
      style={{
        width: 48,
        height: 3,
        borderRadius: 'var(--radius-accent-rule)',
        backgroundColor: accentHex(accent),
      }}
    />
  )
}
