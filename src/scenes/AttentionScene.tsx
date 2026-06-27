import { useState } from 'react'
import { SceneStation } from '@/components/SceneStation'
import { CaveatNote } from '@/components/CaveatNote'
import { DataBar } from '@/components/DataBar'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { AttentionArc } from '@/components/AttentionArc'
import { useMediaQuery } from '@/app/useMediaQuery'
import { AttentionMatrix } from '@/components/AttentionMatrix'
import { HeadSelector } from '@/components/HeadSelector'
import { getSceneById } from '@/scenes/scenes.config'
import { loadPromptDataset } from '@/data/loader'

const SCENE = getSceneById('attention')
const CAT = loadPromptDataset('cat')

const QUERY_INDEX = 5 // ' it'

const TOKEN_X: ReadonlyArray<number> = Array.from({ length: 8 }, (_, i) => 80 + i * 70 + 30)
const BASELINE_Y = 240

const SURFACE_ARCS = [
  { from: 1, label: 'cat' },
  { from: 4, label: 'because' },
  { from: 2, label: 'sat' },
  { from: 3, label: 'down' },
  { from: 0, label: 'The' },
] as const

function chipDisplay(text: string): string {
  return text.startsWith(' ') ? text.slice(1) : text
}

export function AttentionScene() {
  const [head, setHead] = useState<0 | 1 | 2>(0)
  const isCompact = useMediaQuery('(max-width: 1279px)')
  const tokens = CAT.tokens.map((t) => chipDisplay(t.text))
  const headWeights = CAT.attention.heads[head]
  const queryRow = headWeights[QUERY_INDEX]

  // Mobile-native view of the same arcs: how much "it" attends to each earlier
  // token, as horizontal bars sorted strongest-first (the arc diagram can't fit
  // 8 tokens readably in a narrow column — see the desktop SVG below).
  const mobileRows = SURFACE_ARCS.map((a) => ({ label: a.label, weight: queryRow[a.from] })).sort(
    (a, b) => b.weight - a.weight,
  )
  const topWeight = mobileRows.length > 0 ? mobileRows[0]!.weight : 0

  const stage = (
    <div
      style={{
        padding: 'var(--stage-padding)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        height: '100%',
      }}
    >
      <EyebrowLabel>Who is &ldquo;it&rdquo; looking at?</EyebrowLabel>
      {isCompact ? (
        <div className="flex flex-col">
          <p className="m-0 mb-2 font-mono text-[11px] uppercase tracking-widest text-text-muted">
            how much <span className="text-text-primary">it</span> attends to each earlier token
          </p>
          {mobileRows.map((r) => (
            <DataBar
              key={r.label}
              label={r.label}
              value={`${Math.round(r.weight * 100)}%`}
              fraction={r.weight}
              dominant={r.weight === topWeight}
              accent="attention"
            />
          ))}
        </div>
      ) : (
        <svg width={620} height={300} viewBox="0 0 620 300" aria-label="Attention arcs">
          {SURFACE_ARCS.map((a) => (
            <AttentionArc
              key={a.label}
              x1={TOKEN_X[QUERY_INDEX]}
              x2={TOKEN_X[a.from]}
              baseline={BASELINE_Y}
              weight={queryRow[a.from]}
              label={a.label}
            />
          ))}
          {tokens.map((t, i) => (
            <g key={i}>
              <rect
                x={TOKEN_X[i] - 28}
                y={BASELINE_Y - 4}
                width={56}
                height={28}
                rx={14}
                fill={
                  i === QUERY_INDEX ? 'var(--color-accent-attention)' : 'var(--color-surface-card)'
                }
                stroke="var(--color-border)"
              />
              <text
                x={TOKEN_X[i]}
                y={BASELINE_Y + 14}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={12}
                fill={i === QUERY_INDEX ? '#fff' : 'var(--color-text-primary)'}
              >
                {t}
              </text>
            </g>
          ))}
        </svg>
      )}
      <p className="m-0 font-body text-[13px] text-text-muted">
        Simplified — open Go deeper to see what&apos;s really going on.
      </p>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>Letting tokens look at each other</EyebrowLabel>
      <p className="mt-3">
        At each layer, every token can look at every earlier token and weigh how much each one
        matters for the next prediction. Above, the pronoun <em>it</em> pulls most of its
        information from <em>cat</em>.
      </p>
    </>
  )

  const deeper = (
    <div className="flex flex-col gap-4">
      <EyebrowLabel>The actual attention matrix</EyebrowLabel>
      <HeadSelector active={head} onSelect={setHead} />
      <div className="overflow-x-auto">
        <AttentionMatrix tokens={tokens} weights={headWeights} queryIndex={QUERY_INDEX} />
      </div>
      <p className="font-body text-[13px] text-text-muted">
        Darker = more attention. The upper triangle is blank — a token can only attend to itself and
        earlier tokens, never the future.
      </p>
      <div className="flex flex-col gap-1.5">
        <EyebrowLabel>Under the hood</EyebrowLabel>
        <div
          className="grid items-center gap-2 font-mono text-[13px]"
          style={{ gridTemplateColumns: 'auto auto auto' }}
        >
          <span>q·k (SCORE)</span>
          <span className="text-text-muted">→</span>
          <span>softmax (WEIGHTS)</span>
        </div>
        <div
          className="grid items-center gap-2 font-mono text-[13px]"
          style={{ gridTemplateColumns: 'auto auto auto' }}
        >
          <span>Σ w·v (BLEND VALUES)</span>
          <span className="text-text-muted">→</span>
          <span className="text-text-muted">context-aware output</span>
        </div>
      </div>
      <CaveatNote>
        Attention shows where information <em>can flow</em>, not a transparent readout of the
        model&apos;s &ldquo;understanding&rdquo;. Reading it as reasoning is contested.
      </CaveatNote>
      <CaveatNote>
        This is one head in one layer. Real models stack dozens of layers with multiple heads each,
        and the feed-forward (MLP) sublayers — which do much of the actual work — aren&apos;t
        pictured at all.
      </CaveatNote>
    </div>
  )

  return (
    <SceneStation
      id={SCENE.id}
      title={SCENE.title}
      accent="attention"
      stage={stage}
      surface={surface}
      deeper={deeper}
    />
  )
}
