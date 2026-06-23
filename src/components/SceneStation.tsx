import { useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { useDepth } from '@/app/DepthContext'
import { useReducedMotionPref } from '@/app/useReducedMotionPref'
import { useSceneNav } from '@/app/SceneNavContext'
import { AccentRule } from './AccentRule'
import { DeepPanel } from './DeepPanel'
import { DeepToggle } from './DeepToggle'
import { SceneNav } from './SceneNav'
import type { AccentToken, SceneId } from '@/scenes/scenes.config'
import { EASE_DECELERATE, MOTION } from '@/motion/tokens'
import type { Variants } from 'motion/react'

interface SceneStationProps {
  id: SceneId
  title: string
  accent: AccentToken
  stage: ReactNode
  surface: ReactNode
  deeper?: ReactNode
}

// Shared entrance variants — four elements cascade via staggerChildren.
// Parent controls the stagger; each child declares initial/animate states.
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: MOTION.stagger } },
}

const accentVariants: Variants = {
  hidden: { scaleX: 0, opacity: 1 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: MOTION.micro, ease: [...EASE_DECELERATE] },
  },
}

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.standard, ease: [...EASE_DECELERATE] },
  },
}

const stageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.standard, ease: [...EASE_DECELERATE] },
  },
}

const surfaceVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.standard, ease: [...EASE_DECELERATE] },
  },
}

export function SceneStation({ id, title, accent, stage, surface, deeper }: SceneStationProps) {
  const { globalDepth } = useDepth()
  const nav = useSceneNav()
  const reduced = useReducedMotionPref()
  const [localOverride, setLocalOverride] = useState<boolean | null>(null)
  const expanded = deeper !== undefined && (localOverride ?? globalDepth === 'deep')
  const deepPanelId = `${id}-deep`

  const idx = nav ? nav.ids.indexOf(id) : -1
  const canPrev = idx > 0
  const canNext = idx >= 0 && idx < nav!.ids.length - 1

  // When reduced-motion is preferred, pass initial={false} so motion skips the
  // enter animation and renders all content at its final (visible) state immediately.
  // When animate is active, drive entrance via whileInView (plays once).
  const outerMotionProps = reduced
    ? ({ initial: false } as const)
    : ({
        variants: containerVariants,
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, amount: 0.3 },
      } as const)

  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <motion.div
        className="relative min-h-screen pt-26 pb-6 grid pl-(--gutter-left) pr-(--gutter-right)"
        style={{
          gridTemplateColumns: 'minmax(var(--stage-min-w), 1fr) var(--col-gap) var(--col-right)',
        }}
        {...outerMotionProps}
      >
        {reduced ? (
          <div
            data-stage-frame
            className="relative w-full min-w-0 h-(--stage-h) bg-surface-card border border-border rounded-card overflow-clip"
          >
            {stage}
          </div>
        ) : (
          <motion.div
            data-stage-frame
            className="relative w-full min-w-0 h-(--stage-h) bg-surface-card border border-border rounded-card overflow-clip"
            variants={stageVariants}
          >
            {stage}
          </motion.div>
        )}
        <div />
        <div className="relative min-w-0">
          {reduced ? (
            <h2
              id={`${id}-title`}
              tabIndex={-1}
              className="font-display font-bold text-[28px] leading-[34px] tracking-[-1px] m-0 text-text-primary"
            >
              {title}
            </h2>
          ) : (
            <motion.h2
              id={`${id}-title`}
              tabIndex={-1}
              className="font-display font-bold text-[28px] leading-[34px] tracking-[-1px] m-0 text-text-primary"
              variants={titleVariants}
            >
              {title}
            </motion.h2>
          )}
          <div className="mt-6">
            {reduced ? (
              <AccentRule accent={accent} />
            ) : (
              <motion.div style={{ transformOrigin: 'left' }} variants={accentVariants}>
                <AccentRule accent={accent} />
              </motion.div>
            )}
          </div>
          {reduced ? (
            <div className="mt-4.5 w-full max-w-(--surface-max-w)">{surface}</div>
          ) : (
            <motion.div
              className="mt-4.5 w-full max-w-(--surface-max-w)"
              variants={surfaceVariants}
            >
              {surface}
            </motion.div>
          )}
          {deeper !== undefined && (
            <div className="mt-6">
              <DeepToggle
                expanded={expanded}
                onToggle={() => setLocalOverride(!expanded)}
                controlsId={deepPanelId}
                accent={accent}
              />
              {expanded && (
                <div id={deepPanelId} className="mt-4.5 w-full max-w-(--surface-max-w)">
                  <DeepPanel>{deeper}</DeepPanel>
                </div>
              )}
            </div>
          )}
          {nav && idx >= 0 && (
            <SceneNav
              onPrev={() => canPrev && nav.goTo(nav.ids[idx - 1])}
              onNext={() => canNext && nav.goTo(nav.ids[idx + 1])}
              canPrev={canPrev}
              canNext={canNext}
              label={`${title}: scene navigation`}
            />
          )}
        </div>
      </motion.div>
    </section>
  )
}
