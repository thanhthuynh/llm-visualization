import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useScrollSpy } from '@/app/useScrollSpy'

function mountSection(id: string, top: number): HTMLElement {
  const el = document.createElement('section')
  el.id = id
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ top } as DOMRect)
  document.body.appendChild(el)
  return el
}

async function fireScrollAndSettle() {
  window.dispatchEvent(new Event('scroll'))
  await new Promise((resolve) => window.requestAnimationFrame(() => resolve(null)))
}

describe('useScrollSpy — viewport-midpoint rule', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('activates the last section whose top passed the viewport midpoint', async () => {
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
    mountSection('a', -500)
    mountSection('b', 300) // 300 <= 400 → past the midpoint
    mountSection('c', 900) // below the midpoint
    const onActiveChange = vi.fn()

    renderHook(() => useScrollSpy({ ids: ['a', 'b', 'c'], onActiveChange }))
    await fireScrollAndSettle()

    expect(onActiveChange).toHaveBeenLastCalledWith('b')
  })

  it('reports nothing when no section top has passed the midpoint', async () => {
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
    mountSection('a', 600)
    const onActiveChange = vi.fn()

    renderHook(() => useScrollSpy({ ids: ['a'], onActiveChange }))
    await fireScrollAndSettle()

    expect(onActiveChange).not.toHaveBeenCalled()
  })

  it('coalesces bursts of scroll events through requestAnimationFrame', async () => {
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
    mountSection('a', 0)
    const onActiveChange = vi.fn()

    renderHook(() => useScrollSpy({ ids: ['a'], onActiveChange }))
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    await new Promise((resolve) => window.requestAnimationFrame(() => resolve(null)))

    expect(onActiveChange).toHaveBeenCalledTimes(1)
  })

  it('stops listening after unmount', async () => {
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
    mountSection('a', 0)
    const onActiveChange = vi.fn()

    const { unmount } = renderHook(() => useScrollSpy({ ids: ['a'], onActiveChange }))
    unmount()
    await fireScrollAndSettle()

    expect(onActiveChange).not.toHaveBeenCalled()
  })
})
