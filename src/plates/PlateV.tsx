import { PlateSheet, PlateTitleRow, PlateLede, PlateFooter } from '@/components/PlateSheet'

/**
 * Plate V — The Self-Directed Survey (Agents).
 *
 * Recreated 1:1 from the design reference: a left "THE AGENT LOOP" panel
 * (three-station dashed gold circuit with GOAL in / ANSWER out), a right-top
 * "INSTRUMENTS" tool list, and a right-bottom "RUN LOG" of annotated steps.
 */

const PANEL = 'absolute overflow-hidden rounded-[3px] border border-gold/22 bg-panel/40'

const PANEL_CAPTION = 'font-mono text-[10px] font-medium tracking-[.14em] text-gold'

// illustrative — design-reference values, not measured
const INSTRUMENTS = [
  { name: 'Search', gloss: 'the open web' },
  { name: 'Retrieve', gloss: 'the document store' },
  { name: 'Code', gloss: 'write & run' },
  { name: 'Compute', gloss: 'exact arithmetic' },
  { name: 'Memory', gloss: 'recall earlier notes' },
] as const

// illustrative — design-reference values, not measured
const RUN_LOG = [
  {
    step: 'STEP 01',
    note: '▸ 3 sources',
    reason: 'reason → "I need current figures" · ',
    call: 'search("2026 revenue")',
  },
  {
    step: 'STEP 02',
    note: '▸ value = 4.1%',
    reason: 'reason → "extract the value" · ',
    call: 'read(source 1)',
  },
  {
    step: 'STEP 03',
    note: '✓ done',
    reason: 'reason → "the goal is met" · ',
    call: 'finish(answer)',
  },
] as const

/** The three loop stations on the 470×360 circuit (Reason / Act / Observe). */
const LOOP_STATIONS = [
  { cx: 235, cy: 72 },
  { cx: 328.5, cy: 234 },
  { cx: 141.5, cy: 234 },
] as const

/** Dashed gold arcs between stations; arrowheads via marker-mid at each arc join. */
const LOOP_ARCS = [
  'M235,72 A108,108 0 0 1 328.5,126 A108,108 0 0 1 328.5,234',
  'M328.5,234 A108,108 0 0 1 235,288 A108,108 0 0 1 141.5,234',
  'M141.5,234 A108,108 0 0 1 141.5,126 A108,108 0 0 1 235,72',
] as const

function AgentLoopPanel() {
  return (
    <div className={`${PANEL} top-0 left-0 h-[420px] w-[470px]`}>
      <div className={`absolute top-[16px] left-[18px] ${PANEL_CAPTION}`}>THE AGENT LOOP</div>
      <svg
        aria-hidden="true"
        viewBox="0 0 470 360"
        className="absolute top-[42px] left-0 h-[360px] w-[470px]"
      >
        <defs>
          <marker
            id="pv-loopArr"
            markerWidth="9"
            markerHeight="9"
            refX="4.5"
            refY="4.5"
            orient="auto"
          >
            <path d="M0,0 L9,4.5 L0,9 z" fill="#d8a657" />
          </marker>
          <marker
            id="pv-ioArr"
            markerWidth="10"
            markerHeight="10"
            refX="5.5"
            refY="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#d8a657" />
          </marker>
        </defs>
        {LOOP_ARCS.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="#d8a657"
            strokeWidth="1.6"
            strokeDasharray="2 7"
            markerMid="url(#pv-loopArr)"
          />
        ))}
        {LOOP_STATIONS.map(({ cx, cy }) => (
          <g key={`${cx}-${cy}`}>
            <circle
              cx={cx}
              cy={cy}
              r="10"
              fill="none"
              stroke="#d8a657"
              strokeWidth="1"
              opacity="0.35"
            />
            <circle cx={cx} cy={cy} r="5" fill="#0d1522" stroke="#d8a657" strokeWidth="2" />
          </g>
        ))}
        <line
          x1="44"
          y1="180"
          x2="128"
          y2="180"
          stroke="#d8a657"
          strokeWidth="1.6"
          markerEnd="url(#pv-ioArr)"
        />
        <line
          x1="342"
          y1="180"
          x2="392"
          y2="180"
          stroke="#d8a657"
          strokeWidth="1.6"
          markerEnd="url(#pv-ioArr)"
        />
      </svg>
      <div className="absolute top-[56px] left-[135px] w-[200px] text-center">
        <div className="font-display text-[14px] font-medium text-ink-bright">
          <span className="text-gold">1</span> · Reason
        </div>
        <div className="font-body text-[10.5px] text-ink-soft">plan the next step</div>
      </div>
      <div className="absolute top-[252px] left-[346px] w-[120px]">
        <div className="font-display text-[14px] font-medium text-ink-bright">
          <span className="text-gold">2</span> · Act
        </div>
        <div className="font-body text-[10.5px] text-ink-soft">call a tool</div>
      </div>
      <div className="absolute top-[252px] left-[2px] w-[122px] text-right">
        <div className="font-display text-[14px] font-medium text-ink-bright">
          Observe · <span className="text-gold">3</span>
        </div>
        <div className="font-body text-[10.5px] text-ink-soft">read the result</div>
      </div>
      <div className="absolute top-[206px] right-0 left-0 text-center">
        <div className="font-display text-[15px] font-medium text-ink-bright">Agent</div>
        <div className="mt-[2px] font-mono text-[9px] tracking-[.06em] text-ink-muted">
          ↻ loops until done
        </div>
      </div>
      <div className="absolute top-[214px] left-[8px] font-mono text-[11px] font-medium tracking-[.08em] text-gold">
        GOAL
      </div>
      <div className="absolute top-[214px] left-[400px] font-mono text-[11px] font-medium tracking-[.08em] text-gold">
        ANSWER
      </div>
    </div>
  )
}

function InstrumentsPanel() {
  return (
    <div className={`${PANEL} top-0 left-[500px] h-[196px] w-[588px] px-[18px] py-[16px]`}>
      <div className={`mb-[14px] ${PANEL_CAPTION}`}>INSTRUMENTS</div>
      {INSTRUMENTS.map(({ name, gloss }) => (
        <div key={name} className="flex items-baseline gap-[11px] py-[4px]">
          <span className="h-[8px] w-[8px] flex-none translate-y-[1px] bg-gold" />
          <span className="w-[104px] font-display text-[14px] font-medium text-ink-bright">
            {name}
          </span>
          <span className="font-body text-[12px] text-ink-soft">{gloss}</span>
        </div>
      ))}
    </div>
  )
}

function RunLogPanel() {
  return (
    <div className={`${PANEL} top-[216px] left-[500px] h-[204px] w-[588px] px-[18px] py-[16px]`}>
      <div className={`mb-[14px] ${PANEL_CAPTION}`}>RUN LOG</div>
      {RUN_LOG.map(({ step, note, reason, call }) => (
        <div key={step} className="border-t border-ink-nav/14 py-[7px]">
          <div className="flex justify-between">
            <span className="font-mono text-[11px] font-medium tracking-[.1em] text-gold">
              {step}
            </span>
            <span className="font-mono text-[10px] text-ink-muted">{note}</span>
          </div>
          <div className="mt-[3px] font-body text-[11.5px] leading-[1.4] text-ink-body">
            {reason}
            <span className="font-mono text-[11px] text-ink-bright">{call}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function PlateV() {
  return (
    <PlateSheet label="Plate V — Agents" contentClassName="px-[54px] py-[40px]">
      <PlateTitleRow
        no="PLATE V"
        title="The Self-Directed Survey"
        subject="SUBJECT · AGENTS"
        titleClassName="text-[29px]"
        className="pb-[18px]"
      />
      <PlateLede className="mt-[16px] mb-[18px] max-w-[690px]">
        Give a model a goal, a set of instruments, and room to act — and it becomes an agent:
        charting its own course, one observation at a time.
      </PlateLede>
      <div className="relative flex-1">
        <AgentLoopPanel />
        <InstrumentsPanel />
        <RunLogPanel />
      </div>
      <PlateFooter
        left="SURVEYED MMXXVI · THE ATLAS"
        right="VOL. II · AGENTS"
        className="border-t border-gold/30 pt-[14px]"
      />
    </PlateSheet>
  )
}
