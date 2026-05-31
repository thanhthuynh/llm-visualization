import { describe, it, expect } from 'vitest'
import { PromptDatasetSchema } from '@/data/schema'

const valid = {
  prompt: 'The sky is',
  source: 'GPT-2 small, run offline — illustrative reference model',
  tokens: [
    { text: 'The', id: 464 },
    { text: ' sky', id: 6766 },
    { text: ' is', id: 318 },
  ],
  nextToken: [
    { token: ' blue', p: 0.71, logit: 3.1 },
    { token: ' not', p: 0.06, logit: 0.9 },
  ],
  embedding2d: [
    [0.12, -0.44],
    [-0.3, 0.5],
    [0.05, 0.1],
  ],
  attention: { heads: [[[1]]] },
  bytes: { ' blue': '62 6c 75 65' },
}

describe('PromptDatasetSchema', () => {
  it('accepts a valid dataset', () => {
    expect(() => PromptDatasetSchema.parse(valid)).not.toThrow()
  })
  it('rejects a dataset without source', () => {
    const { source: _src, ...withoutSource } = valid
    void _src
    expect(() => PromptDatasetSchema.parse(withoutSource)).toThrow(/source/i)
  })
  it('rejects probabilities outside [0, 1]', () => {
    const bad = { ...valid, nextToken: [{ token: 'x', p: 1.5, logit: 0 }] }
    expect(() => PromptDatasetSchema.parse(bad)).toThrow()
  })
  it('rejects empty token arrays', () => {
    const bad = { ...valid, tokens: [] }
    expect(() => PromptDatasetSchema.parse(bad)).toThrow()
  })
})
