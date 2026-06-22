import type { CSSProperties } from 'react'
import type { MotionValue } from 'motion/react'
import { accentHex } from '@/utils/accent'
import type { AccentToken } from '@/scenes/scenes.config'
import { BeatShell } from './BeatShell'

interface BeatProps {
  scrollYProgress: MotionValue<number>
}

/** Pipeline accent order — the 7 stages, prompt → output. */
const SPECTRUM: readonly AccentToken[] = [
  'prompt',
  'tokenize',
  'embed',
  'attention',
  'predict',
  'decode',
  'output',
]

export function BeatProvenanceVow({ scrollYProgress }: BeatProps) {
  return (
    <BeatShell beatId="provenance" label="Prologue: provenance" scrollYProgress={scrollYProgress}>
      <div className="flex max-w-2xl gap-6 text-left">
        <div
          aria-hidden="true"
          className="w-0.5 shrink-0 self-stretch rounded-full bg-accent-caveat"
        />
        <div className="flex flex-col gap-5">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
            METHODS · PROVENANCE
          </p>
          <h2 className="font-display text-3xl font-medium tracking-[-0.01em] text-text-primary">
            Where the numbers come from
          </h2>
          <p className="font-body text-lg leading-relaxed text-text-primary/90">
            Every number, embedding, attention weight, and probability on this site comes from GPT-2
            small, run offline — illustrative, not live frontier internals. Claude and ChatGPT
            don&apos;t expose token-level state for arbitrary input, so this site doesn&apos;t
            pretend to visualize theirs.
          </p>
          <span className="flex gap-2" aria-hidden="true">
            {SPECTRUM.map((token) => (
              <span
                key={token}
                className="block h-2 w-2 rounded-full bg-(--dot-color)"
                style={{ '--dot-color': accentHex(token) } as CSSProperties}
              />
            ))}
          </span>
        </div>
      </div>
    </BeatShell>
  )
}
