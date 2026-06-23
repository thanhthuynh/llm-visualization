import type { MotionValue } from 'motion/react'
import { Chip } from '@/components/Chip'
import { accentHex } from '@/utils/accent'
import { loadPromptDataset } from '@/data/loader'
import { BeatShell } from './BeatShell'

interface BeatProps {
  scrollYProgress: MotionValue<number>
}

const sky = loadPromptDataset('sky')

function chipDisplay(text: string): string {
  return text.startsWith(' ') ? `·${text.slice(1)}` : text
}

export function BeatAttention({ scrollYProgress }: BeatProps) {
  return (
    <BeatShell beatId="attention" label="Prologue: attention" scrollYProgress={scrollYProgress}>
      <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
        EACH TOKEN LOOKS BACK
      </p>
      <div className="flex items-center gap-3">
        {sky.tokens.map((t, i) => (
          <Chip
            key={t.id}
            accent={accentHex('attention')}
            active={i === sky.tokens.length - 1}
            variant="token"
          >
            {chipDisplay(t.text)}
          </Chip>
        ))}
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 40"
        className="h-10 w-48"
        fill="none"
        stroke={accentHex('attention')}
        strokeWidth="1.5"
      >
        <path d="M 175 5 Q 100 35 100 5" />
        <path d="M 175 5 Q 50 40 30 5" />
      </svg>
      <p className="font-body text-sm text-text-muted">&apos;is&apos; attends to · sky · The</p>
    </BeatShell>
  )
}
