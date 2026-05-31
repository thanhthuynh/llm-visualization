import { useReducedMotionPref } from '@/app/useReducedMotionPref'

interface PromptFieldProps {
  text: string
}

export function PromptField({ text }: PromptFieldProps) {
  const reduce = useReducedMotionPref()
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        padding: '14px 18px',
        background: 'var(--color-surface-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 18,
          color: 'var(--color-text-primary)',
        }}
      >
        {text}
      </span>
      <span
        data-testid="caret"
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 2,
          height: 22,
          marginLeft: 2,
          background: 'var(--color-text-primary)',
          animation: reduce ? 'none' : 'blink-caret 1s steps(2) infinite',
        }}
      />
    </div>
  )
}
