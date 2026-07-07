import { PlateSheet, PlateTitleRow, PlateLede, PlateFooter } from '@/components/PlateSheet'

interface ConversationRow {
  role: string
  text: string
  borderClass: string
  roleClass: string
  textClass: string
}

// illustrative — design-reference values, not measured
const CONVERSATION: ConversationRow[] = [
  {
    role: 'USER',
    text: 'What is a context window?',
    borderClass: 'border-ink-nav/28',
    roleClass: 'text-ink-nav',
    textClass: 'text-ink-body',
  },
  {
    role: 'ASSISTANT',
    text: 'It is the span of tokens held in view…',
    borderClass: 'border-ink-nav/18',
    roleClass: 'text-ink-muted',
    textClass: 'text-ink-soft',
  },
  {
    role: 'USER',
    text: 'And how does retrieval help?',
    borderClass: 'border-ink-nav/28',
    roleClass: 'text-ink-nav',
    textClass: 'text-ink-body',
  },
]

interface OrderEntry {
  term: string
  gloss: string
}

const ORDERS: OrderEntry[] = [
  { term: 'Role', gloss: 'who the model acts as.' },
  { term: 'Voice & Tone', gloss: 'how it should sound.' },
  { term: 'Boundaries', gloss: 'what it must refuse or avoid.' },
  { term: 'Tools', gloss: 'instruments it may call.' },
  { term: 'Format', gloss: 'the shape of its replies.' },
  { term: 'Knowledge', gloss: 'facts and context to assume.' },
]

/** Plate II — the system prompt as standing orders. */
export function PlateII() {
  return (
    <PlateSheet label="Plate II — System Prompt">
      <PlateTitleRow no={'PLATE\u00A0II'} title="Standing Orders" subject="SUBJECT · SYSTEM" />
      <PlateLede>
        Before a single word of conversation, the model reads its standing orders — a hidden brief,
        pinned first and re-read every turn, that fixes who it is and how it must answer.
      </PlateLede>

      <div className="mt-[6px] grid flex-1 content-center grid-cols-[1fr_1fr] gap-[48px]">
        <div>
          <div className="mb-[18px] font-mono text-[11px] font-medium tracking-[.14em] text-gold">
            THE ORDER OF READING
          </div>

          <div className="mb-[11px] flex items-center gap-[14px] rounded-[2px] border border-gold bg-gold/10 px-[18px] py-[15px]">
            <div className="h-[9px] w-[9px] flex-none rotate-45 bg-gold" />
            <div className="flex-1">
              <div className="font-mono text-[11px] font-medium tracking-[.1em] text-gold">
                SYSTEM · PINNED
              </div>
              <div className="mt-[3px] font-body text-[13.5px] text-ink-bright">
                “You are a careful guide to language models…”
              </div>
            </div>
          </div>

          {CONVERSATION.map((row, i) => (
            <div
              key={`${row.role}-${row.text}`}
              className={`flex gap-[14px] rounded-[2px] border px-[18px] py-[13px] ${
                i < CONVERSATION.length - 1 ? 'mb-[11px]' : ''
              } ${row.borderClass}`}
            >
              <span
                className={`w-[74px] font-mono text-[11px] font-medium tracking-[.1em] ${row.roleClass}`}
              >
                {row.role}
              </span>
              <span className={`font-body text-[13.5px] ${row.textClass}`}>{row.text}</span>
            </div>
          ))}

          <div className="mt-[16px] font-body text-[12.5px] leading-[1.5] text-ink-muted italic">
            The orders sit beneath every exchange. The reader never sees them — only their effect.
          </div>
        </div>

        <div>
          <div className="mb-[18px] font-mono text-[11px] font-medium tracking-[.14em] text-gold">
            WHAT THE ORDERS SET
          </div>

          <div className="flex flex-col gap-[16px]">
            {ORDERS.map((entry) => (
              <div key={entry.term} className="flex items-baseline gap-[14px]">
                <span className="h-[9px] w-[9px] flex-none translate-y-[2px] rounded-full border-[1.5px] border-gold" />
                <div>
                  <span className="font-display text-[17px] font-medium text-ink-bright">
                    {entry.term}
                  </span>
                  <span className="font-body text-[13px] text-ink-soft">
                    {' — '}
                    {entry.gloss}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-[24px] rounded-[2px] border border-gold/25 bg-panel/40 px-[16px] py-[14px]">
            <div className="mb-[6px] font-mono text-[10px] font-medium tracking-[.14em] text-gold">
              COST · 412 TOKENS
            </div>
            <div className="font-body text-[12.5px] leading-[1.5] text-ink-soft">
              The orders occupy the first stretch of the context window — small, but always present.
            </div>
          </div>
        </div>
      </div>

      <PlateFooter left="SURVEYED MMXXVI · THE ATLAS" right="READ FIRST · EVERY TURN" />
    </PlateSheet>
  )
}
