import type { CSSProperties } from 'react'
import { accentHex, accentRgba } from '@/utils/accent'
import type { AccentToken } from '@/scenes/scenes.config'

interface SceneCard {
  num: string
  id: AccentToken
  label: string
  teaser: string
}

const CARDS: SceneCard[] = [
  { num: '01', id: 'prompt', label: 'Prompt', teaser: 'Everything starts with a string of characters. Nothing more.' },
  { num: '02', id: 'tokenize', label: 'Tokenize', teaser: "The text is sliced into the model's chosen pieces." },
  { num: '03', id: 'embed', label: 'Embed', teaser: 'Each token becomes a coordinate the network can do math on.' },
  { num: '04', id: 'attention', label: 'Attention', teaser: 'Tokens look at the tokens that matter, weighted by relevance.' },
  { num: '05', id: 'predict', label: 'Predict', teaser: 'A probability for every possible next token, ranked.' },
  { num: '06', id: 'decode', label: 'Decode', teaser: 'Sample one token, append it, run the loop again.' },
  { num: '07', id: 'output', label: 'Output', teaser: 'Tokens stream out until the end-of-sequence signal fires.' },
]

function Card({ card }: { card: SceneCard }) {
  // Spec §4.1: predict (#9D4EDD) FAILS contrast — accent only on top stripe + scene number alpha.
  // attention (#F72585) FAILS small text — same treatment.
  // For all others, the scene number color is the accent itself.
  const safeAsText = card.id !== 'predict' && card.id !== 'attention'
  const numberColor = safeAsText ? accentHex(card.id) : 'var(--color-text-muted)'

  const style = {
    '--card-accent': accentHex(card.id),
    '--card-hairline': accentRgba(card.id, 0.24),
    '--card-num': numberColor,
  } as CSSProperties

  return (
    <a
      href={`/explorer#${card.id}`}
      data-card={card.id}
      style={style}
      className="group relative flex flex-col gap-3 min-h-[200px] p-5 rounded-card bg-surface-card border border-(--card-hairline) hover:border-(--card-accent) transition-all duration-150 hover:-translate-y-0.5"
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-card bg-(--card-accent) group-hover:h-1 transition-all duration-150"
      />
      <span className="font-mono text-xs tracking-widest text-(--card-num) pt-1">{card.num}</span>
      <span className="font-display text-xl font-medium text-text-primary">{card.label}</span>
      <span className="font-body text-sm leading-relaxed text-text-primary/85">{card.teaser}</span>
    </a>
  )
}

function CapCard() {
  return (
    <div
      data-card="full-pipeline"
      role="presentation"
      className="flex flex-col gap-2 items-center justify-center min-h-[200px] p-5 rounded-card bg-surface-deep border border-border"
    >
      <div className="flex gap-1.5" aria-hidden="true">
        {(['prompt', 'tokenize', 'embed', 'attention', 'predict', 'decode', 'output'] as AccentToken[]).map(
          (id) => (
            <span
              key={id}
              className="block w-2 h-2 rounded-full"
              style={{ background: accentHex(id) }}
            />
          ),
        )}
      </div>
      <span className="font-mono text-xs tracking-widest text-text-muted uppercase mt-1">
        full pipeline
      </span>
    </div>
  )
}

export function SceneCardGrid() {
  return (
    <section
      id="scenes"
      aria-labelledby="scenes-heading"
      className="max-w-[76rem] mx-auto px-6 md:px-10 py-24 border-t border-border"
    >
      <div className="flex flex-col gap-3 mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
          SEVEN SCENES, ONE PIPELINE
        </p>
        <h2
          id="scenes-heading"
          className="font-display text-4xl font-medium tracking-[-0.01em] text-text-primary"
        >
          What you&apos;ll see
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map((c) => (
          <Card key={c.id} card={c} />
        ))}
        <CapCard />
      </div>
    </section>
  )
}
