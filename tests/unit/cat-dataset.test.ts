import { describe, it, expect } from 'vitest'
import cat from '@/data/prompts/cat.json'
import { PromptDatasetSchema } from '@/data/schema'

describe('cat.json', () => {
  it('matches the schema', () => {
    expect(() => PromptDatasetSchema.parse(cat)).not.toThrow()
  })

  it('has 8 tokens for "The cat sat down because it was tired"', () => {
    const tokens = (cat as { tokens: Array<{ text: string }> }).tokens
    expect(tokens.map((t) => t.text)).toEqual([
      'The',
      ' cat',
      ' sat',
      ' down',
      ' because',
      ' it',
      ' was',
      ' tired',
    ])
  })

  it('has 3 attention heads of 8x8 each', () => {
    const heads = (cat as { attention: { heads: number[][][] } }).attention.heads
    expect(heads).toHaveLength(3)
    heads.forEach((head) => {
      expect(head).toHaveLength(8)
      head.forEach((row) => expect(row).toHaveLength(8))
    })
  })

  it("row 5 of head 0 (the 'it' query) matches the spec example weights", () => {
    const itRow = (cat as { attention: { heads: number[][][] } }).attention.heads[0][5]
    expect(itRow[1]).toBeCloseTo(0.61, 2) // cat
    expect(itRow[4]).toBeCloseTo(0.14, 2) // because
    expect(itRow[2]).toBeCloseTo(0.09, 2) // sat
    expect(itRow[3]).toBeCloseTo(0.08, 2) // down
    expect(itRow[0]).toBeCloseTo(0.05, 2) // The
  })

  it('respects the causal mask — upper triangle is all 0', () => {
    const heads = (cat as { attention: { heads: number[][][] } }).attention.heads
    heads.forEach((head) => {
      head.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (j > i) expect(cell).toBe(0)
        })
      })
    })
  })

  it('each row sums to ~1', () => {
    const heads = (cat as { attention: { heads: number[][][] } }).attention.heads
    heads.forEach((head) => {
      head.forEach((row) => {
        const sum = row.reduce((a, b) => a + b, 0)
        expect(sum).toBeGreaterThanOrEqual(0.99)
        expect(sum).toBeLessThanOrEqual(1.01)
      })
    })
  })

  it('labels itself as illustrative', () => {
    expect((cat as { source: string }).source.toLowerCase()).toMatch(/illustrative|gpt-2/)
  })
})
