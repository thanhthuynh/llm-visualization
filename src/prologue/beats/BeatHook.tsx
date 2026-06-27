import type { MotionValue } from 'motion/react'
import { Chip } from '@/components/Chip'
import { accentHex } from '@/utils/accent'
import { BeatShell } from './BeatShell'

interface BeatProps {
  scrollYProgress: MotionValue<number>
}

export function BeatHook({ scrollYProgress }: BeatProps) {
  return (
    <BeatShell beatId="hook" label="Prologue: hook" scrollYProgress={scrollYProgress}>
      <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
        INTERACTIVE EXPLAINER
      </p>
      <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-medium tracking-[-0.02em] text-text-primary">
        Inside an LLM.
      </h1>
      <Chip accent={accentHex('prompt')} active variant="token">
        The sky is
      </Chip>
      <p className="font-mono text-xs text-text-muted">scroll to begin ↓</p>
    </BeatShell>
  )
}
