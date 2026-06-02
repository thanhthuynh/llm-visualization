interface HeadSelectorProps {
  active: 0 | 1 | 2
  onSelect: (index: 0 | 1 | 2) => void
}

const HEADS = [0, 1, 2] as const

function buttonClass(isActive: boolean): string {
  const border = isActive ? 'border-accent-attention' : 'border-border'
  const bg = isActive
    ? 'bg-[color-mix(in_srgb,var(--color-accent-attention)_16%,var(--color-surface-card))]'
    : 'bg-surface-card'
  return `px-3.5 py-1.5 rounded-pill border ${border} ${bg} text-text-primary font-body font-semibold text-[13px] cursor-pointer min-h-11`
}

export function HeadSelector({ active, onSelect }: HeadSelectorProps) {
  return (
    <div role="group" aria-label="Attention head" className="flex gap-2">
      {HEADS.map((i) => (
        <button
          key={i}
          type="button"
          aria-pressed={active === i}
          data-umami-event="cta-head-select"
          data-umami-event-head={i}
          onClick={() => onSelect(i)}
          className={buttonClass(active === i)}
        >
          Head {i + 1}
        </button>
      ))}
    </div>
  )
}
