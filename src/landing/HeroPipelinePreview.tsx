import { useEffect, useState, type CSSProperties, type ReactElement } from 'react'
import { accentHex, accentRgba } from '@/utils/accent'
import type { AccentToken } from '@/scenes/scenes.config'
import { useReducedMotionPref } from '@/app/useReducedMotionPref'

interface HeroPipelinePreviewProps {
  reducedMotion?: boolean
}

interface Frame {
  accent: AccentToken
  caption: string
  render: () => ReactElement
}

function Pill({
  accent,
  children,
  dim = false,
}: {
  accent: AccentToken
  children: string
  dim?: boolean
}) {
  const style = {
    '--pill-color': accentHex(accent),
    '--pill-bg': accentRgba(accent, dim ? 0.06 : 0.16),
    '--pill-border': accentRgba(accent, dim ? 0.3 : 0.7),
  } as CSSProperties
  return (
    <span
      style={style}
      className="inline-flex items-center px-3 py-1.5 rounded-pill border border-(--pill-border) bg-(--pill-bg) text-(--pill-color) font-mono text-sm"
    >
      {children}
    </span>
  )
}

const FRAME_COUNT = 7
const FRAME_DURATION_MS = 1057

const FRAMES: Frame[] = [
  {
    accent: 'prompt',
    caption: 'prompt',
    render: () => (
      <div className="flex justify-center items-center h-full">
        <Pill accent="prompt">&quot;The sky is&quot;</Pill>
      </div>
    ),
  },
  {
    accent: 'tokenize',
    caption: 'tokenize',
    render: () => (
      <div className="flex flex-wrap justify-center items-center gap-2 h-full">
        <Pill accent="tokenize">The</Pill>
        <Pill accent="tokenize"> sky</Pill>
        <Pill accent="tokenize"> is</Pill>
      </div>
    ),
  },
  {
    accent: 'embed',
    caption: 'embed → 768d vector',
    render: () => (
      <div className="flex flex-col items-center justify-center gap-3 h-full">
        <div className="flex gap-3">
          {['The', ' sky', ' is'].map((t) => (
            <div key={t} className="flex flex-col items-center gap-1.5">
              <Pill accent="embed" dim>
                {t}
              </Pill>
              <div className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="block w-1 h-4 rounded-sm"
                    style={{
                      background: accentRgba('embed', 0.4 + i * 0.12),
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="font-mono text-xs text-text-muted">→ 768d vector</p>
      </div>
    ),
  },
  {
    accent: 'attention',
    caption: 'attention',
    render: () => (
      <div className="flex flex-col items-center justify-center gap-3 h-full">
        <div className="flex gap-3 items-center">
          <Pill accent="attention" dim>
            The
          </Pill>
          <Pill accent="attention" dim>
            {' sky'}
          </Pill>
          <Pill accent="attention">{' is'}</Pill>
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 200 40"
          className="w-48 h-10"
          fill="none"
          stroke={accentHex('attention')}
          strokeWidth="1.5"
        >
          <path d="M 175 5 Q 100 35 100 5" />
          <path d="M 175 5 Q 50 40 30 5" />
        </svg>
      </div>
    ),
  },
  {
    accent: 'predict',
    caption: 'predict',
    render: () => (
      <div className="flex flex-col items-center justify-center gap-1.5 h-full font-mono text-xs">
        {[
          ['blue', 47],
          ['clear', 18],
          ['falling', 9],
          ['the', 6],
          ['a', 4],
        ].map(([word, pct]) => (
          <div key={word as string} className="flex items-center gap-2 w-44">
            <span className="text-text-primary w-14 text-right">{word}</span>
            <span
              aria-hidden="true"
              className="h-2 rounded-sm"
              style={{
                width: `${(pct as number) * 1.6}px`,
                background: accentHex('predict'),
              }}
            />
            <span className="text-text-muted">{pct as number}%</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    accent: 'decode',
    caption: 'decode → blue',
    render: () => (
      <div className="flex flex-col items-center justify-center gap-3 h-full">
        <p className="font-mono text-xs text-text-muted">decode →</p>
        <Pill accent="decode">blue</Pill>
      </div>
    ),
  },
  {
    accent: 'output',
    caption: 'output',
    render: () => (
      <div className="flex justify-center items-center h-full">
        <Pill accent="output">&quot;The sky is blue&quot;</Pill>
      </div>
    ),
  },
]

export function HeroPipelinePreview({
  reducedMotion: reducedMotionProp,
}: HeroPipelinePreviewProps) {
  const systemReduced = useReducedMotionPref()
  const reducedMotion = reducedMotionProp ?? systemReduced
  const [frameIdx, setFrameIdx] = useState(reducedMotion ? FRAME_COUNT - 1 : 0)

  useEffect(() => {
    if (reducedMotion) {
      setFrameIdx(FRAME_COUNT - 1)
      return
    }
    const id = window.setInterval(() => {
      setFrameIdx((i) => (i + 1) % FRAME_COUNT)
    }, FRAME_DURATION_MS)
    return () => window.clearInterval(id)
  }, [reducedMotion])

  const frame = FRAMES[frameIdx]
  if (!frame) return null

  return (
    <div
      role="img"
      aria-label="Pipeline preview: a prompt becoming an answer through seven stages"
      className="relative w-full h-[360px] rounded-card border border-border bg-surface-deep overflow-hidden flex flex-col"
    >
      <div className="flex-1 px-6 py-4">{frame.render()}</div>
      <div className="px-4 py-2 border-t border-border flex items-center justify-between text-xs">
        <span className="font-mono text-text-muted">
          {reducedMotion ? 'One pass through the pipeline.' : frame.caption}
        </span>
        <span className="flex gap-1" aria-hidden="true">
          {FRAMES.map((f, i) => (
            <span
              key={i}
              className="block w-1.5 h-1.5 rounded-full"
              style={{
                background: i === frameIdx ? accentHex(f.accent) : 'var(--color-rail-inactive)',
              }}
            />
          ))}
        </span>
      </div>
    </div>
  )
}
