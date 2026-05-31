import { describe, it, expect } from 'vitest'
import { loadPromptDataset, type PromptId } from '@/data/loader'

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
