import type { CSSProperties } from 'react'
import type { MotionValue } from 'motion/react'
import { Chip } from '@/components/Chip'
import { accentHex, accentRgba } from '@/utils/accent'
import { loadPromptDataset } from '@/data/loader'
import { BeatShell } from './BeatShell'

interface BeatProps {
  scrollYProgress: MotionValue<number>
}

const sky = loadPromptDataset('sky')

function chipDisplay(text: string): string {
  return text.startsWith(' ') ? `·${text.slice(1)}` : text
}

export function BeatEmbed({ scrollYProgress }: BeatProps) {
  return (
    <BeatShell beatId="embed" label="Prologue: embed" scrollYProgress={scrollYProgress}>
      <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
        TOKENS BECOME VECTORS
      </p>
      <div className="flex flex-wrap items-start justify-center gap-5">
        {sky.tokens.map((t) => (
          <div key={t.id} className="flex flex-col items-center gap-2.5">
            <Chip accent={accentHex('embed')} variant="token">
              {chipDisplay(t.text)}
            </Chip>
            <div className="flex gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="block h-4 w-1 rounded-sm"
                  style={{ background: accentRgba('embed', 0.4 + i * 0.12) } as CSSProperties}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="font-mono text-xs text-text-muted">→ 768d vector</p>
    </BeatShell>
  )
}
