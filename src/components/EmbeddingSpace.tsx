import { EmbeddingDot } from './EmbeddingDot'
import type { AccentToken } from '@/scenes/scenes.config'
import type { IllustrativeDot } from '@/data/illustrative-embeddings'

interface ClusterShape {
  cx: number
  cy: number
  rx: number
  ry: number
}

interface ShiftShape {
  from: string
  to: { x: number; y: number }
}

interface EmbeddingSpaceProps {
  dots: ReadonlyArray<IllustrativeDot>
  cluster?: ClusterShape
  shift?: ShiftShape
  accent?: AccentToken
  width?: number
  height?: number
}

const PAD = 32

function project(v: number, axis: 'x' | 'y', w: number, h: number): number {
  const size = axis === 'x' ? w : h
  return PAD + ((v + 1) / 2) * (size - 2 * PAD)
}

export function EmbeddingSpace({
  dots,
  cluster,
  shift,
  accent,
  width = 600,
  height = 400,
}: EmbeddingSpaceProps) {
  const fromDot = shift ? dots.find((d) => d.label === shift.from) : undefined

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-label="2D meaning space (illustrative)"
      style={{ display: 'block' }}
    >
      <line
        x1={PAD}
        y1={height / 2}
        x2={width - PAD}
        y2={height / 2}
        stroke="var(--color-border)"
      />
      <line
        x1={width / 2}
        y1={PAD}
        x2={width / 2}
        y2={height - PAD}
        stroke="var(--color-border)"
      />
      <text x={width - PAD + 4} y={height / 2 + 4} fontSize={11} fill="var(--color-text-muted)">
        meaning →
      </text>
      <text x={width / 2 + 4} y={PAD - 6} fontSize={11} fill="var(--color-text-muted)">
        meaning ↑
      </text>

      {cluster && (
        <ellipse
          data-testid="embedding-cluster"
          cx={project(cluster.cx, 'x', width, height)}
          cy={project(cluster.cy, 'y', width, height)}
          rx={cluster.rx * (width / 2)}
          ry={cluster.ry * (height / 2)}
          fill="rgba(76, 201, 240, 0.08)"
          stroke="rgba(76, 201, 240, 0.4)"
          strokeDasharray="4 4"
        />
      )}

      {dots.map((d) => (
        <EmbeddingDot
          key={d.label}
          x={project(d.x, 'x', width, height)}
          y={project(d.y, 'y', width, height)}
          label={d.label}
          {...(accent ? { accent } : {})}
        />
      ))}

      {shift && fromDot && (
        <>
          <g data-testid="embedding-shift-ghost">
            <EmbeddingDot
              x={project(fromDot.x, 'x', width, height)}
              y={project(fromDot.y, 'y', width, height)}
              label={`${fromDot.label} (input)`}
              ghost
            />
          </g>
          <line
            data-testid="embedding-shift-line"
            x1={project(fromDot.x, 'x', width, height)}
            y1={project(fromDot.y, 'y', width, height)}
            x2={project(shift.to.x, 'x', width, height)}
            y2={project(shift.to.y, 'y', width, height)}
            stroke="var(--color-accent-embed)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <g data-testid="embedding-shift-shifted">
            <EmbeddingDot
              x={project(shift.to.x, 'x', width, height)}
              y={project(shift.to.y, 'y', width, height)}
              label={`${shift.from} (after attention)`}
              accent="embed"
            />
          </g>
        </>
      )}
    </svg>
  )
}
