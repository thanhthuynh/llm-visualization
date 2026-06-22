import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { useRef } from 'react'

// ---------------------------------------------------------------------------
// Minimal mock for motion/react
// We need useScroll to return a controllable scrollYProgress MotionValue-like
// object, and useMotionValueEvent to wire up the change listener so we can
// drive it manually in tests.
// ---------------------------------------------------------------------------
type ChangeListener = (v: number) => void

let _changeListener: ChangeListener | null = null
let _currentValue = 0

const mockScrollYProgress = {
  get: () => _currentValue,
  on: (event: string, cb: ChangeListener) => {
    if (event === 'change') _changeListener = cb
    return () => {}
  },
}

vi.mock('motion/react', () => ({
  useScroll: () => ({ scrollYProgress: mockScrollYProgress }),
  useMotionValueEvent: (
    _mv: typeof mockScrollYProgress,
    event: string,
    cb: ChangeListener,
  ) => {
    if (event === 'change') _changeListener = cb
  },
}))

// Import after the mock is registered
import { useBeatProgress, type BeatProgress } from '@/prologue/useBeatProgress'
import type { BeatId } from '@/prologue/beats.config'

// Helper component that exposes activeBeat as visible text
function Probe() {
  const ref = useRef<HTMLDivElement>(null)
  const { activeBeat } = useBeatProgress(ref)
  return <div data-testid="beat">{activeBeat}</div>
}

describe('useBeatProgress', () => {
  beforeEach(() => {
    _changeListener = null
    _currentValue = 0
  })

  it('starts with activeBeat === "hook" (initial progress 0)', () => {
    const { getByTestId } = render(<Probe />)
    expect(getByTestId('beat').textContent).toBe('hook')
  })

  it('transitions to "attention" when progress changes to 0.5', () => {
    const { getByTestId } = render(<Probe />)
    act(() => {
      _changeListener?.(0.5)
    })
    expect(getByTestId('beat').textContent).toBe('attention')
  })

  it('transitions to "tokenize" when progress is 0.2', () => {
    const { getByTestId } = render(<Probe />)
    act(() => {
      _changeListener?.(0.2)
    })
    expect(getByTestId('beat').textContent).toBe('tokenize')
  })

  it('transitions to "choose-path" when progress is 1 (end)', () => {
    const { getByTestId } = render(<Probe />)
    act(() => {
      _changeListener?.(1)
    })
    expect(getByTestId('beat').textContent).toBe('choose-path')
  })

  it('returns scrollYProgress from the mock', () => {
    let captured: BeatProgress | null = null
    function ProbeCapture() {
      const ref = useRef<HTMLDivElement>(null)
      captured = useBeatProgress(ref)
      return null
    }
    render(<ProbeCapture />)
    expect(captured).not.toBeNull()
    expect((captured as unknown as BeatProgress).scrollYProgress).toBe(mockScrollYProgress)
  })

  it('does not re-render if the same beat is emitted twice (same progress range)', () => {
    // Drive to 0.5 (attention), then drive to 0.55 (still attention) — beat must remain 'attention'
    const { getByTestId } = render(<Probe />)
    act(() => { _changeListener?.(0.5) })
    act(() => { _changeListener?.(0.55) })
    const beat = getByTestId('beat').textContent as BeatId
    expect(beat).toBe('attention')
  })
})
