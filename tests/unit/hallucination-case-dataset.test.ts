import { describe, it, expect } from 'vitest'
import hallucinationCase from '@/data/prompts/hallucination-case.json'
import { HallucinationCaseDatasetSchema } from '@/data/schema'

describe('hallucination-case.json', () => {
  it('matches the schema', () => {
    expect(() => HallucinationCaseDatasetSchema.parse(hallucinationCase)).not.toThrow()
  })

  it('top-1 token is NOT the truth (model is confidently wrong)', () => {
    const ds = HallucinationCaseDatasetSchema.parse(hallucinationCase)
    const top1 = [...ds.nextToken].sort((a, b) => b.p - a.p)[0]
    const norm = (t: string) => t.trim().toLowerCase()
    expect(top1).toBeDefined()
    expect(norm(top1!.token)).not.toBe(norm(ds.truth))
  })

  it('truth IS present among the candidates', () => {
    const ds = HallucinationCaseDatasetSchema.parse(hallucinationCase)
    const norm = (t: string) => t.trim().toLowerCase()
    const found = ds.nextToken.some((c) => norm(c.token) === norm(ds.truth))
    expect(found).toBe(true)
  })

  it('status is "illustrative" (provenance guard)', () => {
    expect((hallucinationCase as { status: string }).status).toBe('illustrative')
  })

  it('source contains "Not a measured run."', () => {
    expect((hallucinationCase as { source: string }).source).toMatch(/not a measured run/i)
  })
})
