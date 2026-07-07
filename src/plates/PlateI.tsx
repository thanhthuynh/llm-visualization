import { PlateSheet, PlateTitleRow, PlateLede, PlateFooter } from '@/components/PlateSheet'

// 45° gold hatch for the Reserved segment — exact repeating gradient from the
// design reference; Tailwind can't express this cleanly as a utility.
const reservedHatch = {
  background:
    'repeating-linear-gradient(45deg, rgba(216,166,87,.7) 0 2px, rgba(216,166,87,.12) 2px 7px)',
} as const

interface WindowSegment {
  name: string
  tokens: string
  /** Flex basis utility — segment width as a share of the 128K window. */
  basis: string
  /** Bar fill utility classes; empty for the hatched Reserved segment. */
  fill: string
  hatch?: boolean
  countClass: string
  nameClass: string
  leaderClass: string
}

// illustrative — design-reference values, not measured
const SEGMENTS: WindowSegment[] = [
  {
    name: 'System',
    tokens: '0.4K',
    basis: 'flex-[0_0_10%]',
    fill: 'bg-gold',
    countClass: 'text-gold',
    nameClass: 'text-ink-bright',
    leaderClass: 'bg-gold/45',
  },
  {
    name: 'Retrieved',
    tokens: '1.2K',
    basis: 'flex-[0_0_13%]',
    fill: 'bg-blue',
    countClass: 'text-blue',
    nameClass: 'text-ink-bright',
    leaderClass: 'bg-gold/45',
  },
  {
    name: 'Conversation',
    tokens: '73K',
    basis: 'flex-[0_0_39%]',
    fill: 'bg-gold/50',
    countClass: 'text-gold',
    nameClass: 'text-ink-bright',
    leaderClass: 'bg-gold/45',
  },
  {
    name: 'Input',
    tokens: '0.2K',
    basis: 'flex-[0_0_8%]',
    fill: 'bg-ink-bright',
    countClass: 'text-ink-bright',
    nameClass: 'text-ink-bright',
    leaderClass: 'bg-gold/45',
  },
  {
    name: 'Reserved',
    tokens: '4K',
    basis: 'flex-[0_0_12%]',
    fill: '',
    hatch: true,
    countClass: 'text-gold',
    nameClass: 'text-ink-bright',
    leaderClass: 'bg-gold/45',
  },
  {
    name: 'Open',
    tokens: '49K',
    basis: 'flex-[0_0_18%]',
    fill: 'bg-gold/6',
    countClass: 'text-ink-faint',
    nameClass: 'text-ink-muted',
    leaderClass: 'bg-gold/25',
  },
]

interface Note {
  heading: string
  body: string
}

const NOTES: Note[] = [
  {
    heading: 'WHY IT MATTERS',
    body: 'Everything the model weighs — instructions, history, sources, your question — must fit inside this single budget.',
  },
  {
    heading: 'WHEN IT OVERFLOWS',
    body: 'Fill the window and the oldest soundings slip past the edge — the model can no longer see them.',
  },
  {
    heading: 'THE COST',
    body: 'Attention compares every token with every other, so a longer window is slower and dearer to chart.',
  },
]

const AXIS_LABELS = ['0', '32K', '64K', '96K', '128K']

/** Plate I — the 128K context-window transect. */
export function PlateI() {
  return (
    <PlateSheet label="Plate I — Context Window">
      <PlateTitleRow
        no={'PLATE\u00A0I'}
        title="The Boundaries of Memory"
        subject="SUBJECT · CONTEXT"
      />
      <PlateLede>
        A model holds only so much in view at once. This transect surveys a 128,000-token window —
        what fills it, and what slips past the edge when it overflows.
      </PlateLede>

      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-[9px] flex justify-between font-mono text-[10px] tracking-[.08em] text-ink-faint">
          {AXIS_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div
          aria-hidden="true"
          className="flex h-[78px] overflow-hidden rounded-[2px] border border-gold/45"
        >
          {SEGMENTS.map((seg, i) => (
            <div
              key={seg.name}
              className={`${seg.basis} ${seg.fill} ${
                i < SEGMENTS.length - 1 ? 'border-r border-sheet' : ''
              }`}
              style={seg.hatch ? reservedHatch : undefined}
            />
          ))}
        </div>

        <div className="flex">
          {SEGMENTS.map((seg) => (
            <div key={seg.name} className={`${seg.basis} px-[4px] text-center`}>
              <div className={`mx-auto mb-[8px] h-[12px] w-px ${seg.leaderClass}`} />
              <div className={`font-mono text-[11px] font-medium ${seg.countClass}`}>
                {seg.tokens}
              </div>
              <div className={`mt-[2px] font-display text-[13px] font-medium ${seg.nameClass}`}>
                {seg.name}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[26px] flex items-center gap-[10px] pl-[82%]">
          <div className="flex-1 border-t border-dashed border-gold/40" />
        </div>
      </div>

      <div className="grid grid-cols-[repeat(3,1fr)] gap-[40px] border-t border-gold/30 pt-[22px]">
        {NOTES.map((note) => (
          <div key={note.heading}>
            <div className="mb-[9px] font-mono text-[11px] font-medium tracking-[.12em] text-gold">
              {note.heading}
            </div>
            <p className="font-body text-[13px] leading-[1.5] text-ink-body">{note.body}</p>
          </div>
        ))}
      </div>

      <PlateFooter
        left="SURVEYED MMXXVI · THE ATLAS"
        right="1 SQUARE = 1,024 TOKENS"
        className="mt-[20px]"
      />
    </PlateSheet>
  )
}
