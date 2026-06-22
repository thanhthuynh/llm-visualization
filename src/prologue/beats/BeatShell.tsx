import type { ReactNode } from 'react'
import { motion, type MotionValue } from 'motion/react'
import { useBeatStyle } from './useBeatStyle'
import type { BeatId } from '@/prologue/beats.config'

interface BeatShellProps {
  beatId: BeatId
  /** Unique landmark label (e.g. "Prologue: hook") — satisfies axe landmark-unique. */
  label: string
  scrollYProgress: MotionValue<number>
  children: ReactNode
}

/**
 * Absolutely-stacked beat region. Derives opacity + translateY from scroll
 * progress (compositor-only; no layout animation) and exposes a unique
 * landmark label so the prologue passes axe `landmark-unique`.
 */
export function BeatShell({ beatId, label, scrollYProgress, children }: BeatShellProps) {
  const { opacity, y } = useBeatStyle(scrollYProgress, beatId)

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
