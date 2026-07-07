import { Fragment, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { PlateSheet, PlateTitleRow, PlateFooter } from '@/components/PlateSheet'
import { computeNextToken } from '@/plates/nextToken'
import type { Decoding, NextTokenResult } from '@/plates/nextToken'

/**
 * Plate IV·Detail — The Passage, Sounded.
 *
 * The inference passage run with a real prompt ("What is a token?") across
 * seven positioned cards on a 1088×586 canvas, joined by one dashed gold
 * polyline. The temperature / top-p / decode controls live-recompute the
 * Prediction and Sampling cards via the pure `computeNextToken` math.
 * Recreated 1:1 from the design reference.
 */

// Worked-example tokenization — illustrative — design-reference values, not measured
const WORKED_TOKENS: ReadonlyArray<{ text: string; id: string; hue: string }> = [
  { text: 'What', id: '3923', hue: 'bg-gold' },
  { text: 'is', id: '374', hue: 'bg-blue' },
  { text: 'a', id: '264', hue: 'bg-gold' },
  { text: 'token', id: '4037', hue: 'bg-blue' },
  { text: '?', id: '30', hue: 'bg-gold' },
]

// Embedding strip, first 32 dims — illustrative — design-reference values, not measured
const EMBED_DIM_BARS: ReadonlyArray<string> = [
  'bg-gold/79',
  'bg-gold/71',
  'bg-blue/45',
  'bg-blue/91',
  'bg-blue/15',
  'bg-gold/87',
  'bg-gold/57',
  'bg-blue/61',
  'bg-blue/85',
  'bg-gold/19',
  'bg-gold/91',
  'bg-gold/41',
  'bg-blue/73',
  'bg-blue/76',
  'bg-gold/37',
  'bg-gold/92',
  'bg-gold/24',
  'bg-blue/83',
  'bg-blue/64',
  'bg-gold/53',
  'bg-gold/88',
  'bg-blue/10',
  'bg-blue/89',
  'bg-blue/49',
  'bg-gold/67',
  'bg-gold/81',
  'bg-blue/28',
  'bg-blue/92',
  'bg-blue/33',
  'bg-gold/79',
  'bg-gold/71',
  'bg-blue/45',
]

const ATTENTION_COLS: ReadonlyArray<string> = ['Wh', 'is', 'a', 'tk', '?']

// 5×5 causal attention weights — illustrative — design-reference values, not measured
const ATTENTION_ROWS: ReadonlyArray<{ label: string; cells: ReadonlyArray<string> }> = [
  { label: 'Wh', cells: ['bg-gold/94', 'bg-gold/4', 'bg-gold/4', 'bg-gold/4', 'bg-gold/4'] },
  { label: 'is', cells: ['bg-gold/44', 'bg-gold/64', 'bg-gold/4', 'bg-gold/4', 'bg-gold/4'] },
  { label: 'a', cells: ['bg-gold/27', 'bg-gold/36', 'bg-gold/58', 'bg-gold/4', 'bg-gold/4'] },
  { label: 'tk', cells: ['bg-gold/24', 'bg-gold/37', 'bg-gold/35', 'bg-gold/40', 'bg-gold/4'] },
  { label: '?', cells: ['bg-gold/23', 'bg-gold/23', 'bg-gold/23', 'bg-gold/36', 'bg-gold/45'] },
]

interface DetailCardProps {
  station: string
  name: string
  /** Absolute position + size on the 1088×586 canvas. */
  placement: string
  /** Terminus station: filled gold dot. */
  terminus?: boolean
  children: ReactNode
}

function DetailCard({ station, name, placement, terminus = false, children }: DetailCardProps) {
  return (
    <div
      className={`absolute z-[1] overflow-hidden rounded-[3px] border border-gold/22 bg-panel/40 px-[16px] py-[14px] ${placement}`}
    >
      <div className="mb-[9px] flex items-center gap-[9px]">
        <span
          className={`h-[11px] w-[11px] flex-none rounded-full border-2 border-gold ${
            terminus ? 'bg-gold' : ''
          }`}
        />
        <span className="font-mono text-[10px] font-medium tracking-[.1em] text-gold">
          {station}
        </span>
        <span className="font-display text-[16px] font-medium text-ink-bright">{name}</span>
      </div>
      {children}
    </div>
  )
}

function PredictionRows({ rows }: { rows: NextTokenResult['rows'] }) {
  return (
    <div className="flex flex-col gap-[7px]">
      {rows.map((row) => (
        <div key={row.tok} className="flex items-center gap-[10px]">
          <span
            className={`w-[56px] font-mono text-[11px] font-medium ${
              row.inNucleus ? 'text-ink-bright' : 'text-ink-dim'
            }`}
          >
            {row.tok}
          </span>
          <span className="h-[8px] max-w-[260px] flex-1 overflow-hidden rounded-[1px] bg-gold/10">
            <span
              className={`block h-full ${row.inNucleus ? 'bg-gold' : 'bg-gold/22'}`}
              // Runtime-computed bar width (p / p_max).
              style={{ width: row.barWidth }}
            />
          </span>
          <span
            className={`w-[30px] text-right font-mono text-[10px] ${
              row.inNucleus ? 'text-ink-bright' : 'text-ink-dim'
            }`}
          >
            {row.pStr}
          </span>
        </div>
      ))}
    </div>
  )
}

interface DecodeChipProps {
  mode: Decoding
  current: Decoding
  onSelect: (mode: Decoding) => void
}

function DecodeChip({ mode, current, onSelect }: DecodeChipProps) {
  const selected = mode === current
  return (
    <button
      type="button"
      aria-pressed={selected}
      data-umami-event="cta-decode-control"
      data-umami-event-mode={mode}
      onClick={() => onSelect(mode)}
      className={`cursor-pointer rounded-[2px] border px-[11px] py-[5px] font-mono text-[10px] font-medium tracking-[.1em] ${
        selected
          ? 'border-gold bg-gold text-sheet'
          : 'border-ink-nav/35 bg-transparent text-ink-muted'
      }`}
    >
      {mode.toUpperCase()}
    </button>
  )
}

export function PlateIVDetail() {
  const [temperature, setTemperature] = useState(0.7)
  const [topP, setTopP] = useState(0.95)
  const [decoding, setDecoding] = useState<Decoding>('Sampling')

  const result = computeNextToken(temperature, topP, decoding)

  const handleTemperature = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value)
    if (Number.isFinite(next)) setTemperature(next)
  }
  const handleTopP = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value)
    if (Number.isFinite(next)) setTopP(next)
  }

  return (
    <PlateSheet label="Plate IV — In Detail" contentClassName="px-[54px] py-[38px]">
      <PlateTitleRow
        no="PLATE IV · DETAIL"
        title="The Passage, Sounded"
        subject="EXAMPLE · 1 PROMPT"
        titleClassName="text-[28px]"
        className="pb-[16px]"
      />
      <p className="mt-[12px] mb-[10px] text-center font-body text-[13px] leading-[1.5] text-ink-body">
        One prompt — <span className="text-ink-bright italic">“What is a token?”</span> — charted
        across all seven stations at once. Tune <span className="text-ink-bright">temperature</span>
        , <span className="text-ink-bright">top-p</span>, and{' '}
        <span className="text-ink-bright">decoding</span> to watch stations 05–06 respond.
      </p>

      <div className="mb-[12px] flex items-center justify-center gap-[30px]">
        <div className="flex items-center gap-[10px]">
          <span className="font-mono text-[10px] font-medium tracking-[.14em] text-ink-muted">
            TEMPERATURE
          </span>
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.05}
            value={temperature}
            onChange={handleTemperature}
            aria-label="Temperature"
            className="h-[14px] w-[150px] accent-gold"
          />
          <span className="w-[36px] font-mono text-[11px] font-medium text-gold">
            {result.tempStr}
          </span>
        </div>
        <div className="flex items-center gap-[10px]">
          <span className="font-mono text-[10px] font-medium tracking-[.14em] text-ink-muted">
            TOP-P
          </span>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={topP}
            onChange={handleTopP}
            aria-label="Top-p"
            className="h-[14px] w-[120px] accent-gold"
          />
          <span className="w-[36px] font-mono text-[11px] font-medium text-gold">
            {result.topPStr}
          </span>
        </div>
        <div className="flex items-center gap-[8px]">
          <span className="font-mono text-[10px] font-medium tracking-[.14em] text-ink-muted">
            DECODE
          </span>
          <DecodeChip mode="Sampling" current={decoding} onSelect={setDecoding} />
          <DecodeChip mode="Greedy" current={decoding} onSelect={setDecoding} />
        </div>
      </div>

      <div className="relative h-[586px] w-[1088px]">
        <svg
          viewBox="0 0 1088 586"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full"
        >
          <polyline
            points="125,58 472,58 891,58 780,293 290,293 215,528 777,528"
            fill="none"
            className="stroke-gold"
            strokeWidth="1.5"
            strokeDasharray="2 7"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>

        <DetailCard station="ST. 01" name="Prompt" placement="left-0 top-0 h-[116px] w-[250px]">
          <div className="font-mono text-[14px] font-medium text-ink-bright">
            {'"What is a token?"'}
          </div>
          <div className="mt-[6px] font-mono text-[10px] text-ink-muted">raw input · 18 chars</div>
        </DetailCard>

        <DetailCard
          station="ST. 02"
          name="Tokenization"
          placement="left-[286px] top-0 h-[116px] w-[372px]"
        >
          <div className="flex items-start gap-[8px]">
            {WORKED_TOKENS.map((token) => (
              <span key={token.id} className="inline-flex flex-col items-center gap-[4px]">
                <span
                  className={`rounded-[3px] px-[9px] py-[4px] font-mono text-[12px] font-medium text-sheet ${token.hue}`}
                >
                  {token.text}
                </span>
                <span className="font-mono text-[9px] text-ink-muted">{token.id}</span>
              </span>
            ))}
          </div>
        </DetailCard>

        <DetailCard
          station="ST. 03"
          name="Embedding"
          placement="left-[694px] top-0 h-[116px] w-[394px]"
        >
          <div className="flex items-center gap-[2px]">
            {EMBED_DIM_BARS.map((hue, i) => (
              <span key={i} className={`h-[18px] w-[9px] rounded-[1px] ${hue}`} />
            ))}
          </div>
          <div className="mt-[7px] font-mono text-[9px] text-ink-muted">
            first 32 of 4096 dims · <span className="text-gold">+</span>/
            <span className="text-blue">−</span>
          </div>
        </DetailCard>

        <DetailCard
          station="ST. 04"
          name="Attention"
          placement="left-[600px] top-[168px] h-[250px] w-[360px]"
        >
          <div className="mt-[-3px] mb-[12px] font-mono text-[10px] text-ink-muted">
            tokens weigh each other
          </div>
          <div className="inline-grid grid-cols-[30px_repeat(5,18px)] items-center gap-[4px]">
            <span />
            {ATTENTION_COLS.map((col) => (
              <span key={col} className="text-center font-mono text-[9px] text-ink-muted">
                {col}
              </span>
            ))}
            {ATTENTION_ROWS.map((row) => (
              <Fragment key={row.label}>
                <span className="pr-[3px] text-right font-mono text-[9px] text-ink-soft">
                  {row.label}
                </span>
                {row.cells.map((hue, i) => (
                  <span key={i} className={`h-[18px] w-[18px] rounded-[2px] ${hue}`} />
                ))}
              </Fragment>
            ))}
          </div>
          <div className="mt-[11px] font-mono text-[9px] text-ink-muted">
            rows attend to columns · causal mask
          </div>
        </DetailCard>

        <DetailCard
          station="ST. 05"
          name="Prediction"
          placement="left-[70px] top-[168px] h-[250px] w-[440px]"
        >
          <div className="mt-[-3px] mb-[12px] font-mono text-[10px] text-ink-muted">
            odds over the vocabulary · <span className="text-gold">{result.decodeStr}</span>
          </div>
          <PredictionRows rows={result.rows} />
          <div className="mt-[11px] font-mono text-[9px] text-ink-muted">{result.nucleusNote}</div>
        </DetailCard>

        <DetailCard
          station="ST. 06"
          name="Sampling"
          placement="left-0 top-[470px] h-[116px] w-[430px]"
        >
          <div className="font-mono text-[13px] font-medium text-ink-bright">
            {`T = ${result.tempStr} \u00A0 top-p = ${result.topPStr} \u00A0 `}
            <span className="text-gold">{`→ drawn: ${result.drawnTok}`}</span>
          </div>
          <div className="mt-[6px] font-mono text-[10px] text-ink-muted">{result.nucleusNote}</div>
        </DetailCard>

        <DetailCard
          station="ST. 07"
          name="Output"
          placement="left-[466px] top-[470px] h-[116px] w-[622px]"
          terminus
        >
          <div className="flex items-center gap-[16px]">
            <div className="flex-1 border-l-2 border-gold pl-[13px] font-body text-[14px] leading-[1.45] text-ink-bright">
              {
                '"A token is the smallest unit of text a model reads — about four characters of English."'
              }
            </div>
            <div className="flex-none text-right">
              <div className="font-mono text-[12px] font-medium text-gold">{result.drawnTok}</div>
              <div className="font-mono text-[9px] text-ink-muted">first token · 84 t/s</div>
            </div>
          </div>
        </DetailCard>

        <div className="absolute top-[285px] left-[516px] z-[1] bg-sheet px-[6px] py-[1px] font-mono text-[9px] tracking-[.1em] text-ink-muted">
          logits
        </div>
      </div>

      <PlateFooter
        className="mt-auto border-t border-gold/30 pt-[14px]"
        left="WORKED EXAMPLE · THE ATLAS"
        right="REPEATS ONCE PER TOKEN GENERATED"
      />
    </PlateSheet>
  )
}
