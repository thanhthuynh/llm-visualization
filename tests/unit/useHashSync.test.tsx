/* eslint-disable no-undef */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import { useHashSync } from '@/app/useHashSync'

function Probe({ active }: { active: string }) {
  useHashSync(active)
  return null
}

describe('useHashSync', () => {
  beforeEach(() => history.replaceState(null, '', '/'))

  it('writes the active id to the URL hash', () => {
    render(<Probe active="predict" />)
    expect(window.location.hash).toBe('#predict')
  })

  it('emits a scene-jump event when the hash changes externally', () => {
    const handler = vi.fn()
    window.addEventListener('llm-explainer:scene-jump', handler as EventListener)
    render(<Probe active="prompt" />)
    act(() => {
      window.location.hash = '#attention'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(handler).toHaveBeenCalled()
    const detail = (handler.mock.calls[0][0] as CustomEvent).detail
    expect(detail).toEqual({ id: 'attention' })
    window.removeEventListener('llm-explainer:scene-jump', handler as EventListener)
  })

  it('does not rewrite the URL hash when activeId already matches the hash on mount', () => {
    history.replaceState(null, '', '/explorer#decode')
    const spy = vi.spyOn(window.history, 'replaceState')
    render(<Probe active="decode" />)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
