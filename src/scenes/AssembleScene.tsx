import { useState, type CSSProperties } from 'react'
import { SceneStation } from '@/components/SceneStation'
import { Chip } from '@/components/Chip'
import { CaveatNote } from '@/components/CaveatNote'
import { ReplyBubble } from '@/components/ReplyBubble'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { useRunningExample } from '@/app/RunningExampleContext'
import { getSceneById } from '@/scenes/scenes.config'

const SCENE = getSceneById('output')
const REPLY_TEXT = 'The sky is blue'
const FULL_TOKENS = ['The', ' sky', ' is', ' blue'] as const

function chipDisplay(text: string): string {
  return text.startsWith(' ') ? `·${text.slice(1)}` : text
}

export function AssembleScene() {
  const { dataset } = useRunningExample()
  const [view, setView] = useState<'text' | 'tokens'>('text')

  const stage = (
    <div
      style={{
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <EyebrowLabel>Streaming the reply</EyebrowLabel>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {FULL_TOKENS.map((t) => (
          <Chip key={t} variant="token">
            {chipDisplay(t)}
          </Chip>
        ))}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--color-text-muted)',
        }}
      >
        detokenize ↓
      </div>
      <ReplyBubble text={REPLY_TEXT} streaming />
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--color-text-muted)',
          margin: 0,
        }}
      >
        Each token becomes characters and joins the reply — you see it appear word by word.
      </p>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>From tokens to text</EyebrowLabel>
      <p style={{ marginTop: 12 }}>
        Each token becomes characters and joins the reply — you see it appear word by word.
      </p>
    </>
  )

  const toggleButtonStyle = (active: boolean): CSSProperties => ({
    padding: '6px 12px',
    borderRadius: 'var(--radius-pill)',
    border: `1px solid ${active ? 'var(--color-accent-output)' : 'var(--color-border)'}`,
    background: active
      ? 'color-mix(in srgb, var(--color-accent-output) 16%, var(--color-surface-card))'
      : 'var(--color-surface-card)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    minHeight: 44,
  })

  const deeper = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <EyebrowLabel>Detokenize chain</EyebrowLabel>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto auto auto auto auto',
          gap: 8,
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
        }}
      >
        <span style={{ color: 'var(--color-text-muted)' }}>TOKEN ID</span>
        <span style={{ color: 'var(--color-text-muted)' }}>→</span>
        <span style={{ color: 'var(--color-text-muted)' }}>BYTES</span>
        <span style={{ color: 'var(--color-text-muted)' }}>→</span>
        <span style={{ color: 'var(--color-text-muted)' }}>TEXT</span>

        <span>318</span>
        <span style={{ color: 'var(--color-text-muted)' }}>→</span>
        <span>{dataset.bytes[' blue']}</span>
        <span style={{ color: 'var(--color-text-muted)' }}>→</span>
        <span>blue</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <EyebrowLabel>View</EyebrowLabel>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setView('text')}
            aria-pressed={view === 'text'}
            style={toggleButtonStyle(view === 'text')}
          >
            as text
          </button>
          <button
            type="button"
            onClick={() => setView('tokens')}
            aria-pressed={view === 'tokens'}
            style={toggleButtonStyle(view === 'tokens')}
          >
            as tokens
          </button>
        </div>
        {view === 'text' ? (
          <div
            data-testid="assembly-text-view"
            style={{
              padding: '12px 16px',
              background: 'var(--color-surface-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-card)',
              fontFamily: 'var(--font-body)',
              fontSize: 15,
            }}
          >
            {REPLY_TEXT}
          </div>
        ) : (
          <div
            data-testid="assembly-tokens-view"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, max-content)',
              columnGap: 12,
              rowGap: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
            }}
          >
            {dataset.tokens.map((t) => (
              <div key={t.id} style={{ display: 'contents' }}>
                <span>{chipDisplay(t.text)}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>→</span>
                <span>{t.id}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <p>
        Tokens are sent as they&apos;re generated, so text appears live. They can also be returned
        all at once when complete.
      </p>
      <CaveatNote>
        The model commits one token at a time. It isn&apos;t reading from a stored outline — the
        next token is always a fresh decision based on everything written so far.
      </CaveatNote>
    </div>
  )

  return (
    <SceneStation
      id={SCENE.id}
      title={SCENE.title}
      accent="output"
      stage={stage}
      surface={surface}
      deeper={deeper}
    />
  )
}
