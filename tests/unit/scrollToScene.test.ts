import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { __setReducedMotion } from '../setup'
import { scrollToScene } from '@/app/scrollToScene'

describe('scrollToScene', () => {
  let el: HTMLDivElement
  let scrollSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    el = document.createElement('div')
    el.id = 'x'
    document.body.appendChild(el)
    scrollSpy = vi.fn()
    el.scrollIntoView = scrollSpy
  })

  afterEach(() => {
    el.remove()
  })

  it('calls scrollIntoView with smooth behavior when smooth:true and reduced-motion is OFF', () => {
    __setReducedMotion(false)
    scrollToScene('x', { smooth: true })
    expect(scrollSpy).toHaveBeenCalledOnce()
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })

  it('calls scrollIntoView with auto behavior when smooth:true but reduced-motion is ON', () => {
    __setReducedMotion(true)
    scrollToScene('x', { smooth: true })
    expect(scrollSpy).toHaveBeenCalledOnce()
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
  })

  it('calls scrollIntoView with auto behavior when no smooth option is passed', () => {
    __setReducedMotion(false)
    scrollToScene('x')
    expect(scrollSpy).toHaveBeenCalledOnce()
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
  })

  it('does not throw and does not call scrollIntoView when the element is missing', () => {
    expect(() => scrollToScene('missing')).not.toThrow()
    expect(scrollSpy).not.toHaveBeenCalled()
  })
})
