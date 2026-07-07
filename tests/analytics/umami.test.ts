import { afterEach, describe, expect, it, vi } from 'vitest'
import { track } from '@/analytics/umami'

describe('umami track wrapper', () => {
  afterEach(() => {
    delete (window as { umami?: unknown }).umami
  })

  it('is a no-op when window.umami is undefined', () => {
    expect(() => track('cta-rail-jump')).not.toThrow()
  })

  it('calls window.umami.track with event name only', () => {
    const trackFn = vi.fn()
    window.umami = { track: trackFn }
    track('cta-rail-jump')
    expect(trackFn).toHaveBeenCalledWith('cta-rail-jump', undefined)
  })

  it('calls window.umami.track with event and props', () => {
    const trackFn = vi.fn()
    window.umami = { track: trackFn }
    track('scene-reached', { scene: 'plate-i' })
    expect(trackFn).toHaveBeenCalledWith('scene-reached', { scene: 'plate-i' })
  })
})
