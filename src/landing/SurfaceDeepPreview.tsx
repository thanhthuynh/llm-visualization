import { useState, type CSSProperties } from 'react'
import { accentHex } from '@/utils/accent'

type Mode = 'surface' | 'deep'

const SURFACE_BODY =
  'The model produces a probability for every possible next token. Here are the most likely few.'
const DEEP_BODY =
  'Raw logits flow through softmax to become probabilities. Temperature reshapes the distribution before sampling; top-k clips its tail.'

export function SurfaceDeepPreview() {
  const [mode, setMode] = useState<Mode>('surface')
  const isSurface = mode === 'surface'

  const togglePillStyle = {
    '--toggle-active': accentHex('attention'),
  } as CSSProperties

  return (
    <section
      id="two-paths"
      aria-labelledby="two-paths-heading"
      className="max-w-[76rem] mx-auto px-6 md:px-10 py-24 border-t border-border"
    >
      <div className="flex flex-col gap-3 mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
          PROGRESSIVE DISCLOSURE
        </p>
        <h2
          id="two-paths-heading"
          className="font-display text-4xl font-medium tracking-[-0.01em] text-text-primary"
        >
          Two ways to read it.
        </h2>
      </div>

      <div
        role="group"
        aria-label="Reading depth"
        style={togglePillStyle}
        className="inline-flex items-center gap-0 p-1 rounded-pill bg-surface-card border border-border"
      >
        <button
          type="button"
          onClick={() => setMode('surface')}
          aria-pressed={isSurface}
          className={
            isSurface
              ? 'px-5 py-2 rounded-pill bg-(--toggle-active) text-bg-base font-body font-semibold text-sm'
              : 'px-5 py-2 rounded-pill text-text-muted font-body font-medium text-sm hover:text-text-primary'
          }
        >
          Surface
        </button>
        <button
          type="button"
          onClick={() => setMode('deep')}
          aria-pressed={!isSurface}
          className={
            !isSurface
              ? 'px-5 py-2 rounded-pill bg-(--toggle-active) text-bg-base font-body font-semibold text-sm'
              : 'px-5 py-2 rounded-pill text-text-muted font-body font-medium text-sm hover:text-text-primary'
          }
        >
          Deep
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="rounded-card border border-border bg-surface-card p-6 min-h-[200px] flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
            Next-token prediction
          </p>
          <div className="flex flex-col gap-1.5 font-mono text-sm">
            {[
              ['blue', 71],
              ['clear', 6],
              ['falling', 4],
            ].map(([word, pct]) => (
              <div key={word as string} className="flex items-center gap-2">
                <span className="w-16 text-right text-text-primary">{word}</span>
                <span
                  aria-hidden="true"
                  className="h-2 rounded-sm"
                  style={{
                    width: `${(pct as number) * 1.8}px`,
                    background: accentHex('predict'),
                  }}
                />
                <span className="text-text-muted">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface-deep p-6 min-h-[200px]">
          <p
            key={mode}
            className="font-body text-base leading-relaxed text-text-primary transition-opacity duration-200"
          >
            {isSurface ? SURFACE_BODY : DEEP_BODY}
          </p>
        </div>
      </div>

      <p className="font-mono text-xs text-text-muted mt-6">
        Same scene. Different depth. You choose per-scene in the explainer.
      </p>
    </section>
  )
}
