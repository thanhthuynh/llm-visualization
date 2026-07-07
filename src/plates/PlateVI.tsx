import { PlateSheet, PlateTitleRow, PlateLede, PlateFooter } from '@/components/PlateSheet'

/**
 * Plate VI — The Scouting Party (Subagents).
 *
 * Recreated 1:1 from the design reference: a lead-agent card fanning out
 * dashed gold dispatch curves to three isolated subagent cards, whose solid
 * blue return curves converge back with condensed findings.
 */

const CARD =
  'absolute overflow-hidden rounded-[3px] border border-gold/22 bg-panel/40 px-[18px] py-[16px]'

// illustrative — design-reference values, not measured
const SUBAGENTS = [
  {
    key: 'A',
    top: 'top-[30px]',
    title: 'Survey · sources',
    gloss: 'reads the document store',
    fillWidth: 'w-[55%]',
    tokens: '180 tok',
  },
  {
    key: 'B',
    top: 'top-[168px]',
    title: 'Survey · the web',
    gloss: 'searches & reads pages',
    fillWidth: 'w-[72%]',
    tokens: '240 tok',
  },
  {
    key: 'C',
    top: 'top-[306px]',
    title: 'Survey · the code',
    gloss: 'runs & inspects code',
    fillWidth: 'w-[38%]',
    tokens: '120 tok',
  },
] as const

/** Dashed gold fan-out curves, lead agent → subagents. */
const DISPATCH_PATHS = [
  'M300,210 C480,210 520,62 690,62',
  'M300,210 C480,210 520,200 690,200',
  'M300,210 C480,210 520,338 690,338',
] as const

/** Solid blue fan-in curves, subagents → lead agent. */
const RETURN_PATHS = [
  'M690,80 C520,80 480,228 300,228',
  'M690,218 C520,218 480,228 300,228',
  'M690,356 C520,356 480,228 300,228',
] as const

function RouteSvg() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1088 470"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <marker id="pvi-arD" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#d8a657" />
        </marker>
        <marker id="pvi-arR" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5b8fb0" />
        </marker>
      </defs>
      {DISPATCH_PATHS.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="#d8a657"
          strokeWidth="1.4"
          strokeDasharray="2 7"
          markerEnd="url(#pvi-arD)"
        />
      ))}
      {RETURN_PATHS.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="#5b8fb0"
          strokeWidth="1"
          opacity="0.7"
          markerEnd="url(#pvi-arR)"
        />
      ))}
    </svg>
  )
}

function LeadAgentCard() {
  return (
    <div className={`${CARD} top-[140px] left-[20px] h-[180px] w-[250px]`}>
      <div className="mb-[14px] font-mono text-[10px] font-medium tracking-[.14em] text-gold">
        LEAD AGENT
      </div>
      <div className="mb-[8px] font-display text-[19px] font-medium text-ink-bright">
        The flagship
      </div>
      <div className="font-body text-[12px] leading-[1.5] text-ink-soft">
        Decomposes the task, dispatches scouts, then draws their findings together into one answer.
      </div>
      <div className="mt-[12px] flex gap-[8px] font-mono text-[9px] font-medium tracking-[.1em] text-gold">
        <span>DECOMPOSE</span>
        <span className="text-ink-muted">·</span>
        <span>SYNTHESIZE</span>
      </div>
    </div>
  )
}

interface SubagentCardProps {
  subagent: (typeof SUBAGENTS)[number]
}

function SubagentCard({ subagent }: SubagentCardProps) {
  const { key, top, title, gloss, fillWidth, tokens } = subagent
  return (
    <div className={`${CARD} ${top} left-[700px] h-[116px] w-[388px]`}>
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] font-medium tracking-[.1em] text-gold">
          SUBAGENT · {key}
        </span>
        <span className="font-mono text-[9px] text-ink-muted">isolated context</span>
      </div>
      <div className="mt-[7px] mb-[3px] font-display text-[17px] font-medium text-ink-bright">
        {title}
      </div>
      <div className="font-body text-[11.5px] text-ink-soft">{gloss}</div>
      <div className="mt-[9px] flex items-center gap-[9px]">
        <span className="font-mono text-[9px] text-ink-muted">RETURNS</span>
        <span className="h-[6px] flex-1 overflow-hidden rounded-[1px] bg-gold/12">
          <span className={`block h-full bg-blue ${fillWidth}`} />
        </span>
        <span className="font-mono text-[10px] font-medium text-blue">{tokens}</span>
      </div>
    </div>
  )
}

export function PlateVI() {
  return (
    <PlateSheet label="Plate VI — Subagents" contentClassName="px-[54px] py-[40px]">
      <PlateTitleRow
        no="PLATE VI"
        title="The Scouting Party"
        subject="SUBJECT · SUBAGENTS"
        titleClassName="text-[29px]"
        className="pb-[18px]"
      />
      <PlateLede className="mt-[16px] mb-[18px] max-w-[690px]">
        No single party can chart everything. A lead agent dispatches subagents — each surveys its
        own territory in isolation, then returns with findings to be drawn together.
      </PlateLede>
      <div className="relative flex-1">
        <RouteSvg />
        <LeadAgentCard />
        {SUBAGENTS.map((subagent) => (
          <SubagentCard key={subagent.key} subagent={subagent} />
        ))}
        <div className="absolute top-[150px] left-[458px] font-mono text-[10px] font-medium tracking-[.08em] text-gold">
          dispatch ▸
        </div>
        <div className="absolute top-[250px] left-[452px] font-mono text-[10px] font-medium tracking-[.08em] text-blue">
          ◂ findings
        </div>
        <div className="absolute top-[430px] right-0 left-0 text-center font-body text-[12px] text-ink-muted">
          Each scout works in isolation and in parallel, returning only a condensed finding — so the
          lead&apos;s own chart stays clear.
        </div>
      </div>
      <PlateFooter
        left="SURVEYED MMXXVI · THE ATLAS"
        right="PARALLEL · ISOLATED"
        className="border-t border-gold/30 pt-[14px]"
      />
    </PlateSheet>
  )
}
