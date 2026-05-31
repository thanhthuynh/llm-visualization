import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ReplyBubble } from '@/components/ReplyBubble'

function setReducedMotion(value: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes('reduce') ? value : false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

describe('ReplyBubble', () => {
  beforeEach(() => {
    setReducedMotion(false)
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the full text immediately when not streaming', () => {
    vi.useRealTimers()
    setReducedMotion(false)
    render(<ReplyBubble text="The sky is blue" />)
    expect(screen.getByText('The sky is blue')).toBeInTheDocument()
  })

  it('renders the full text immediately when reduced motion is set, even with streaming', () => {
    vi.useRealTimers()
    setReducedMotion(true)
    render(<ReplyBubble text="The sky is blue" streaming />)
    expect(screen.getByText('The sky is blue')).toBeInTheDocument()
  })

  it('streams text incrementally with fake timers', () => {
    render(<ReplyBubble text="hello" streaming />)
    // Immediately, the bubble starts empty.
    expect(screen.queryByText('hello')).toBeNull()
    // Advance enough time for all 5 characters at 40ms/char.
    act(() => {
      vi.advanceTimersByTime(40 * 5 + 50)
    })
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('renders the assistant avatar', () => {
    vi.useRealTimers()
    render(<ReplyBubble text="hi" />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('shows a streaming caret while in progress and hides it when complete', () => {
    render(<ReplyBubble text="hello" streaming />)
    expect(screen.getByTestId('reply-caret')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(40 * 5 + 50)
    })
    expect(screen.queryByTestId('reply-caret')).toBeNull()
  })
})
