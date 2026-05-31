import { useState } from 'react'
import { SceneStation } from '@/components/SceneStation'
import { CaveatNote } from '@/components/CaveatNote'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { AttentionArc } from '@/components/AttentionArc'
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
  const tokens = CAT.tokens.map((t) => chipDisplay(t.text))
  const headWeights = CAT.attention.heads[head]
  const queryRow = headWeights[QUERY_INDEX]

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
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--color-text-muted)',
          margin: 0,
        }}
      >
        Simplified — open Go deeper to see what&apos;s really going on.
      </p>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>Letting tokens look at each other</EyebrowLabel>
      <p style={{ marginTop: 12 }}>
        At each layer, every token can look at every earlier token and weigh how much each one
        matters for the next prediction. Above, the pronoun <em>it</em> pulls most of its
        information from <em>cat</em>.
      </p>
    </>
  )

  const deeper = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <EyebrowLabel>The actual attention matrix</EyebrowLabel>
      <HeadSelector active={head} onSelect={setHead} />
      <div style={{ overflowX: 'auto' }}>
        <AttentionMatrix tokens={tokens} weights={headWeights} queryIndex={QUERY_INDEX} />
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)' }}>
        Darker = more attention. The upper triangle is blank — a token can only attend to itself
        and earlier tokens, never the future.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <EyebrowLabel>Under the hood</EyebrowLabel>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto auto',
            gap: 8,
            alignItems: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
          }}
        >
          <span>q·k (SCORE)</span>
          <span style={{ color: 'var(--color-text-muted)' }}>→</span>
          <span>softmax (WEIGHTS)</span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto auto',
            gap: 8,
            alignItems: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
          }}
        >
          <span>Σ w·v (BLEND VALUES)</span>
          <span style={{ color: 'var(--color-text-muted)' }}>→</span>
          <span style={{ color: 'var(--color-text-muted)' }}>context-aware output</span>
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
