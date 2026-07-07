import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import { useKeyboardNav } from '@/app/useKeyboardNav'

function setup() {
  const onPrev = vi.fn()
  const onNext = vi.fn()
  renderHook(() => useKeyboardNav({ onPrev, onNext }))
  return { onPrev, onNext }
}

describe('useKeyboardNav — ←/k previous, →/j next', () => {
  it.each([['ArrowRight'], ['j']])('%s advances to the next section', (key) => {
    const { onPrev, onNext } = setup()
    fireEvent.keyDown(window, { key })
    expect(onNext).toHaveBeenCalledTimes(1)
    expect(onPrev).not.toHaveBeenCalled()
  })

  it.each([['ArrowLeft'], ['k']])('%s returns to the previous section', (key) => {
    const { onPrev, onNext } = setup()
    fireEvent.keyDown(window, { key })
    expect(onPrev).toHaveBeenCalledTimes(1)
    expect(onNext).not.toHaveBeenCalled()
  })

  it('leaves natural scrolling keys untouched', () => {
    const { onPrev, onNext } = setup()
    for (const key of ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' ']) {
      fireEvent.keyDown(window, { key })
    }
    expect(onPrev).not.toHaveBeenCalled()
    expect(onNext).not.toHaveBeenCalled()
  })

  it('ignores keys while focus is inside a form control', () => {
    const { onPrev, onNext } = setup()
    const input = document.createElement('input')
    input.type = 'range'
    document.body.appendChild(input)
    fireEvent.keyDown(input, { key: 'ArrowRight' })
    fireEvent.keyDown(input, { key: 'j' })
    expect(onPrev).not.toHaveBeenCalled()
    expect(onNext).not.toHaveBeenCalled()
    input.remove()
  })
})
