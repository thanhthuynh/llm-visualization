import { Fragment } from 'react'
import { PlateSheet } from '@/components/PlateSheet'
import { RouteLink } from '@/components/RouteLink'
import type { SectionId } from '@/plates/plates.config'

/**
 * Chart No. 00 — the Colophon (About). Hero-variant sheet: premise + chart
 * legend on the left, colophon card + edition index on the right. All copy
 * transcribed verbatim from the design reference
 * (the design handoff (kept in maintainer notes), `#about`).
 */

const CHART_LEGEND: ReadonlyArray<{ symbol: string; gloss: string }> = [
  { symbol: '◦ STATION', gloss: 'A single concept, fixed at a coordinate.' },
  { symbol: '— ROUTE', gloss: 'The path a process follows, stage to stage.' },
  { symbol: '◇ TERMINUS', gloss: "Where a route ends — the model's reply." },
  { symbol: 'DISTANCE', gloss: 'On Plate III, nearness means similarity.' },
  { symbol: 'SOUNDINGS', gloss: 'Depths and budgets are measured in tokens.' },
]

const COLOPHON_ROWS: ReadonlyArray<{ label: string; lines: ReadonlyArray<string> }> = [
  { label: 'TYPEFACES', lines: ['Fraunces · Hanken', 'Spline Sans Mono'] },
  { label: 'PROJECTION', lines: ['Transformer'] },
  { label: 'VOLUMES', lines: ['I Foundations', 'II Agents'] },
  { label: 'SOUNDINGS', lines: ['Tokens'] },
  { label: 'EDITION', lines: ['First · MMXXVI'] },
  { label: 'CARTOGRAPHY', lines: ['The Atlas'] },
]

interface EditionRow {
  to: SectionId
  plateRef: string
  title: string
}

const EDITION_GROUPS: ReadonlyArray<{ caption: string; rows: ReadonlyArray<EditionRow> }> = [
  {
    caption: 'VOLUME I · FOUNDATIONS',
    rows: [
      { to: 'plate-i', plateRef: 'PL. I', title: 'The Boundaries of Memory' },
      { to: 'plate-ii', plateRef: 'PL. II', title: 'Standing Orders' },
      { to: 'plate-iii', plateRef: 'PL. III', title: 'Bearings from Afar' },
      { to: 'plate-iv', plateRef: 'PL. IV', title: 'The Inference Passage' },
    ],
  },
  {
    caption: 'VOLUME II · AGENTS',
    rows: [
      { to: 'plate-v', plateRef: 'PL. V', title: 'The Self-Directed Survey' },
      { to: 'plate-vi', plateRef: 'PL. VI', title: 'The Scouting Party' },
      { to: 'plate-vii', plateRef: 'PL. VII', title: 'The Circuit' },
    ],
  },
]

const GAZETTEER_ROW: EditionRow = { to: 'gazetteer', plateRef: 'APP.', title: 'Gazetteer of Terms' }

function EditionIndexRow({ row, last = false }: { row: EditionRow; last?: boolean }) {
  return (
    <RouteLink
      to={row.to}
      className={`flex items-baseline gap-[14px] border-t border-ink-nav/18 py-[8px] ${
        last ? 'border-b' : ''
      }`}
    >
      <span className="w-[54px] flex-none font-mono text-[10px] font-medium text-gold">
        {row.plateRef}
      </span>
      <span className="font-display text-[14px] text-ink-bright">{row.title}</span>
    </RouteLink>
  )
}

export function ColophonPlate() {
  return (
    <PlateSheet label="About" variant="hero" contentClassName="px-[56px] pt-[46px] pb-[44px]">
      <div className="mt-[42px]">
        <div className="mb-[18px] font-mono text-[12px] font-medium tracking-[.24em] text-gold">
          CHART NO. 00 — THE COLOPHON
        </div>
        <h1 className="font-display text-[56px] leading-[1.04] font-semibold tracking-[-.015em] text-ink-display">
          About the <span className="font-normal text-gold italic">Atlas</span>
        </h1>
      </div>

      <div className="mt-[26px] grid flex-1 grid-cols-[1.55fr_1fr] gap-[64px]">
        <div>
          <p className="mb-[30px] max-w-[620px] font-body text-[17px] leading-[1.6] text-ink-body">
            The Atlas treats a language model as territory — a place that can be surveyed, charted,
            and walked. Each concept becomes a plate; each process, a route. The aim is simple: to
            make the unseen machinery of an LLM legible to anyone willing to read a map. Two volumes
            chart the territory — the foundations of a single response, and the agents built upon
            them.
          </p>
          <div className="mb-[14px] font-mono text-[11px] font-medium tracking-[.14em] text-gold">
            THE PREMISE
          </div>
          <p className="mb-[30px] max-w-[580px] font-body text-[14.5px] leading-[1.62] text-ink-body">
            Most explanations of language models reach for mathematics or metaphor and stop. We
            borrow the conventions of the nautical chart instead — coordinates, soundings, bearings,
            legends — because they were built for exactly this problem: rendering a vast, invisible
            space in a form the eye can hold. A context window has boundaries. A retrieval has
            bearings. Inference has a passage. The map is not the model, but it is a faithful guide
            to it.
          </p>
          <div className="mb-[16px] font-mono text-[11px] font-medium tracking-[.14em] text-gold">
            HOW TO READ THESE CHARTS
          </div>
          <div className="flex max-w-[560px] flex-col gap-[12px]">
            {CHART_LEGEND.map((row) => (
              <div key={row.symbol} className="flex items-baseline gap-[14px]">
                <span className="w-[98px] flex-none font-mono text-[13px] font-medium whitespace-nowrap text-gold">
                  {row.symbol}
                </span>
                <span className="font-body text-[13.5px] leading-[1.5] text-ink-soft">
                  {row.gloss}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[24px]">
          <div className="rounded-[2px] border border-gold/30 p-[22px]">
            <div className="mb-[16px] font-mono text-[11px] font-medium tracking-[.14em] text-gold">
              COLOPHON
            </div>
            <div className="flex flex-col gap-[11px] font-mono text-[11.5px] tracking-[.04em] text-ink-soft">
              {COLOPHON_ROWS.map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-ink-muted">{row.label}</span>
                  <span className={`text-ink-bright ${row.lines.length > 1 ? 'text-right' : ''}`}>
                    {row.lines.map((line, index) => (
                      <Fragment key={line}>
                        {index > 0 && <br />}
                        {line}
                      </Fragment>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-[14px] font-mono text-[11px] font-medium tracking-[.14em] text-gold">
              IN THIS EDITION
            </div>
            <div className="flex flex-col">
              {EDITION_GROUPS.map((group) => (
                <Fragment key={group.caption}>
                  <div className="mt-[14px] mb-[2px] font-mono text-[10px] font-medium tracking-[.14em] text-ink-muted">
                    {group.caption}
                  </div>
                  {group.rows.map((row) => (
                    <EditionIndexRow key={row.to} row={row} />
                  ))}
                </Fragment>
              ))}
              <EditionIndexRow row={GAZETTEER_ROW} last />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[14px] flex justify-between border-t border-gold/18 pt-[16px] font-mono text-[11px] tracking-[.1em] text-ink-faint">
        <span>A FIELD GUIDE TO LANGUAGE MODELS</span>
        <span>© THE ATLAS · MMXXVI</span>
      </div>
    </PlateSheet>
  )
}
