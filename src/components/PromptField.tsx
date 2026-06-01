import { useReducedMotionPref } from '@/app/useReducedMotionPref'

interface PromptFieldProps {
  text: string
}

export function PromptField({ text }: PromptFieldProps) {
  const reduce = useReducedMotionPref()
  return (
    <div className="inline-flex items-center gap-0.5 px-4.5 py-3.5 bg-surface-card border border-border rounded-card">
      <span className="font-mono text-lg text-text-primary">
        {text}
      </span>
      <span
        data-testid="caret"
        aria-hidden="true"
        style={{ animation: reduce ? 'none' : 'blink-caret 1s steps(2) infinite' }}
        className="inline-block w-0.5 h-5.5 ml-0.5 bg-text-primary"
      />
    </div>
  )
}
