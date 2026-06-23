import { describe, it, expect } from 'vitest'
import { SCENES, getSceneById, getMountedSceneIds, type SceneId } from '@/scenes/scenes.config'

describe('scenes.config', () => {
  it('has 15 total scenes (6 new + 9 existing)', () => {
    expect(SCENES).toHaveLength(15)
  })

  it('has the exact new macro order (Part 1 before forward-pass)', () => {
    const ids = SCENES.map((s) => s.id)
    expect(ids).toEqual([
      'intro',
      'interlude',
      'window',
      'system',
      'rag',
      'hallucinate',
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

  it('getMountedSceneIds returns 14 scenes', () => {
    expect(getMountedSceneIds()).toEqual([
      'interlude',
      'window',
      'system',
      'rag',
      'hallucinate',
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

  it('first scene is intro', () => {
    expect(SCENES[0].id).toBe('intro')
  })

  it('new window scene has accent window', () => {
    expect(getSceneById('window').accent).toBe('window')
  })

  it('window scene has part part1', () => {
    expect(getSceneById('window').part).toBe('part1')
  })

  it('prompt scene has part part2', () => {
    expect(getSceneById('prompt').part).toBe('part2')
  })

  it('attaches the spec accent token to existing scenes', () => {
    expect(getSceneById('predict').accent).toBe('predict')
    expect(getSceneById('attention').accent).toBe('attention')
  })

  it('uses the cat prompt for the attention scene per spec §3', () => {
    expect(getSceneById('attention').prompt).toBe('The cat sat down because it was tired')
  })

  it('throws for an unknown scene id', () => {
    expect(() => getSceneById('nope' as SceneId)).toThrow(/unknown scene/i)
  })

  it('marks the not-yet-built scenes as not implemented', () => {
    const newIds = ['intro'] as SceneId[]
    for (const id of newIds) {
      expect(getSceneById(id).implemented).toBe(false)
    }
  })

  it('marks the 14 implemented scenes correctly', () => {
    const implementedIds = SCENES.filter((s) => s.implemented).map((s) => s.id)
    expect(implementedIds).toEqual([
      'interlude',
      'window',
      'system',
      'rag',
      'hallucinate',
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
