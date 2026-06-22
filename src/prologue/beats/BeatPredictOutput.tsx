import type { MotionValue } from 'motion/react'
import { Chip } from '@/components/Chip'
import { DataBar } from '@/components/DataBar'
import { accentHex } from '@/utils/accent'
import { loadPromptDataset } from '@/data/loader'
import { BeatShell } from './BeatShell'

interface BeatProps {
  scrollYProgress: MotionValue<number>
}

const sky = loadPromptDataset('sky')
/** Top-5 next-token candidates straight from sky.json (G1: never the seed's stale 47/clear/falling). */
const TOP5 = sky.nextToken.slice(0, 5)

/** Render a candidate token without its leading space, for compact labels. */
function tokenLabel(token: string): string {
  return token.trim()
}

export function BeatPredictOutput({ scrollYProgress }: BeatProps) {
  return (
    <BeatShell
      beatId="predict-output"
      label="Prologue: predict and output"
      scrollYProgress={scrollYProgress}
    >
      <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
        THE NEXT-TOKEN DISTRIBUTION
      </p>
      <div className="w-full max-w-sm">
        {TOP5.map((c, i) => (
          <DataBar
            key={c.token}
            label={tokenLabel(c.token)}
            value={`${Math.round(c.p * 100)}%`}
            fraction={c.p}
            dominant={i === 0}
            accent="predict"
          />
        ))}
      </div>
      <p className="font-mono text-xs text-text-muted">decode → blue</p>
      <Chip accent={accentHex('output')} active variant="token">
        The sky is blue
      </Chip>
    </BeatShell>
  )
}
