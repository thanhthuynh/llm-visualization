export interface TapeBlock {
  label: string
  tone?: 'system' | 'turns' | 'you' | 'reply' | 'redacted' | 'retrieved'
}

export interface WindowTapeProps {
  ruler: string
  blocks: ReadonlyArray<TapeBlock>
  overflow?: boolean
}

const TONE_COLORS: Record<string, string> = {
  system: 'rgba(109, 158, 255, 0.18)',
  turns: 'rgba(184, 196, 224, 0.14)',
  you: 'rgba(255, 123, 0, 0.16)',
  reply: 'rgba(46, 230, 214, 0.14)',
  redacted: 'rgba(136, 136, 136, 0.10)',
  retrieved: 'rgba(255, 123, 174, 0.14)',
  default: 'var(--color-surface-card)',
}

function toneColor(tone: TapeBlock['tone']): string {
  return tone !== undefined ? (TONE_COLORS[tone] ?? TONE_COLORS.default) : TONE_COLORS.default
}

export function WindowTape({ ruler, blocks, overflow = false }: WindowTapeProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-mono text-[11px] text-text-muted mb-2">{ruler}</p>
      {overflow && (
        <p className="font-mono text-[11px] text-text-muted mb-1" aria-label="Overflow marker">
          ↑ oldest tokens gone
        </p>
      )}
      {blocks.map((block, i) => (
        <div
          key={i}
          className="px-3 py-2 rounded font-body text-sm text-text-primary"
          style={{ backgroundColor: toneColor(block.tone) }}
        >
          {block.label}
        </div>
      ))}
    </div>
  )
}
