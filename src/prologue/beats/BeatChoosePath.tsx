import type { CSSProperties } from 'react'
import type { MotionValue } from 'motion/react'
import { accentHex } from '@/utils/accent'
import { useDepth } from '@/app/DepthContext'
import { BeatShell } from './BeatShell'

interface BeatProps {
  scrollYProgress: MotionValue<number>
}

export function BeatChoosePath({ scrollYProgress }: BeatProps) {
  // Live shared depth state (NOT local) — replaces SurfaceDeepPreview's local pattern (G4).
  const { globalDepth, setGlobalDepth } = useDepth()
  const isSurface = globalDepth === 'surface'

  const togglePillStyle = { '--toggle-active': accentHex('attention') } as CSSProperties

  return (
    <BeatShell
      beatId="choose-path"
      label="Prologue: choose your path"
      scrollYProgress={scrollYProgress}
    >
      <h2 className="font-display text-4xl font-medium tracking-[-0.01em] text-text-primary">
        Two ways to read it.
      </h2>

      <div
        role="group"
        aria-label="Reading depth"
        style={togglePillStyle}
        className="inline-flex items-center gap-0 rounded-pill border border-border bg-surface-card p-1"
      >
        <button
          type="button"
          onClick={() => setGlobalDepth('surface')}
          aria-pressed={isSurface}
          className={
            isSurface
              ? 'rounded-pill bg-(--toggle-active) px-5 py-2 font-body text-sm font-semibold text-bg-base'
              : 'rounded-pill px-5 py-2 font-body text-sm font-medium text-text-muted hover:text-text-primary'
          }
        >
          Surface
        </button>
        <button
          type="button"
          onClick={() => setGlobalDepth('deep')}
          aria-pressed={!isSurface}
          className={
            !isSurface
              ? 'rounded-pill bg-(--toggle-active) px-5 py-2 font-body text-sm font-semibold text-bg-base'
              : 'rounded-pill px-5 py-2 font-body text-sm font-medium text-text-muted hover:text-text-primary'
          }
        >
          Deep
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href="#interlude"
          data-umami-event="cta-start-explore"
          className="rounded-pill bg-accent-prompt px-6 py-3 font-body text-sm font-semibold text-bg-base"
        >
          Start with the words ↓
        </a>
        <a
          href="#prompt"
          className="rounded-pill border border-border px-6 py-3 font-body text-sm font-medium text-text-primary hover:bg-surface-card"
        >
          Skip to the mechanism
        </a>
      </div>
    </BeatShell>
  )
}
