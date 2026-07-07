import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { SectionId } from '@/plates/plates.config'

vi.mock('@/analytics/umami', () => ({
  track: vi.fn(),
}))

import { track } from '@/analytics/umami'
import { useTrackSceneReach } from '@/analytics/useTrackSceneReach'

interface HookProps {
  s: SectionId | null
}

describe('useTrackSceneReach', () => {
  beforeEach(() => {
    vi.mocked(track).mockClear()
  })

  it('does not emit when the section is null', () => {
    renderHook(({ s }: HookProps) => useTrackSceneReach(s), {
      initialProps: { s: null },
    })
    expect(track).not.toHaveBeenCalled()
  })

  it('emits once when a section is first reached', () => {
    renderHook(({ s }: HookProps) => useTrackSceneReach(s), {
      initialProps: { s: 'plate-i' },
    })
    expect(track).toHaveBeenCalledTimes(1)
    expect(track).toHaveBeenCalledWith('scene-reached', { scene: 'plate-i' })
  })

  it('does not re-emit when the same section rerenders', () => {
    const { rerender } = renderHook(({ s }: HookProps) => useTrackSceneReach(s), {
      initialProps: { s: 'plate-i' },
    })
    rerender({ s: 'plate-i' })
    rerender({ s: 'plate-i' })
    expect(track).toHaveBeenCalledTimes(1)
  })

  it('emits again for each newly reached section, once per session', () => {
    const { rerender } = renderHook(({ s }: HookProps) => useTrackSceneReach(s), {
      initialProps: { s: 'home' },
    })
    rerender({ s: 'gazetteer' })
    rerender({ s: 'home' }) // revisits do not re-fire
    expect(track).toHaveBeenCalledTimes(2)
    expect(track).toHaveBeenLastCalledWith('scene-reached', { scene: 'gazetteer' })
  })
})
