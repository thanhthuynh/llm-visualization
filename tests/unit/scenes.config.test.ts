import { describe, it, expect } from 'vitest'
import { SCENES, getSceneById, type SceneId } from '@/scenes/scenes.config'

describe('scenes.config', () => {
  it('exposes 7 pipeline scenes plus compare plus about', () => {
    expect(SCENES).toHaveLength(9)
    const ids = SCENES.map((s) => s.id)
    expect(ids).toEqual([
      'prompt',
      'tokenize',
      'embed',
      'attention',
      'predict',
      'decode',
      'output',
      'compare',
      'about',
    ])
  })

  it('attaches the spec accent token to each scene', () => {
    expect(getSceneById('predict').accent).toBe('predict')
    expect(getSceneById('attention').accent).toBe('attention')
  })

  it('uses the cat prompt for the attention scene per spec §3', () => {
    expect(getSceneById('attention').prompt).toBe('The cat sat down because it was tired')
  })

  it('throws for an unknown scene id', () => {
    expect(() => getSceneById('nope' as SceneId)).toThrow(/unknown scene/i)
  })

  it('marks the currently-mounted scenes as implemented', () => {
    const implementedIds = SCENES.filter((s) => s.implemented).map((s) => s.id)
    expect(implementedIds).toEqual([
      'prompt',
      'tokenize',
      'embed',
      'attention',
      'predict',
      'decode',
      'output',
      'compare',
      'about',
    ])
  })
})
