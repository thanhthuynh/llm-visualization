import { afterEach, describe, expect, it, vi } from 'vitest'
import { scrollToScene, prefersReducedMotion } from '@/app/scrollToScene'
import { setStageZoom } from '@/app/stageZoom'
import { __setReducedMotion } from '../setup'

function mountTarget(id: string, top: number): HTMLElement {
  const el = document.createElement('section')
  el.id = id
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ top } as DOMRect)
  document.body.appendChild(el)
  return el
}

describe('scrollToScene — header-offset scrolling', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    setStageZoom(1)
    vi.restoreAllMocks()
  })

  it('scrolls to the element top minus header height × zoom + 26px gap', () => {
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true })
    mountTarget('plate-iii', 1000)
    setStageZoom(1)

    scrollToScene('plate-iii')
    // 1000 + 200 - (60 × 1 + 26) = 1114
    expect(scrollTo).toHaveBeenCalledWith({ top: 1114, behavior: 'auto' })
  })

  it('accounts for the stage zoom in the header offset', () => {
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    mountTarget('plate-i', 500)
    setStageZoom(0.5)

    scrollToScene('plate-i')
    // 500 + 0 - (60 × 0.5 + 26) = 444
    expect(scrollTo).toHaveBeenCalledWith({ top: 444, behavior: 'auto' })
  })

  it('clamps to the top of the document', () => {
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    mountTarget('home', 10)

    scrollToScene('home')
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
  })

  it('scrolls smoothly on request but instantly under reduced motion', () => {
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    mountTarget('gazetteer', 2000)

    scrollToScene('gazetteer', { smooth: true })
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ behavior: 'smooth' }))

    __setReducedMotion(true)
    scrollToScene('gazetteer', { smooth: true })
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ behavior: 'auto' }))
  })

  it('no-ops when the element is not mounted', () => {
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    scrollToScene('missing')
    expect(scrollTo).not.toHaveBeenCalled()
  })
})

describe('prefersReducedMotion', () => {
  it('reflects the media query at call time', () => {
    expect(prefersReducedMotion()).toBe(false)
    __setReducedMotion(true)
    expect(prefersReducedMotion()).toBe(true)
  })
})
