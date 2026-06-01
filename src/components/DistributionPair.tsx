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

function DistributionColumn({ data, accent }: { data: DistributionBars; accent: AccentToken }) {
  return (
    <div className="flex flex-col gap-2 min-w-0">
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
    <div className="grid items-center gap-4" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
      <DistributionColumn data={left} accent={accent} />
      <div className="font-[family-name:--font-body] font-semibold text-[13px] text-(--color-text-muted) text-center">
        {arrowCaption}
      </div>
      <DistributionColumn data={right} accent={accent} />
    </div>
  )
}
