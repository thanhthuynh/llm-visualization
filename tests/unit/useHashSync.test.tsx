import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useHashSync, parseSectionHash, SECTION_JUMP_EVENT } from '@/app/useHashSync'

describe('parseSectionHash', () => {
  it('strips the #/ prefix', () => {
    expect(parseSectionHash('#/plate-iv')).toBe('plate-iv')
  })
  it('accepts a legacy bare-# prefix', () => {
    expect(parseSectionHash('#gazetteer')).toBe('gazetteer')
  })
  it('lowercases and trims', () => {
    expect(parseSectionHash('#/PLATE-I ')).toBe('plate-i')
  })
})

describe('useHashSync', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('writes the active section as #/{id} via replaceState', () => {
    renderHook(() => useHashSync('plate-ii'))
    expect(window.location.hash).toBe('#/plate-ii')
  })

  it('updates the hash when the active section changes', () => {
    const { rerender } = renderHook(({ id }) => useHashSync(id), {
      initialProps: { id: 'home' },
    })
    rerender({ id: 'plate-vii' })
    expect(window.location.hash).toBe('#/plate-vii')
  })

  it('re-broadcasts external hashchange events as SECTION_JUMP_EVENT', () => {
    const seen = vi.fn()
    const listener = (e: Event) => seen((e as CustomEvent<{ id: string }>).detail.id)
    window.addEventListener(SECTION_JUMP_EVENT, listener)

    renderHook(() => useHashSync('home'))
    window.history.replaceState(null, '', '#/plate-v')
    window.dispatchEvent(new Event('hashchange'))

    expect(seen).toHaveBeenCalledWith('plate-v')
    window.removeEventListener(SECTION_JUMP_EVENT, listener)
  })
})
