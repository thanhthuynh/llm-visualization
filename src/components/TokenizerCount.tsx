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
          className="flex flex-col gap-1.5 p-[14px] border border-(--color-border) rounded-(--radius-card) bg-(--color-surface-card)"
        >
          <div className="font-[family-name:--font-body] font-semibold text-[13px] text-(--color-text-primary)">
            {e.label}
          </div>
          <div className="font-[family-name:--font-mono] text-sm text-(--color-text-muted)">
            &quot;{e.prompt}&quot;
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-[family-name:--font-mono] text-[28px] font-bold text-(--color-text-primary)">
              {e.tokenCount}
            </span>
            <span className="font-[family-name:--font-body] text-xs text-(--color-text-muted)">
              tokens
            </span>
          </div>
          <div className="font-[family-name:--font-body] text-[11px] text-(--color-text-muted) italic">
            {e.note}
          </div>
        </div>
      ))}
    </div>
  )
}
