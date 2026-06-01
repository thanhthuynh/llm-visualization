import type { CSSProperties } from 'react'
import { accentHex } from '@/utils/accent'
import type { AccentToken } from '@/scenes/scenes.config'

interface AccentRuleProps {
  accent: AccentToken
}

export function AccentRule({ accent }: AccentRuleProps) {
  return (
    <div
      role="presentation"
      style={{ '--rule-color': accentHex(accent) } as CSSProperties}
      className="w-12 h-[3px] rounded-accent-rule bg-(--rule-color)"
    />
  )
}
