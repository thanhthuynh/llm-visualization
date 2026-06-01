import { describe, it, expect } from 'vitest'
import {
  COMPARE_CONFIG,
  type Tier,
  type ContextWindow,
  type TokenizerExample,
  type Philosophy,
  type LineupEntry,
} from '@/data/compare.config'

describe('compare.config', () => {
  it('exposes a lastUpdated ISO date', () => {
    expect(COMPARE_CONFIG.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('lists at least two context-window entries near 1M tokens', () => {
    const windows: ContextWindow[] = [...COMPARE_CONFIG.contextWindows]
    expect(windows.length).toBeGreaterThanOrEqual(2)
    windows.forEach((w) => {
      expect(w.tokens).toBeGreaterThanOrEqual(200_000)
      expect(w.tier).toMatch(/^[abc]$/)
    })
  })

  it('contains exactly two tokenizer examples (Claude + GPT)', () => {
    const tk: TokenizerExample[] = [...COMPARE_CONFIG.tokenizerExamples]
    expect(tk).toHaveLength(2)
    tk.forEach((t) => {
      expect(t.prompt.length).toBeGreaterThan(0)
      expect(t.tokenCount).toBeGreaterThan(0)
    })
  })

  it('lists two post-training philosophies', () => {
    const phils: Philosophy[] = [...COMPARE_CONFIG.philosophies]
    expect(phils).toHaveLength(2)
    expect(phils.map((p) => p.title).join(' ')).toMatch(/constitutional|rlhf/i)
  })

  it('lists a model lineup with at least 4 entries', () => {
    const lineup: LineupEntry[] = [...COMPARE_CONFIG.modelLineup]
    expect(lineup.length).toBeGreaterThanOrEqual(4)
    lineup.forEach((m) => {
      expect(m.name.length).toBeGreaterThan(0)
      expect(m.tier).toMatch(/^[abc]$/)
    })
  })

  it("Tier type is the literal union 'a' | 'b' | 'c'", () => {
    const valid: Tier[] = ['a', 'b', 'c']
    expect(valid).toEqual(['a', 'b', 'c'])
  })
})
