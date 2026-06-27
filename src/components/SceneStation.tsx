import { useEffect, useRef, useState, type ReactNode } from 'react'
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
import { ENTRANCE_CHILD_DURATION } from '@/motion/entrance'
import type { Variants } from 'motion/react'

// Re-exported so tests that import it from SceneStation keep resolving.
export { ENTRANCE_CHILD_DURATION } from '@/motion/entrance'

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
    transition: { duration: ENTRANCE_CHILD_DURATION, ease: [...EASE_DECELERATE] },
  },
}

const stageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ENTRANCE_CHILD_DURATION, ease: [...EASE_DECELERATE] },
  },
}

const surfaceVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ENTRANCE_CHILD_DURATION, ease: [...EASE_DECELERATE] },
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

  // Defensive: the stage is overflow-x-auto below xl (see index.css), so if a
  // stage's content is ever wider than the card it pans instead of overflowing
  // the page. Center that pan on mount so the middle shows at rest rather than
  // the empty left edge. The two wide diagram vizes now reflow to fit on mobile
  // (attention → weight bars, embed → fitted scatter), so this is a no-op for
  // them; it guards any future wide stage content. No-op at >= xl.
  const stageFrameRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = stageFrameRef.current
    if (!el) return
    const id = requestAnimationFrame(() => {
      if (window.innerWidth >= 1280) {
        el.scrollLeft = 0
        return
      }
      const max = el.scrollWidth - el.clientWidth
      if (max > 0) el.scrollLeft = Math.round(max / 2)
    })
    return () => cancelAnimationFrame(id)
  }, [])

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
        className="relative min-h-screen pt-26 pb-6 grid grid-cols-1 gap-y-8 pl-(--gutter-left) pr-(--gutter-right) xl:gap-y-0 xl:[grid-template-columns:minmax(var(--stage-min-w),1fr)_var(--col-gap)_var(--col-right)]"
        {...outerMotionProps}
      >
        {reduced ? (
          <div
            ref={stageFrameRef}
            data-stage-frame
            className="relative w-full min-w-0 h-(--stage-h) bg-surface-card border border-border rounded-card overflow-clip max-xl:overflow-x-auto max-xl:overflow-y-hidden"
          >
            {stage}
          </div>
        ) : (
          <motion.div
            ref={stageFrameRef}
            data-stage-frame
            className="relative w-full min-w-0 h-(--stage-h) bg-surface-card border border-border rounded-card overflow-clip max-xl:overflow-x-auto max-xl:overflow-y-hidden"
            variants={stageVariants}
          >
            {stage}
          </motion.div>
        )}
        <div className="hidden xl:block" aria-hidden="true" />
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
