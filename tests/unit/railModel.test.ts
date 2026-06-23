import { describe, it, expect } from 'vitest'
import { buildRailModel } from '@/components/railModel'
import type { SceneConfig } from '@/scenes/scenes.config'

// Synthetic minimal SceneConfig factory
function makeScene(overrides: Partial<SceneConfig> & { id: SceneConfig['id'] }): SceneConfig {
  return {
    title: overrides.id,
    accent: null,
    prompt: '',
    railLabel: overrides.id.toUpperCase(),
    implemented: true,
    ...overrides,
  }
}

const COMPARE = makeScene({ id: 'compare', accent: 'predict', railLabel: 'COMPARE' })
const ABOUT = makeScene({ id: 'about', accent: null, railLabel: null })

describe('buildRailModel', () => {
  it('always starts with an intro item', () => {
    const result = buildRailModel([COMPARE, ABOUT])
    expect(result[0]).toEqual({ kind: 'intro' })
  })

  it('with no implemented part1/part2 stations: only intro + compare + about, no group labels, no part divider', () => {
    const result = buildRailModel([COMPARE, ABOUT])
    const kinds = result.map((i) => i.kind)
    expect(kinds[0]).toBe('intro')
    expect(kinds).not.toContain('group-label')
    // No divider between parts (there are none)
    // There may still be a divider before compare/about — but only when stations exist
    const dividerCount = kinds.filter((k) => k === 'divider').length
    expect(dividerCount).toBe(0)
    expect(kinds).toContain('compare')
    expect(kinds).toContain('about')
  })

  it('with 2 part1 + 3 part2 implemented stations: correct structure', () => {
    const scenes: readonly SceneConfig[] = [
      makeScene({ id: 'window', accent: 'window', part: 'part1' }),
      makeScene({ id: 'system', accent: 'system', part: 'part1' }),
      makeScene({ id: 'prompt', accent: 'prompt', part: 'part2' }),
      makeScene({ id: 'tokenize', accent: 'tokenize', part: 'part2' }),
      makeScene({ id: 'embed', accent: 'embed', part: 'part2' }),
      COMPARE,
      ABOUT,
    ]
    const result = buildRailModel(scenes)

    // First item is intro
    expect(result[0]).toEqual({ kind: 'intro' })

    // Has part1 group-label
    const part1Label = result.find((i) => i.kind === 'group-label' && i.part === 'part1')
    expect(part1Label).toBeDefined()
    if (part1Label && part1Label.kind === 'group-label') {
      expect(part1Label.label).toBe('PART 1')
    }

    // Has part2 group-label
    const part2Label = result.find((i) => i.kind === 'group-label' && i.part === 'part2')
    expect(part2Label).toBeDefined()
    if (part2Label && part2Label.kind === 'group-label') {
      expect(part2Label.label).toBe('PART 2')
    }

    // Stations numbered contiguously 1-5
    const stations = result.filter((i) => i.kind === 'station')
    expect(stations).toHaveLength(5)
    const numbers = stations.map((i) => (i.kind === 'station' ? i.number : -1))
    expect(numbers).toEqual([1, 2, 3, 4, 5])

    // Part1 stations numbered 1, 2
    const part1Stations = result.filter((i) => i.kind === 'station' && i.scene.part === 'part1')
    expect(part1Stations.map((i) => (i.kind === 'station' ? i.number : -1))).toEqual([1, 2])

    // Part2 stations numbered 3, 4, 5
    const part2Stations = result.filter((i) => i.kind === 'station' && i.scene.part === 'part2')
    expect(part2Stations.map((i) => (i.kind === 'station' ? i.number : -1))).toEqual([3, 4, 5])

    // Divider between part1 and part2
    const part1LabelIdx = result.findIndex((i) => i.kind === 'group-label' && i.part === 'part1')
    const part2LabelIdx = result.findIndex((i) => i.kind === 'group-label' && i.part === 'part2')
    const betweenParts = result.slice(part1LabelIdx, part2LabelIdx)
    expect(betweenParts.some((i) => i.kind === 'divider')).toBe(true)

    // Ends with compare then about
    const lastTwo = result.slice(-2)
    expect(lastTwo[0]?.kind).toBe('compare')
    expect(lastTwo[1]?.kind).toBe('about')
  })

  it('with 0 part1 implemented stations: no part1 group-label in output', () => {
    const scenes: readonly SceneConfig[] = [
      makeScene({ id: 'prompt', accent: 'prompt', part: 'part2' }),
      makeScene({ id: 'tokenize', accent: 'tokenize', part: 'part2' }),
      COMPARE,
      ABOUT,
    ]
    const result = buildRailModel(scenes)
    const part1Label = result.find((i) => i.kind === 'group-label' && i.part === 'part1')
    expect(part1Label).toBeUndefined()
  })

  it('with only part2 stations: no divider between parts, has divider before compare', () => {
    const scenes: readonly SceneConfig[] = [
      makeScene({ id: 'prompt', accent: 'prompt', part: 'part2' }),
      COMPARE,
      ABOUT,
    ]
    const result = buildRailModel(scenes)
    const kinds = result.map((i) => i.kind)

    // Should have exactly one divider (before compare/about)
    expect(kinds.filter((k) => k === 'divider')).toHaveLength(1)

    // No part1 group label
    expect(result.find((i) => i.kind === 'group-label' && i.part === 'part1')).toBeUndefined()
    // Has part2 group label
    expect(result.find((i) => i.kind === 'group-label' && i.part === 'part2')).toBeDefined()
  })

  it('numbering is contiguous across part1 and part2', () => {
    const scenes: readonly SceneConfig[] = [
      makeScene({ id: 'window', accent: 'window', part: 'part1' }),
      makeScene({ id: 'system', accent: 'system', part: 'part1' }),
      makeScene({ id: 'rag', accent: 'rag', part: 'part1' }),
      makeScene({ id: 'hallucinate', accent: 'hallucinate', part: 'part1' }),
      makeScene({ id: 'prompt', accent: 'prompt', part: 'part2' }),
      makeScene({ id: 'tokenize', accent: 'tokenize', part: 'part2' }),
      makeScene({ id: 'embed', accent: 'embed', part: 'part2' }),
      makeScene({ id: 'attention', accent: 'attention', part: 'part2' }),
      makeScene({ id: 'predict', accent: 'predict', part: 'part2' }),
      makeScene({ id: 'decode', accent: 'decode', part: 'part2' }),
      makeScene({ id: 'output', accent: 'output', part: 'part2' }),
      COMPARE,
      ABOUT,
    ]
    const result = buildRailModel(scenes)
    const numbers = result
      .filter((i) => i.kind === 'station')
      .map((i) => (i.kind === 'station' ? i.number : -1))
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })
})
