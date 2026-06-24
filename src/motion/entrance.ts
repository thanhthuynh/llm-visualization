import { MOTION, EASE_DECELERATE } from '@/motion/tokens'
import type { Variants } from 'motion/react'

// 4-ish children staggered at MOTION.stagger; cap each child's duration so the
// composed cascade (last child starts at 3*MOTION.stagger) ends <= MOTION.max.
export const ENTRANCE_CHILD_DURATION = MOTION.max - 3 * MOTION.stagger // 0.24s

export const entranceContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: MOTION.stagger } },
}

export const entranceItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ENTRANCE_CHILD_DURATION, ease: [...EASE_DECELERATE] },
  },
}
