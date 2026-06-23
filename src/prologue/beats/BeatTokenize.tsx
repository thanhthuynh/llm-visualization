import type { MotionValue } from 'motion/react'
import { Chip } from '@/components/Chip'
import { accentHex } from '@/utils/accent'
import { loadPromptDataset } from '@/data/loader'
import { BeatShell } from './BeatShell'

interface BeatProps {
  scrollYProgress: MotionValue<number>
}

const sky = loadPromptDataset('sky')

/** Mockup convention: a leading-space token renders with a ·-prefix marking whitespace. */
function chipDisplay(text: string): string {
  return text.startsWith(' ') ? `·${text.slice(1)}` : text
}

export function BeatTokenize({ scrollYProgress }: BeatProps) {
  return (
    <BeatShell beatId="tokenize" label="Prologue: tokenize" scrollYProgress={scrollYProgress}>
      <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
        FROM TEXT TO TOKENS
      </p>
      <div className="flex flex-wrap items-start justify-center gap-3">
        {sky.tokens.map((t) => (
          <div key={t.id} className="flex flex-col items-center gap-2">
            <Chip accent={accentHex('tokenize')} active variant="token">
              {chipDisplay(t.text)}
            </Chip>
            <span className="font-mono text-xs text-text-muted">{t.id}</span>
          </div>
        ))}
      </div>
      <p className="font-body text-sm text-text-muted">the model&apos;s own pieces</p>
    </BeatShell>
  )
}
