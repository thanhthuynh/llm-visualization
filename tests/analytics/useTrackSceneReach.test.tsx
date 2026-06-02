import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { SceneId } from '@/scenes/scenes.config'
import type { Depth } from '@/app/DepthContext'

vi.mock('@/analytics/umami', () => ({
  track: vi.fn(),
}))

import { track } from '@/analytics/umami'
import { useTrackSceneReach } from '@/analytics/useTrackSceneReach'

interface HookProps {
  s: SceneId | null
  d: Depth
}

describe('useTrackSceneReach', () => {
  beforeEach(() => {
    vi.mocked(track).mockClear()
  })

  it('does not emit when sceneId is null', () => {
    renderHook(({ s, d }: HookProps) => useTrackSceneReach(s, d), {
      initialProps: { s: null, d: 'surface' },
    })
    expect(track).not.toHaveBeenCalled()
  })

  it('emits once when a scene is first reached', () => {
    renderHook(({ s, d }: HookProps) => useTrackSceneReach(s, d), {
      initialProps: { s: 'prompt', d: 'surface' },
    })
    expect(track).toHaveBeenCalledTimes(1)
    expect(track).toHaveBeenCalledWith('scene-reached', { scene: 'prompt', depth: 'surface' })
  })

  it('does not re-emit when same scene rerenders', () => {
    const { rerender } = renderHook(({ s, d }: HookProps) => useTrackSceneReach(s, d), {
      initialProps: { s: 'prompt', d: 'surface' },
    })
    rerender({ s: 'prompt', d: 'surface' })
    rerender({ s: 'prompt', d: 'surface' })
    expect(track).toHaveBeenCalledTimes(1)
  })

  it('emits again when a different scene is reached', () => {
    const { rerender } = renderHook(({ s, d }: HookProps) => useTrackSceneReach(s, d), {
      initialProps: { s: 'prompt', d: 'surface' },
    })
    rerender({ s: 'tokenize', d: 'surface' })
    expect(track).toHaveBeenCalledTimes(2)
    expect(track).toHaveBeenLastCalledWith('scene-reached', {
      scene: 'tokenize',
      depth: 'surface',
    })
  })

  it('does not re-emit when depth changes for an already-reached scene', () => {
    const { rerender } = renderHook(({ s, d }: HookProps) => useTrackSceneReach(s, d), {
      initialProps: { s: 'prompt', d: 'surface' },
    })
    rerender({ s: 'prompt', d: 'deep' })
    expect(track).toHaveBeenCalledTimes(1)
  })
})
