import { accentHex } from '@/utils/accent'
import type { AccentToken } from '@/scenes/scenes.config'

interface EmbeddingDotProps {
  x: number
  y: number
  label: string
  accent?: AccentToken
  ghost?: boolean
  radius?: number
}

export function EmbeddingDot({
  x,
  y,
  label,
  accent,
  ghost = false,
  radius = 5,
}: EmbeddingDotProps) {
  const fill = ghost ? 'none' : accent ? accentHex(accent) : 'var(--color-text-primary)'
  const stroke = ghost ? (accent ? accentHex(accent) : 'var(--color-text-muted)') : 'transparent'
  return (
    <g>
      <circle
        data-testid={`embedding-dot-${label}`}
        cx={x}
        cy={y}
        r={radius}
        fill={fill}
        stroke={stroke}
        strokeWidth={ghost ? 1.5 : 0}
        strokeDasharray={ghost ? '3 3' : undefined}
      />
      <text
        x={x + radius + 4}
        y={y + 4}
        fontFamily="var(--font-mono)"
        fontSize={11}
        fill="var(--color-text-muted)"
      >
        {label}
      </text>
    </g>
  )
}
