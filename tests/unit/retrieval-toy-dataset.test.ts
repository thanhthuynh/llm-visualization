import { describe, it, expect } from 'vitest'
import retrievalToy from '@/data/prompts/retrieval-toy.json'
import { RetrievalToyDatasetSchema } from '@/data/schema'

describe('retrieval-toy.json', () => {
  it('matches the schema', () => {
    expect(() => RetrievalToyDatasetSchema.parse(retrievalToy)).not.toThrow()
  })

  it('has at least 2 chunks', () => {
    expect((retrievalToy as { chunks: unknown[] }).chunks.length).toBeGreaterThanOrEqual(2)
  })

  it('all sim values are in [-1, 1]', () => {
    const ds = RetrievalToyDatasetSchema.parse(retrievalToy)
    ds.chunks.forEach((chunk) => {
      expect(chunk.sim).toBeGreaterThanOrEqual(-1)
      expect(chunk.sim).toBeLessThanOrEqual(1)
    })
  })

  it('argmax(sim) is chunks[0] — the retrieved answer chunk', () => {
    const ds = RetrievalToyDatasetSchema.parse(retrievalToy)
    const maxSim = Math.max(...ds.chunks.map((c) => c.sim))
    expect(ds.chunks[0].sim).toBe(maxSim)
  })

  it('status is "illustrative" (provenance guard)', () => {
    expect((retrievalToy as { status: string }).status).toBe('illustrative')
  })

  it('source contains "Not a measured run."', () => {
    expect((retrievalToy as { source: string }).source).toMatch(/not a measured run/i)
  })
})
