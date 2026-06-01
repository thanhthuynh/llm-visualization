interface TopBarProps {
  prompt: string
}

export function TopBar({ prompt }: TopBarProps) {
  return (
    <header className="fixed top-0 right-0 left-[72px] h-18 bg-bg-base border-b border-border flex items-center justify-between px-8 z-[9]">
      <span className="font-display font-bold text-xl tracking-[-0.2px]">
        Inside an LLM
      </span>
      {prompt && (
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-pill bg-surface-card border border-border">
          <span className="font-body font-medium text-[10px] tracking-widest uppercase text-text-muted">
            Prompt
          </span>
          <span className="font-mono text-[13px]">{prompt}</span>
        </div>
      )}
    </header>
  )
}
