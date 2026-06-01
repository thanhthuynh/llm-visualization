import { useState } from 'react'
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
    <div className="p-(--stage-padding) flex flex-col gap-6 h-full justify-center">
      <EyebrowLabel>Streaming the reply</EyebrowLabel>
      <div className="flex gap-2.5 flex-wrap">
        {FULL_TOKENS.map((t) => (
          <Chip key={t} variant="token">
            {chipDisplay(t)}
          </Chip>
        ))}
      </div>
      <div className="font-[family-name:--font-body] text-[13px] text-(--color-text-muted)">
        detokenize ↓
      </div>
      <ReplyBubble text={REPLY_TEXT} streaming />
      <p className="m-0 font-[family-name:--font-body] text-[13px] text-(--color-text-muted)">
        Each token becomes characters and joins the reply — you see it appear word by word.
      </p>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>From tokens to text</EyebrowLabel>
      <p className="mt-3">
        Each token becomes characters and joins the reply — you see it appear word by word.
      </p>
    </>
  )

  const toggleButtonClass = (active: boolean): string => {
    const border = active ? 'border-(--color-accent-output)' : 'border-(--color-border)'
    const bg = active
      ? 'bg-[color-mix(in_srgb,var(--color-accent-output)_16%,var(--color-surface-card))]'
      : 'bg-(--color-surface-card)'
    return `px-3 py-1.5 rounded-(--radius-pill) border ${border} ${bg} text-(--color-text-primary) font-[family-name:--font-body] font-semibold text-[13px] cursor-pointer min-h-[44px]`
  }

  const deeper = (
    <div className="flex flex-col gap-4">
      <EyebrowLabel>Detokenize chain</EyebrowLabel>
      <div
        className="grid items-center gap-2 font-[family-name:--font-mono] text-sm"
        style={{ gridTemplateColumns: 'auto auto auto auto auto' }}
      >
        <span className="text-(--color-text-muted)">TOKEN ID</span>
        <span className="text-(--color-text-muted)">→</span>
        <span className="text-(--color-text-muted)">BYTES</span>
        <span className="text-(--color-text-muted)">→</span>
        <span className="text-(--color-text-muted)">TEXT</span>

        <span>318</span>
        <span className="text-(--color-text-muted)">→</span>
        <span>{dataset.bytes[' blue']}</span>
        <span className="text-(--color-text-muted)">→</span>
        <span>blue</span>
      </div>
      <div className="flex flex-col gap-2">
        <EyebrowLabel>View</EyebrowLabel>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView('text')}
            aria-pressed={view === 'text'}
            className={toggleButtonClass(view === 'text')}
          >
            as text
          </button>
          <button
            type="button"
            onClick={() => setView('tokens')}
            aria-pressed={view === 'tokens'}
            className={toggleButtonClass(view === 'tokens')}
          >
            as tokens
          </button>
        </div>
        {view === 'text' ? (
          <div
            data-testid="assembly-text-view"
            className="px-4 py-3 bg-(--color-surface-card) border border-(--color-border) rounded-(--radius-card) font-[family-name:--font-body] text-[15px]"
          >
            {REPLY_TEXT}
          </div>
        ) : (
          <div
            data-testid="assembly-tokens-view"
            className="grid gap-x-3 gap-y-1.5 font-[family-name:--font-mono] text-[13px]"
            style={{ gridTemplateColumns: 'repeat(3, max-content)' }}
          >
            {dataset.tokens.map((t) => (
              <div key={t.id} className="contents">
                <span>{chipDisplay(t.text)}</span>
                <span className="text-(--color-text-muted)">→</span>
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
