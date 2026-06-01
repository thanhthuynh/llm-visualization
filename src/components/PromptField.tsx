import { useReducedMotionPref } from '@/app/useReducedMotionPref'

interface PromptFieldProps {
  text: string
}

export function PromptField({ text }: PromptFieldProps) {
  const reduce = useReducedMotionPref()
  return (
    <div className="inline-flex items-center gap-0.5 px-[18px] py-[14px] bg-(--color-surface-card) border border-(--color-border) rounded-(--radius-card)">
      <span className="font-[family-name:--font-mono] text-lg text-(--color-text-primary)">
        {text}
      </span>
      <span
        data-testid="caret"
        aria-hidden="true"
        style={{ animation: reduce ? 'none' : 'blink-caret 1s steps(2) infinite' }}
        className="inline-block w-0.5 h-[22px] ml-0.5 bg-(--color-text-primary)"
      />
    </div>
  )
}
