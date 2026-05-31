import { useEffect, useState } from 'react'
import { useReducedMotionPref } from '@/app/useReducedMotionPref'

interface ReplyBubbleProps {
  text: string
  streaming?: boolean
}

const CHAR_INTERVAL_MS = 40

export function ReplyBubble({ text, streaming = false }: ReplyBubbleProps) {
  const reduce = useReducedMotionPref()
  const animate = streaming && !reduce
  const [shown, setShown] = useState<string>(animate ? '' : text)

  useEffect(() => {
    if (!animate) {
      setShown(text)
      return
    }
    setShown('')
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) {
        window.clearInterval(id)
      }
    }, CHAR_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [text, animate])

  const isStreaming = animate && shown.length < text.length

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'var(--color-surface-card)',
          border: '1px solid var(--color-border)',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: 14,
          color: 'var(--color-text-primary)',
          flexShrink: 0,
        }}
      >
        A
      </div>
      <div
        style={{
          padding: '12px 16px',
          background: 'var(--color-surface-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          fontFamily: 'var(--font-body)',
          fontSize: 16,
          color: 'var(--color-text-primary)',
          minHeight: 24,
        }}
      >
        <span>{shown}</span>
        {isStreaming && (
          <span
            data-testid="reply-caret"
            aria-hidden="true"
            style={{
              display: 'inline-block',
              marginLeft: 2,
              color: 'var(--color-text-primary)',
            }}
          >
            |
          </span>
        )}
      </div>
    </div>
  )
}
