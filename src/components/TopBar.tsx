interface TopBarProps {
  prompt: string
}

export function TopBar({ prompt }: TopBarProps) {
  return (
    <header className="fixed top-0 right-0 left-[72px] h-[72px] bg-(--color-bg-base) border-b border-(--color-border) flex items-center justify-between px-8 z-[9]">
      <span className="font-[family-name:--font-display] font-bold text-xl tracking-[-0.2px]">
        Inside an LLM
      </span>
      {prompt && (
        <div className="inline-flex items-center gap-2.5 px-[14px] py-1.5 rounded-(--radius-pill) bg-(--color-surface-card) border border-(--color-border)">
          <span className="font-[family-name:--font-body] font-medium text-[10px] tracking-widest uppercase text-(--color-text-muted)">
            Prompt
          </span>
          <span className="font-[family-name:--font-mono] text-[13px]">{prompt}</span>
        </div>
      )}
    </header>
  )
}
