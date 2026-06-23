import type { ReactNode } from 'react'
import { motion, type MotionValue } from 'motion/react'
import { useBeatStyle } from './useBeatStyle'
import { usePrologueMode } from '@/prologue/PrologueMode'
import type { BeatId } from '@/prologue/beats.config'

interface BeatShellProps {
  beatId: BeatId
  /** Unique landmark label (e.g. "Prologue: hook") — satisfies axe landmark-unique. */
  label: string
  scrollYProgress: MotionValue<number>
  children: ReactNode
}

/**
 * Mode-aware beat region. In 'scroll' mode (default): absolutely-stacked,
 * derives opacity + translateY from scroll progress (compositor-only).
 * In 'static' mode: in-flow full-viewport section at full visibility — no
 * sticky pin, no animation. useBeatStyle is called unconditionally (rules-of-hooks);
 * its result is intentionally ignored in the static branch.
 */
export function BeatShell({ beatId, label, scrollYProgress, children }: BeatShellProps) {
  const mode = usePrologueMode()
  // Called unconditionally to satisfy rules-of-hooks; result is ignored in static mode.
  const { opacity, y } = useBeatStyle(scrollYProgress, beatId)

  if (mode === 'static') {
    return (
      <section
        aria-label={label}
        className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-24 text-center"
      >
        {children}
      </section>
    )
  }

  return (
    <motion.section
      aria-label={label}
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6 text-center"
    >
      {children}
    </motion.section>
  )
}
