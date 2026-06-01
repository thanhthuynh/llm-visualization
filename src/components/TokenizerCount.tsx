interface TokenizerCountExample {
  vendor: 'anthropic' | 'openai'
  label: string
  prompt: string
  tokenCount: number
  note: string
}

interface TokenizerCountProps {
  examples: ReadonlyArray<TokenizerCountExample>
}

export function TokenizerCount({ examples }: TokenizerCountProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {examples.map((e) => (
        <div
          key={e.vendor}
          className="flex flex-col gap-1.5 p-3.5 border border-border rounded-card bg-surface-card"
        >
          <div className="font-body font-semibold text-[13px] text-text-primary">
            {e.label}
          </div>
          <div className="font-mono text-sm text-text-muted">
            &quot;{e.prompt}&quot;
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-[28px] font-bold text-text-primary">
              {e.tokenCount}
            </span>
            <span className="font-body text-xs text-text-muted">
              tokens
            </span>
          </div>
          <div className="font-body text-[11px] text-text-muted italic">
            {e.note}
          </div>
        </div>
      ))}
    </div>
  )
}
