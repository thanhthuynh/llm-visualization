import type { ReactNode } from 'react'
import { PlateSheet, PlateTitleRow, PlateLede, PlateFooter } from '@/components/PlateSheet'

/**
 * Plate IV — The Inference Passage.
 *
 * Seven equal flex stations on a horizontal dashed gold route: Prompt →
 * Tokenization → Embedding → Attention → Prediction → Sampling → Output.
 * Each station carries a 118×92 abstract glyph card; the terminus (Output)
 * dot and name render solid gold. Recreated 1:1 from the design reference.
 */

/** Shared 118×92 glyph-card frame (Output overrides border/fill). */
const GLYPH_CARD = 'h-[92px] w-[118px] rounded-[2px] border border-gold/16 bg-panel/30'

function PromptGlyph() {
  return (
    <div className={`${GLYPH_CARD} flex items-center p-[14px]`}>
      <div className="flex w-full flex-col gap-[8px]">
        <div className="h-[5px] w-[88%] rounded-[2px] bg-ink-bright/60" />
        <div className="h-[5px] w-[60%] rounded-[2px] bg-ink-bright/40" />
        <div className="h-[5px] w-[74%] rounded-[2px] bg-ink-bright/40" />
      </div>
    </div>
  )
}

// Token-chip widths + gold/blue alternation — illustrative — design-reference values, not measured
const TOKEN_CHIPS: ReadonlyArray<{ width: string; hue: string }> = [
  { width: 'w-[30px]', hue: 'bg-gold' },
  { width: 'w-[18px]', hue: 'bg-blue' },
  { width: 'w-[24px]', hue: 'bg-gold' },
  { width: 'w-[32px]', hue: 'bg-blue' },
  { width: 'w-[14px]', hue: 'bg-gold' },
]

function TokenizationGlyph() {
  return (
    <div className={`${GLYPH_CARD} flex items-center justify-center p-[12px]`}>
      <div className="flex flex-wrap justify-center gap-[6px]">
        {TOKEN_CHIPS.map((chip, i) => (
          <span key={i} className={`h-[15px] rounded-[3px] ${chip.width} ${chip.hue}`} />
        ))}
      </div>
    </div>
  )
}

// 4×4 embedding heat grid — illustrative — design-reference values, not measured
const EMBED_HEAT_CELLS: ReadonlyArray<string> = [
  'bg-gold/85',
  'bg-blue/55',
  'bg-gold/35',
  'bg-gold/70',
  'bg-blue/70',
  'bg-gold/50',
  'bg-gold/90',
  'bg-blue/40',
  'bg-gold/45',
  'bg-gold/75',
  'bg-blue/60',
  'bg-gold/30',
  'bg-gold/60',
  'bg-blue/50',
  'bg-gold/80',
  'bg-gold/40',
]

// 4×4 causal attention grid — illustrative — design-reference values, not measured
const ATTENTION_HEAT_CELLS: ReadonlyArray<string> = [
  'bg-gold/85',
  'bg-gold/5',
  'bg-gold/5',
  'bg-gold/5',
  'bg-gold/45',
  'bg-gold/80',
  'bg-gold/5',
  'bg-gold/5',
  'bg-gold/30',
  'bg-gold/55',
  'bg-gold/90',
  'bg-gold/5',
  'bg-gold/35',
  'bg-gold/40',
  'bg-gold/60',
  'bg-gold/85',
]

function HeatGridGlyph({ cells }: { cells: ReadonlyArray<string> }) {
  return (
    <div className={`${GLYPH_CARD} flex items-center justify-center`}>
      <div className="grid grid-cols-[repeat(4,14px)] gap-[4px]">
        {cells.map((hue, i) => (
          <span key={i} className={`h-[14px] w-[14px] rounded-[2px] ${hue}`} />
        ))}
      </div>
    </div>
  )
}

// Ranked probability bars — illustrative — design-reference values, not measured
const PREDICTION_BARS: ReadonlyArray<{ width: string; fill: string }> = [
  { width: 'w-[92%]', fill: 'bg-gold' },
  { width: 'w-[54%]', fill: 'bg-gold' },
  { width: 'w-[30%]', fill: 'bg-gold/60' },
  { width: 'w-[16%]', fill: 'bg-gold/60' },
]

function PredictionGlyph() {
  return (
    <div className={`${GLYPH_CARD} flex items-center p-[14px]`}>
      <div className="flex w-full flex-col gap-[9px]">
        {PREDICTION_BARS.map((bar, i) => (
          <div key={i} className="h-[7px] rounded-[1px] bg-gold/12">
            <div className={`h-full rounded-[1px] ${bar.width} ${bar.fill}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SamplingGlyph() {
  return (
    <div className={`${GLYPH_CARD} flex items-center p-[14px]`}>
      <div className="flex w-full flex-col gap-[9px]">
        <div className="flex items-center gap-[7px]">
          <div className="h-[7px] flex-1 rounded-[1px] bg-gold" />
          <div className="h-[7px] w-[7px] flex-none rotate-45 bg-gold" />
        </div>
        <div className="mr-[14px] h-[7px] rounded-[1px] bg-gold/18" />
        <div className="mr-[14px] h-[7px] rounded-[1px] bg-gold/18" />
        <div className="mr-[14px] h-[7px] rounded-[1px] bg-gold/18" />
      </div>
    </div>
  )
}

function OutputGlyph() {
  return (
    <div className="flex h-[92px] w-[118px] items-center rounded-[2px] border border-gold/30 bg-gold/7 p-[14px]">
      <div className="flex w-full flex-col gap-[8px]">
        <div className="h-[5px] w-[82%] rounded-[2px] bg-gold/80" />
        <div className="h-[5px] w-[66%] rounded-[2px] bg-gold/60" />
        <div className="flex items-center gap-[5px]">
          <div className="h-[5px] w-[48%] rounded-[2px] bg-gold/60" />
          <div className="h-[11px] w-[6px] bg-gold" />
        </div>
      </div>
    </div>
  )
}

interface StationProps {
  no: string
  name: string
  caption: string
  /** Terminus station: filled gold dot + gold name. */
  terminus?: boolean
  children: ReactNode
}

function Station({ no, name, caption, terminus = false, children }: StationProps) {
  return (
    <div className="z-[1] flex flex-1 flex-col items-center px-[7px]">
      <div
        className={`mb-[20px] h-[15px] w-[15px] rounded-full border-2 border-gold ${
          terminus ? 'bg-gold' : 'bg-sheet'
        }`}
      />
      <div className="font-mono text-[10px] font-medium tracking-[.1em] text-gold">{no}</div>
      <div
        className={`mt-[4px] mb-[12px] font-display text-[17px] font-medium ${
          terminus ? 'text-gold' : 'text-ink-bright'
        }`}
      >
        {name}
      </div>
      {children}
      <div className="mt-[13px] text-center font-body text-[11px] leading-[1.45] text-ink-soft">
        {caption}
      </div>
    </div>
  )
}

/** Footer-right token scale: `0 —— 100 TOKENS` over a repeating tick ruler. */
function TokenScaleBar() {
  return (
    <span className="flex items-center gap-[10px] tracking-normal text-ink-soft">
      <span>0</span>
      <span
        className="h-[6px] w-[160px] border-b border-gold"
        // Repeating-tick ruler gradient copied verbatim from the design reference.
        style={{
          background: 'repeating-linear-gradient(90deg,#d8a657 0 1px,transparent 1px 20px)',
        }}
      />
      <span>100 TOKENS</span>
    </span>
  )
}

export function PlateIV() {
  return (
    <PlateSheet label="Plate IV — Inference Passage">
      <PlateTitleRow no="PLATE IV" title="The Inference Passage" subject="PROJ. TRANSFORMER" />
      <PlateLede>
        The same route, now with a glyph at every station — a schematic of what each step does to
        the signal, before Plate IV·Detail sounds a real prompt through it.
      </PlateLede>
      <div className="mt-[18px] flex flex-1 flex-col justify-center">
        <div className="relative flex items-start">
          <div
            aria-hidden="true"
            className="absolute top-[8px] right-[6%] left-[6%] z-0 border-t border-dashed border-gold/55"
          />
          <Station no="ST. 01" name="Prompt" caption="Raw text enters the chart.">
            <PromptGlyph />
          </Station>
          <Station no="ST. 02" name="Tokenization" caption="Cut into tokens with IDs.">
            <TokenizationGlyph />
          </Station>
          <Station no="ST. 03" name="Embedding" caption="Each token becomes a vector.">
            <HeatGridGlyph cells={EMBED_HEAT_CELLS} />
          </Station>
          <Station no="ST. 04" name="Attention" caption="Tokens weigh each other.">
            <HeatGridGlyph cells={ATTENTION_HEAT_CELLS} />
          </Station>
          <Station no="ST. 05" name="Prediction" caption="Odds over the vocabulary.">
            <PredictionGlyph />
          </Station>
          <Station no="ST. 06" name="Sampling" caption="One token is drawn.">
            <SamplingGlyph />
          </Station>
          <Station no="ST. 07" name="Output" caption="Reassembled into language." terminus>
            <OutputGlyph />
          </Station>
        </div>
      </div>
      <PlateFooter left="SURVEYED MMXXVI · THE ATLAS" right={<TokenScaleBar />} />
    </PlateSheet>
  )
}
