import { Fragment } from 'react'
import { PlateSheet, PlateTitleRow, PlateLede } from '@/components/PlateSheet'

// Panel wash — exact gradient string from the design reference
// (panel at .5 fading to sheet at .15).
const panelWash = {
  background: 'linear-gradient(180deg, rgba(18,32,58,.5), rgba(13,21,34,.15))',
} as const

interface RetrievedDoc {
  id: string
  score: string
  tokens: string
}

// illustrative — design-reference values, not measured
const RETRIEVED: RetrievedDoc[] = [
  { id: 'doc-14', score: '0.91', tokens: '312 TOK' },
  { id: 'doc-07', score: '0.87', tokens: '540 TOK' },
  { id: 'doc-22', score: '0.84', tokens: '352 TOK' },
]

// Steps 01–04 of the retrieval pipeline; 05 is the gold terminus rendered apart.
const PIPELINE_STEPS = ['EMBED QUERY', 'SEARCH STORE', 'RANK BY DISTANCE', 'TAKE TOP-3']

/**
 * The 760×360 vector-space survey. Geometry is copied 1:1 from the design
 * reference; colors reference theme tokens via CSS variables.
 */
function VectorSpacePanel() {
  return (
    <div
      className="relative h-[360px] w-[760px] flex-[0_0_760px] rounded-[2px] border border-ink-nav/22"
      style={panelWash}
    >
      <svg
        viewBox="0 0 760 360"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <line x1="90" y1="180" x2="150" y2="80" stroke="var(--color-gold)" strokeWidth="1.5" />
        <line x1="90" y1="180" x2="240" y2="290" stroke="var(--color-gold)" strokeWidth="1.5" />
        <line x1="90" y1="180" x2="200" y2="150" stroke="var(--color-gold)" strokeWidth="1.5" />
        <line
          x1="90"
          y1="180"
          x2="430"
          y2="70"
          stroke="var(--color-ink-dim)"
          strokeWidth="1"
          strokeDasharray="2 6"
          opacity="0.6"
        />
        <line
          x1="90"
          y1="180"
          x2="540"
          y2="250"
          stroke="var(--color-ink-dim)"
          strokeWidth="1"
          strokeDasharray="2 6"
          opacity="0.6"
        />
        <line
          x1="90"
          y1="180"
          x2="650"
          y2="130"
          stroke="var(--color-ink-dim)"
          strokeWidth="1"
          strokeDasharray="2 6"
          opacity="0.6"
        />
        <line
          x1="90"
          y1="180"
          x2="700"
          y2="305"
          stroke="var(--color-ink-dim)"
          strokeWidth="1"
          strokeDasharray="2 6"
          opacity="0.6"
        />
        <circle
          cx="90"
          cy="180"
          r="8"
          fill="var(--color-sheet)"
          stroke="var(--color-gold)"
          strokeWidth="2"
        />
        <circle
          cx="90"
          cy="180"
          r="15"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1"
          opacity="0.4"
        />
        <circle cx="150" cy="80" r="7" fill="var(--color-gold)" />
        <circle cx="240" cy="290" r="7" fill="var(--color-gold)" />
        <circle cx="200" cy="150" r="7" fill="var(--color-gold)" />
        <circle
          cx="430"
          cy="70"
          r="6"
          fill="var(--color-sheet)"
          stroke="var(--color-ink-dim)"
          strokeWidth="1.5"
        />
        <circle
          cx="540"
          cy="250"
          r="6"
          fill="var(--color-sheet)"
          stroke="var(--color-ink-dim)"
          strokeWidth="1.5"
        />
        <circle
          cx="650"
          cy="130"
          r="6"
          fill="var(--color-sheet)"
          stroke="var(--color-ink-dim)"
          strokeWidth="1.5"
        />
        <circle
          cx="700"
          cy="305"
          r="6"
          fill="var(--color-sheet)"
          stroke="var(--color-ink-dim)"
          strokeWidth="1.5"
        />
      </svg>
      <div className="absolute top-[198px] left-[40px] font-mono text-[10px] font-medium tracking-[.1em] text-gold">
        QUERY
      </div>
      <div className="absolute top-[54px] left-[165px] font-mono text-[11px] font-medium text-gold">
        doc-14 · 0.91
      </div>
      <div className="absolute top-[132px] left-[215px] font-mono text-[11px] font-medium text-gold">
        doc-22 · 0.84
      </div>
      <div className="absolute top-[296px] left-[255px] font-mono text-[11px] font-medium text-gold">
        doc-07 · 0.87
      </div>
      <div className="absolute top-[50px] left-[444px] font-mono text-[11px] text-ink-faint">
        0.52
      </div>
      <div className="absolute top-[230px] left-[554px] font-mono text-[11px] text-ink-faint">
        0.47
      </div>
      <div className="absolute top-[110px] left-[664px] font-mono text-[11px] text-ink-faint">
        0.41
      </div>
      <div className="absolute top-[318px] left-[648px] font-mono text-[11px] text-ink-faint">
        0.33
      </div>
      <div className="absolute bottom-[10px] left-[14px] font-mono text-[10px] tracking-[.1em] text-ink-dim">
        VECTOR STORE · 12,400 DOCS
      </div>
    </div>
  )
}

/** Plate III — retrieval as bearings taken on a vector store. */
export function PlateIII() {
  return (
    <PlateSheet label="Plate III — RAG">
      <PlateTitleRow
        no={'PLATE\u00A0III'}
        title="Bearings from Afar"
        subject="SUBJECT · RETRIEVAL"
      />
      <PlateLede className="mt-[18px] mb-[22px] max-w-[660px]">
        When an answer lies beyond memory, retrieval takes bearings on a store of documents and
        brings the nearest few into view. Distance is similarity — the closer the chart, the better
        the match.
      </PlateLede>

      <div className="flex flex-1 gap-[28px]">
        <VectorSpacePanel />

        <div className="flex flex-1 flex-col rounded-[2px] border border-gold/25 p-[22px]">
          <div className="mb-[18px] font-mono text-[11px] font-medium tracking-[.14em] text-gold">
            RETRIEVED → CONTEXT
          </div>
          {RETRIEVED.map((doc, i) => (
            <div
              key={doc.id}
              className={`flex items-baseline justify-between border-t border-ink-nav/18 py-[11px] ${
                i === RETRIEVED.length - 1 ? 'border-b' : ''
              }`}
            >
              <div>
                <div className="font-display text-[16px] font-medium text-ink-bright">{doc.id}</div>
                <div className="font-mono text-[11px] text-ink-muted">{doc.score}</div>
              </div>
              <span className="font-mono text-[12px] font-medium text-blue">{doc.tokens}</span>
            </div>
          ))}
          <div className="mt-auto flex items-baseline justify-between pt-[18px]">
            <span className="font-mono text-[11px] font-medium tracking-[.1em] text-gold">
              TOP-3 INJECTED
            </span>
            <span className="font-display text-[20px] font-medium text-gold">1,204 TOK</span>
          </div>
        </div>
      </div>

      <div className="mt-[20px] flex items-center border-t border-gold/30 pt-[20px]">
        {PIPELINE_STEPS.map((step, i) => (
          <Fragment key={step}>
            <span className="font-mono text-[11px] font-medium text-ink-bright">
              <span className="text-gold">{`0${i + 1}`}</span> {step}
            </span>
            <span className="px-[14px] text-gold">→</span>
          </Fragment>
        ))}
        <span className="font-mono text-[11px] font-medium text-gold">
          <span>05</span> ANSWER FROM SOURCES
        </span>
      </div>
    </PlateSheet>
  )
}
