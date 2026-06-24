import { describe, it, expect } from 'vitest'
import {
  loadPromptDataset,
  loadConditioning,
  loadRetrievalToy,
  loadHallucinationCase,
  type PromptId,
} from '@/data/loader'

describe('loadPromptDataset', () => {
  it('loads sky dataset', () => {
    const ds = loadPromptDataset('sky')
    expect(ds.prompt).toBe('The sky is')
    expect(ds.tokens[0].id).toBe(464)
  })
  it('throws for unknown prompt ids', () => {
    expect(() => loadPromptDataset('nope' as PromptId)).toThrow(/unknown prompt/i)
  })
})

describe('loadConditioning', () => {
  it('returns a parsed ConditioningDataset', () => {
    const ds = loadConditioning()
    expect(ds.basePrompt).toBeTruthy()
    expect(ds.conditionedPrompt).toBeTruthy()
    expect(ds.base.length).toBeGreaterThan(0)
    expect(ds.conditioned.length).toBeGreaterThan(0)
    expect(ds.status).toBe('illustrative')
  })
})

describe('loadRetrievalToy', () => {
  it('returns a parsed RetrievalToyDataset', () => {
    const ds = loadRetrievalToy()
    expect(ds.query).toBeTruthy()
    expect(ds.chunks.length).toBeGreaterThanOrEqual(2)
    expect(ds.status).toBe('illustrative')
  })
})

describe('loadHallucinationCase', () => {
  it('returns a parsed HallucinationCaseDataset', () => {
    const ds = loadHallucinationCase()
    expect(ds.prompt).toBeTruthy()
    expect(ds.truth).toBeTruthy()
    expect(ds.nextToken.length).toBeGreaterThan(0)
    expect(ds.status).toBe('illustrative')
  })
})
