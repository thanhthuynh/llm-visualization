import { DataBar } from '@/components/DataBar'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import type { AccentToken } from '@/scenes/scenes.config'

interface DistributionBars {
  label: string
  bars: ReadonlyArray<{ token: string; p: number }>
}

interface DistributionPairProps {
  left: DistributionBars
  right: DistributionBars
  accent: AccentToken
  arrowCaption?: string
}

function DistributionColumn({
  data,
  accent,
}: {
  data: DistributionBars
  accent: AccentToken
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
      <EyebrowLabel>{data.label}</EyebrowLabel>
      <div>
        {data.bars.map((b, i) => (
          <DataBar
            key={b.token}
            label={b.token}
            value={`${Math.round(b.p * 100)}%`}
            fraction={b.p}
            dominant={i === 0}
            accent={accent}
          />
        ))}
      </div>
    </div>
  )
}

export function DistributionPair({
  left,
  right,
  accent,
  arrowCaption = 'raise T →',
}: DistributionPairProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: 16,
        alignItems: 'center',
      }}
    >
      <DistributionColumn data={left} accent={accent} />
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: 13,
          color: 'var(--color-text-muted)',
          textAlign: 'center',
        }}
      >
        {arrowCaption}
      </div>
      <DistributionColumn data={right} accent={accent} />
    </div>
  )
}
