import { scaleSequential } from 'd3-scale'
import { interpolateMagma } from 'd3-scale-chromatic'

interface AttentionMatrixProps {
  tokens: ReadonlyArray<string>
  weights: ReadonlyArray<ReadonlyArray<number>>
  queryIndex: number
  cellSize?: number
}

export function AttentionMatrix({
  tokens,
  weights,
  queryIndex,
  cellSize = 36,
}: AttentionMatrixProps) {
  const n = tokens.length
  const labelGutter = 80
  const totalW = labelGutter + n * cellSize + 24
  const totalH = labelGutter + n * cellSize + 24
  const color = scaleSequential(interpolateMagma).domain([0, 1])

  return (
    <svg
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      aria-label="Attention matrix"
    >
      <text
        x={labelGutter + (n * cellSize) / 2}
        y={18}
        textAnchor="middle"
        fontSize={11}
        fill="var(--color-text-muted)"
      >
        keys →
      </text>
      <text
        x={14}
        y={labelGutter + (n * cellSize) / 2}
        textAnchor="middle"
        transform={`rotate(-90 14 ${labelGutter + (n * cellSize) / 2})`}
        fontSize={11}
        fill="var(--color-text-muted)"
      >
        queries ↓
      </text>

      {tokens.map((t, j) => (
        <text
          key={`col-${j}`}
          x={labelGutter + j * cellSize + cellSize / 2}
          y={labelGutter - 6}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-text-muted)"
        >
          {t.trim()}
        </text>
      ))}

      {tokens.map((t, i) => (
        <text
          key={`row-${i}`}
          x={labelGutter - 6}
          y={labelGutter + i * cellSize + cellSize / 2 + 4}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill={i === queryIndex ? 'var(--color-accent-attention)' : 'var(--color-text-muted)'}
          fontWeight={i === queryIndex ? 700 : 400}
        >
          {t.trim()}
        </text>
      ))}

      {tokens.map((_, i) =>
        tokens.map((__, j) => {
          const blank = j > i
          const x = labelGutter + j * cellSize
          const y = labelGutter + i * cellSize
          const w = weights[i][j]
          const fill = blank ? 'var(--color-rail-inactive)' : color(w)
          const isQueryRow = i === queryIndex
          return (
            <rect
              key={`cell-${i}-${j}`}
              data-testid={`attention-cell-${i}-${j}`}
              {...(blank ? { 'data-blank': 'true' } : {})}
              x={x}
              y={y}
              width={cellSize - 2}
              height={cellSize - 2}
              rx={4}
              fill={fill}
              stroke={isQueryRow && !blank ? 'var(--color-accent-attention)' : 'transparent'}
              strokeWidth={isQueryRow && !blank ? 1.5 : 0}
            />
          )
        }),
      )}
    </svg>
  )
}
