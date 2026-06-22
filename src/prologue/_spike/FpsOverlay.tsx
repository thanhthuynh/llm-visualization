/**
 * TEMPORARY — Phase-0 spike. On-screen fps + scrollYProgress overlay.
 *
 * Fixed top-right, monospace. A `requestAnimationFrame` loop measures frame
 * deltas and shows a rolling MEDIAN fps over the last ~60 frames (median, not
 * mean, so a single GC stall doesn't dominate the read). Also surfaces the live
 * `scrollYProgress` 0..1 and the active snap mode.
 *
 * This is the key affordance for the human's real-Safari/iOS pass: it lets them
 * eyeball performance without devtools. DO NOT remove with the rest of the spike
 * until after that manual pass.
 */
import { useEffect, useState } from 'react'
import type { MotionValue } from 'motion/react'
import type { PrologueSnapMode } from '@/prologue/snap'

interface FpsOverlayProps {
  progress: MotionValue<number>
  mode: PrologueSnapMode
}

const SAMPLE_WINDOW = 60

function median(values: readonly number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 1) {
    return sorted[mid] ?? 0
  }
  const lo = sorted[mid - 1] ?? 0
  const hi = sorted[mid] ?? 0
  return (lo + hi) / 2
}

export function FpsOverlay({ progress, mode }: FpsOverlayProps) {
  const [fps, setFps] = useState(0)
  const [progressText, setProgressText] = useState('0.000')

  useEffect(() => {
    let rafId = 0
    let last = performance.now()
    const deltas: number[] = []

    const tick = (now: number) => {
      const delta = now - last
      last = now
      if (delta > 0) {
        deltas.push(delta)
        if (deltas.length > SAMPLE_WINDOW) deltas.shift()
        const medianDelta = median(deltas)
        if (medianDelta > 0) setFps(Math.round(1000 / medianDelta))
      }
      setProgressText(progress.get().toFixed(3))
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [progress])

  return (
    <div
      data-testid="fps-overlay"
      style={{
        position: 'fixed',
        top: 8,
        right: 8,
        zIndex: 1000,
        padding: '8px 10px',
        borderRadius: 8,
        background: 'rgba(10, 10, 18, 0.82)',
        border: '1px solid #2a2a38',
        color: '#f5f5f7',
        font: '12px/1.5 ui-monospace, "Space Mono", monospace',
        pointerEvents: 'none',
        minWidth: 148,
      }}
    >
      <div>
        fps&nbsp;
        <strong data-testid="fps-value" style={{ color: fps >= 58 ? '#6bf178' : '#f72585' }}>
          {fps}
        </strong>
      </div>
      <div>
        progress&nbsp;<span data-testid="progress-value">{progressText}</span>
      </div>
      <div style={{ color: '#9a9ab0' }}>mode&nbsp;{mode}</div>
    </div>
  )
}
