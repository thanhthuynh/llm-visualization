import { describe, it, expect } from 'vitest'
import conditioning from '@/data/prompts/conditioning.json'
import { ConditioningDatasetSchema } from '@/data/schema'

describe('conditioning.json', () => {
  it('matches the schema', () => {
    expect(() => ConditioningDatasetSchema.parse(conditioning)).not.toThrow()
  })

  it('base top-1 token differs from conditioned top-1 (system prompt shifted the winner)', () => {
    const ds = ConditioningDatasetSchema.parse(conditioning)
    const baseTop1 = [...ds.base].sort((a, b) => b.p - a.p)[0]
    const condTop1 = [...ds.conditioned].sort((a, b) => b.p - a.p)[0]
    expect(baseTop1).toBeDefined()
    expect(condTop1).toBeDefined()
    expect(baseTop1!.token).not.toBe(condTop1!.token)
  })

  it('status is "illustrative" (provenance guard)', () => {
    expect((conditioning as { status: string }).status).toBe('illustrative')
  })

  it('source contains "Not a measured run."', () => {
    expect((conditioning as { source: string }).source).toMatch(/not a measured run/i)
  })
})
