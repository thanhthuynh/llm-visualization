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
    <div className="flex items-start gap-3">
      <div
        aria-hidden="true"
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-card border border-border font-body font-bold text-sm text-text-primary shrink-0"
      >
        A
      </div>
      <div className="px-4 py-3 bg-surface-card border border-border rounded-card font-body text-base text-text-primary min-h-6">
        <span>{shown}</span>
        {isStreaming && (
          <span
            data-testid="reply-caret"
            aria-hidden="true"
            className="inline-block ml-0.5 text-text-primary"
          >
            |
          </span>
        )}
      </div>
    </div>
  )
}
