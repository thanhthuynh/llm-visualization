import { PlateSheet, PlateTitleRow, PlateLede, PlateFooter } from '@/components/PlateSheet'

/**
 * Plate VII — The Circuit (Loops).
 *
 * Recreated 1:1 from the design reference: a left "THE CIRCUIT" panel with a
 * three-station reason→act→observe ring and goal-met exit line, a right-top
 * "ITERATIONS" turn log, and a right-bottom "STOP CONDITIONS" list.
 */

const PANEL = 'absolute overflow-hidden rounded-[3px] border border-gold/22 bg-panel/40'

const PANEL_CAPTION = 'font-mono text-[10px] font-medium tracking-[.14em] text-gold'

// illustrative — design-reference values, not measured
const TURNS = [
  { turn: 'TURN 01', tool: 'search', result: '3 sources found', status: '↺ continue', done: false },
  { turn: 'TURN 02', tool: 'read', result: 'value = 4.1%', status: '↺ continue', done: false },
  { turn: 'TURN 03', tool: 'finish', result: 'goal met', status: '✓ done', done: true },
] as const

const STOP_CONDITIONS = [
  { glyph: '✓', term: 'goal met', gloss: 'the answer satisfies the task' },
  { glyph: '◷', term: 'step limit', gloss: 'a maximum number of turns is reached' },
  { glyph: '⊘', term: 'no progress', gloss: 'observations stop changing' },
] as const

/** Dashed gold arcs of the 470×360 circuit (Reason → Act → Observe → Reason). */
const CIRCUIT_ARCS = [
  'M235,62 A118,118 0 0 1 337,239',
  'M337,239 A118,118 0 0 1 133,239',
  'M133,239 A118,118 0 0 1 235,62',
] as const

/** The three circuit stations. */
const CIRCUIT_STATIONS = [
  { cx: 235, cy: 62 },
  { cx: 337, cy: 239 },
  { cx: 133, cy: 239 },
] as const

function CircuitPanel() {
  return (
    <div className={`${PANEL} top-0 left-0 h-[430px] w-[470px]`}>
      <div className={`absolute top-[16px] left-[18px] ${PANEL_CAPTION}`}>THE CIRCUIT</div>
      <svg
        aria-hidden="true"
        viewBox="0 0 470 360"
        className="absolute top-[44px] left-0 h-[360px] w-[470px]"
      >
        <defs>
          <marker
            id="pvii-arrL"
            markerWidth="9"
            markerHeight="9"
            refX="4.5"
            refY="4.5"
            orient="auto"
          >
            <path d="M0,0 L9,4.5 L0,9 z" fill="#d8a657" />
          </marker>
        </defs>
        {CIRCUIT_ARCS.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="#d8a657"
            strokeWidth="1.5"
            strokeDasharray="2 7"
            markerEnd="url(#pvii-arrL)"
          />
        ))}
        {CIRCUIT_STATIONS.map(({ cx, cy }) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="9"
            fill="#0d1522"
            stroke="#d8a657"
            strokeWidth="2"
          />
        ))}
        <circle cx="235" cy="150" r="2.5" fill="#d8a657" />
      </svg>
      <div className="absolute top-[86px] left-[204px] font-display text-[15px] font-medium text-ink-bright">
        Reason
      </div>
      <div className="absolute top-[278px] left-[352px] font-display text-[15px] font-medium text-ink-bright">
        Act
      </div>
      <div className="absolute top-[278px] left-[40px] font-display text-[15px] font-medium text-ink-bright">
        Observe
      </div>
      <div className="absolute top-[206px] left-[198px] w-[74px] text-center">
        <div className="font-display text-[14px] font-medium text-gold">Loop</div>
        <div className="mt-[2px] font-mono text-[9px] text-ink-muted">turn 3 / 3</div>
      </div>
      <div className="absolute top-[386px] right-[18px] left-[150px] flex items-center gap-[8px]">
        <span className="h-[10px] w-[10px] flex-none rotate-45 bg-gold" />
        <span className="font-body text-[10.5px] text-ink-soft">
          goal met? <span className="text-ink-muted">no ↺ loop</span> ·{' '}
          <span className="text-gold">yes ▸ answer</span>
        </span>
      </div>
    </div>
  )
}

function IterationsPanel() {
  return (
    <div className={`${PANEL} top-0 left-[500px] h-[256px] w-[588px] px-[18px] py-[16px]`}>
      <div className={`mb-[14px] ${PANEL_CAPTION}`}>ITERATIONS</div>
      {TURNS.map(({ turn, tool, result, status, done }) => (
        <div
          key={turn}
          className="flex items-center gap-[12px] border-t border-ink-nav/14 py-[9px]"
        >
          <span className="w-[54px] font-mono text-[12px] font-medium text-gold">{turn}</span>
          <span className="w-[70px] font-mono text-[12px] font-medium text-ink-bright">{tool}</span>
          <span className="flex-1 font-body text-[12px] text-ink-body">{result}</span>
          <span
            className={`font-mono text-[10px] font-medium ${done ? 'text-gold' : 'text-ink-muted'}`}
          >
            {status}
          </span>
        </div>
      ))}
    </div>
  )
}

function StopConditionsPanel() {
  return (
    <div className={`${PANEL} top-[276px] left-[500px] h-[150px] w-[588px] px-[18px] py-[16px]`}>
      <div className={`mb-[14px] ${PANEL_CAPTION}`}>STOP CONDITIONS</div>
      <div className="mt-[2px] flex flex-col gap-[11px]">
        {STOP_CONDITIONS.map(({ glyph, term, gloss }) => (
          <div key={term} className="flex items-baseline gap-[12px]">
            <span className="w-[16px] font-mono text-[14px] font-medium text-gold">{glyph}</span>
            <span className="w-[120px] font-display text-[14px] font-medium text-ink-bright">
              {term}
            </span>
            <span className="font-body text-[12px] text-ink-soft">{gloss}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PlateVII() {
  return (
    <PlateSheet label="Plate VII — Loops" contentClassName="px-[54px] py-[40px]">
      <PlateTitleRow
        no="PLATE VII"
        title="The Circuit"
        subject="SUBJECT · LOOPS"
        titleClassName="text-[29px]"
        className="pb-[18px]"
      />
      <PlateLede className="mt-[16px] mb-[18px] max-w-[690px]">
        The agent&apos;s route is a circuit, not a line. It runs the same three steps — reason, act,
        observe — turn after turn, until the goal is reached or the journey is called.
      </PlateLede>
      <div className="relative flex-1">
        <CircuitPanel />
        <IterationsPanel />
        <StopConditionsPanel />
      </div>
      <PlateFooter
        left="SURVEYED MMXXVI · THE ATLAS"
        right="UNTIL GOAL OR LIMIT"
        className="border-t border-gold/30 pt-[14px]"
      />
    </PlateSheet>
  )
}
