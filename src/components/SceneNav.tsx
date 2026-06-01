interface SceneNavProps {
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
  label?: string
}

const BASE_BTN =
  'inline-flex items-center px-4.5 py-[11px] rounded-pill border border-border font-body font-semibold text-sm min-h-11 transition-[opacity,background-color] duration-200 ease-out'

export function SceneNav({
  onPrev,
  onNext,
  canPrev,
  canNext,
  label = 'Scene navigation',
}: SceneNavProps) {
  const prevClass = `${BASE_BTN} bg-transparent ${
    canPrev
      ? 'text-text-primary opacity-100 cursor-pointer'
      : 'text-text-muted opacity-40 cursor-not-allowed'
  }`
  const nextClass = `${BASE_BTN} bg-surface-card ${
    canNext
      ? 'text-text-primary opacity-100 cursor-pointer'
      : 'text-text-muted opacity-40 cursor-not-allowed'
  }`
  return (
    <nav aria-label={label} className="mt-6 flex justify-end gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous scene"
        className={prevClass}
      >
        ← Prev
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next scene"
        className={nextClass}
      >
        Next →
      </button>
    </nav>
  )
}
