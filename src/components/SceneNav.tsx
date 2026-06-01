interface SceneNavProps {
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
  label?: string
}

const BASE_BTN =
  'inline-flex items-center px-[18px] py-[11px] rounded-(--radius-pill) border border-(--color-border) font-[family-name:--font-body] font-semibold text-sm min-h-[44px] transition-[opacity,background-color] duration-200 ease-out'

export function SceneNav({
  onPrev,
  onNext,
  canPrev,
  canNext,
  label = 'Scene navigation',
}: SceneNavProps) {
  const prevClass = `${BASE_BTN} bg-transparent text-(--color-text-muted) ${
    canPrev ? 'opacity-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'
  }`
  const nextClass = `${BASE_BTN} bg-(--color-surface-card) ${
    canNext ? 'text-(--color-text-primary) opacity-100 cursor-pointer' : 'text-(--color-text-muted) opacity-40 cursor-not-allowed'
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
