interface AttentionArcProps {
  x1: number
  x2: number
  baseline: number
  weight: number
  label: string
}

export function AttentionArc({ x1, x2, baseline, weight, label }: AttentionArcProps) {
  const midX = (x1 + x2) / 2
  const lift = Math.max(24, Math.abs(x2 - x1) * 0.5)
  const controlY = baseline - lift
  const d = `M ${x1} ${baseline} Q ${midX} ${controlY} ${x2} ${baseline}`
  const opacity = Math.min(1, 0.25 + weight * 0.75)
  const strokeWidth = 1 + weight * 4
  const pct = Math.round(weight * 100)

  return (
    <g>
      <path
        data-testid={`attention-arc-${label}`}
        d={d}
        fill="none"
        stroke="var(--color-accent-attention)"
        strokeOpacity={opacity}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <text
        x={midX}
        y={controlY - 4}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={11}
        fill="var(--color-text-muted)"
      >
        {pct}%
      </text>
    </g>
  )
}
