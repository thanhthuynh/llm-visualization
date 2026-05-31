import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { useKeyboardNav } from '@/app/useKeyboardNav'

function Probe({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  useKeyboardNav({ onPrev, onNext })
  return <div data-testid="probe" />
}

describe('useKeyboardNav', () => {
  it('calls onNext on ArrowDown', () => {
    const onPrev = vi.fn(),
      onNext = vi.fn()
    render(<Probe onPrev={onPrev} onNext={onNext} />)
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    expect(onNext).toHaveBeenCalledOnce()
    expect(onPrev).not.toHaveBeenCalled()
  })

  it('calls onPrev on PageUp', () => {
    const onPrev = vi.fn(),
      onNext = vi.fn()
    render(<Probe onPrev={onPrev} onNext={onNext} />)
    fireEvent.keyDown(window, { key: 'PageUp' })
    expect(onPrev).toHaveBeenCalledOnce()
  })

  it('ignores keys when target is an input', () => {
    const onPrev = vi.fn(),
      onNext = vi.fn()
    const { container } = render(
      <>
        <input />
        <Probe onPrev={onPrev} onNext={onNext} />
      </>,
    )
    const input = container.querySelector('input')!
    input.focus()
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(onNext).not.toHaveBeenCalled()
  })
})
