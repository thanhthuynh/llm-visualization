import { describe, it, expect } from 'vitest'
import sky from '@/data/prompts/sky.json'
import { PromptDatasetSchema } from '@/data/schema'

describe('sky.json', () => {
  it('matches the schema', () => {
    expect(() => PromptDatasetSchema.parse(sky)).not.toThrow()
  })
  it('uses the GPT-2 illustrative token IDs from the mockup (464/6766/318)', () => {
    const ids = (sky as { tokens: Array<{ id: number }> }).tokens.map((t) => t.id)
    expect(ids).toEqual([464, 6766, 318])
  })
  it("top next-token is ' blue' at 0.71 (matches mockup §3 Scene 4)", () => {
    const top = (sky as { nextToken: Array<{ token: string; p: number }> }).nextToken[0]
    expect(top.token).toBe(' blue')
    expect(top.p).toBeCloseTo(0.71, 2)
  })
  it('source labels the dataset as illustrative', () => {
    expect((sky as { source: string }).source.toLowerCase()).toMatch(/illustrative|gpt-2/)
  })
})
