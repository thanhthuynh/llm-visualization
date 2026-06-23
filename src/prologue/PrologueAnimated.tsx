import { useCallback, useEffect, useRef, type CSSProperties } from 'react'
import { useBeatProgress } from './useBeatProgress'
import { BeatHook } from './beats/BeatHook'
import { BeatTokenize } from './beats/BeatTokenize'
import { BeatEmbed } from './beats/BeatEmbed'
import { BeatAttention } from './beats/BeatAttention'
import { BeatPredictOutput } from './beats/BeatPredictOutput'
import { BeatProvenanceVow } from './beats/BeatProvenanceVow'
import { BeatChoosePath } from './beats/BeatChoosePath'

/** First real station the "Skip intro" affordance jumps to. */
const SKIP_TARGET = '#interlude'

/**
 * The cinematic prologue: a tall, non-snapping scroll track whose sticky stage
 * pins one full-viewport frame while seven beats cross-fade with scroll
 * progress. Beats animate opacity + transform only (perf gate). A "Skip intro"
 * affordance (and the Esc key) jumps to the first real station.
 *
 * This component is intentionally NOT wired into App.tsx yet (Task 4.3 owns the
 * mount + landing-file removal); it is built and tested in isolation here.
 */
export function PrologueAnimated() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useBeatProgress(trackRef)

  const skip = useCallback(() => {
    const target = document.querySelector(SKIP_TARGET)
    if (target) {
      target.scrollIntoView({ behavior: 'auto', block: 'start' })
    } else {
      // Fallback when the station isn't mounted (isolation): set the hash.
      window.location.hash = SKIP_TARGET
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [skip])

  // Safari watch-items the Phase-0 spike validated: keep ONLY on the sticky stage.
  const stageStyle: CSSProperties = {
    willChange: 'transform',
    contain: 'layout paint',
  }

  return (
    <>
      <div ref={trackRef} className="prologue-track relative min-h-[450vh]">
        <div style={stageStyle} className="sticky top-0 h-screen w-full overflow-hidden bg-bg-base">
          <a
            href={SKIP_TARGET}
            onClick={(e) => {
              e.preventDefault()
              skip()
            }}
            className="absolute right-6 top-6 z-10 rounded-pill border border-border bg-surface-card/80 px-4 py-2 font-mono text-xs text-text-muted hover:text-text-primary"
          >
            Skip intro
          </a>

          <BeatHook scrollYProgress={scrollYProgress} />
          <BeatTokenize scrollYProgress={scrollYProgress} />
          <BeatEmbed scrollYProgress={scrollYProgress} />
          <BeatAttention scrollYProgress={scrollYProgress} />
          <BeatPredictOutput scrollYProgress={scrollYProgress} />
          <BeatProvenanceVow scrollYProgress={scrollYProgress} />
          <BeatChoosePath scrollYProgress={scrollYProgress} />
        </div>
      </div>
      <div className="prologue-end-sentinel" aria-hidden="true" />
    </>
  )
}
