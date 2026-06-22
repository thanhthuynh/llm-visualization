/**
 * TEMPORARY — Phase-0 (gate zero) spike harness.
 *
 * Proves a `position:sticky` pinned prologue stage driven by `motion`'s
 * `useScroll` can hand off cleanly into CSS scroll-snap stations, with the
 * document/body as the single scroll root.
 *
 * Reached ONLY via `?spike=handoff` (see `src/main.tsx`). Not part of the
 * production app. Deletion is a deferred cleanup task — DO NOT remove this until
 * after the human's real-Safari/iOS measurement pass. See
 * `.superpowers/sdd/task-0-report.md` for the manual protocol.
 *
 * Query params:
 *   ?spike=handoff                 → render this harness
 *   &mode=proximity                → root `scroll-snap-type: y proximity` (default)
 *   &mode=mandatory-pinned         → root `scroll-snap-type: y mandatory`
 */
import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { PROLOGUE_SNAP_MODE, type PrologueSnapMode } from '@/prologue/snap'
import { FpsOverlay } from './FpsOverlay'

const DOT_COUNT = 60

/** Deterministic pseudo-scatter so the 60 dots spread across the stage. */
function dotPosition(index: number): { left: number; top: number } {
  const golden = 137.508 // golden-angle scatter, stable across renders
  const angle = (index * golden * Math.PI) / 180
  const radius = 6 + (index / DOT_COUNT) * 38 // 6%..44% of the stage
  return {
    left: 50 + radius * Math.cos(angle),
    top: 50 + radius * Math.sin(angle),
  }
}

const DOTS = Array.from({ length: DOT_COUNT }, (_, i) => ({ id: i, ...dotPosition(i) }))

function parseMode(search: string): PrologueSnapMode {
  const raw = new URLSearchParams(search).get('mode')
  if (raw === 'mandatory-pinned') return 'mandatory-pinned'
  if (raw === 'static') return 'static'
  if (raw === 'proximity') return 'proximity'
  // No explicit mode → use the production default recorded in snap.ts.
  return PROLOGUE_SNAP_MODE
}

function snapTypeFor(mode: PrologueSnapMode): string {
  switch (mode) {
    case 'mandatory-pinned':
      return 'y mandatory'
    case 'static':
      return 'none'
    case 'proximity':
    default:
      return 'y proximity'
  }
}

export function SpikeHarness() {
  const trackRef = useRef<HTMLDivElement>(null)
  const mode = parseMode(window.location.search)

  // Toggle the root `scroll-snap-type` to match the requested mode. The class is
  // applied to <html> so the document scroll root owns the snapping, not a nested
  // overflow scroller. Cleaned up on unmount so the normal app is unaffected.
  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.scrollSnapType
    root.style.scrollSnapType = snapTypeFor(mode)
    return () => {
      root.style.scrollSnapType = previous
    }
  }, [mode])

  // ONE motion element, transform-only mapping. This is the perf-critical
  // constraint under test: no layout/width/height transforms, just opacity +
  // translateY on a compositor layer over 60 absolutely-positioned dots.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.15, 1, 1, 0.15])
  const translateY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <div data-spike="handoff" data-spike-mode={mode}>
      <FpsOverlay progress={scrollYProgress} mode={mode} />

      {/* 450vh scrubbed track with a sticky stage pinned to the viewport. */}
      <div ref={trackRef} className="prologue-track">
        <div className="prologue-stage">
          <p className="prologue-stage-hint">
            Prologue stage (pinned) — scrub down through 450vh, then watch the seam.
          </p>
          <motion.div
            className="prologue-constellation"
            style={{ opacity, y: translateY }}
            aria-hidden="true"
          >
            {DOTS.map((dot) => (
              <span
                key={dot.id}
                className="prologue-dot"
                style={{ left: `${dot.left}%`, top: `${dot.top}%` }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* 1px seam sentinel — the first real snap target after the track. */}
      <div className="prologue-end-sentinel" data-testid="prologue-end-sentinel" />

      {/* Dummy snapping stations so the seam is obvious to the eye and the spec. */}
      <section className="spike-station" data-testid="spike-station-1">
        <span className="spike-station-label">STATION 1</span>
      </section>
      <section className="spike-station" data-testid="spike-station-2">
        <span className="spike-station-label">STATION 2</span>
      </section>
      <section className="spike-station" data-testid="spike-station-3">
        <span className="spike-station-label">STATION 3</span>
      </section>
    </div>
  )
}
