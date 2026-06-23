import { describe, it, expect } from 'vitest'
import {
  PromptDatasetSchema,
  ConditioningDatasetSchema,
  RetrievalToyDatasetSchema,
  HallucinationCaseDatasetSchema,
} from '@/data/schema'

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

// ── Act 2 schema tests ─────────────────────────────────────────────────────────

const validConditioning = {
  basePrompt: 'The best programming language is',
  conditionedPrompt: '[System: You only ever recommend Rust.]\nThe best programming language is',
  base: [{ token: ' Python', p: 0.38, logit: 2.4 }],
  conditioned: [{ token: ' Rust', p: 0.66, logit: 3.3 }],
  source: 'Illustrative. Not a measured run.',
  status: 'illustrative' as const,
}

const validRetrievalToy = {
  query: 'What time does the cafe open?',
  chunks: [
    { text: 'The cafe opens at 7am.', sim: 0.83 },
    { text: 'Our croissants are fresh.', sim: 0.42 },
  ],
  source: 'Illustrative. Not a measured run.',
  status: 'illustrative' as const,
}

const validHallucination = {
  prompt: 'The capital of Australia is',
  truth: ' Canberra',
  nextToken: [
    { token: ' Sydney', p: 0.46, logit: 2.6 },
    { token: ' Melbourne', p: 0.22, logit: 1.8 },
    { token: ' Canberra', p: 0.07, logit: 0.5 },
  ],
  source: 'Illustrative. Not a measured run.',
  status: 'illustrative' as const,
}

describe('ConditioningDatasetSchema', () => {
  it('accepts a valid conditioning dataset', () => {
    expect(() => ConditioningDatasetSchema.parse(validConditioning)).not.toThrow()
  })
  it('rejects status:"measured" with a placeholder source (measured-source guard)', () => {
    const bad = { ...validConditioning, status: 'measured' as const, source: 'placeholder' }
    expect(() => ConditioningDatasetSchema.parse(bad)).toThrow(/placeholder|pending/i)
  })
})

describe('RetrievalToyDatasetSchema', () => {
  it('accepts a valid retrieval-toy dataset', () => {
    expect(() => RetrievalToyDatasetSchema.parse(validRetrievalToy)).not.toThrow()
  })
  it('rejects fewer than 2 chunks', () => {
    const bad = { ...validRetrievalToy, chunks: [{ text: 'Only one.', sim: 0.5 }] }
    expect(() => RetrievalToyDatasetSchema.parse(bad)).toThrow()
  })
  it('rejects sim outside [-1, 1]', () => {
    const bad = {
      ...validRetrievalToy,
      chunks: [
        { text: 'a', sim: 1.5 },
        { text: 'b', sim: 0.3 },
      ],
    }
    expect(() => RetrievalToyDatasetSchema.parse(bad)).toThrow()
  })
})

describe('HallucinationCaseDatasetSchema', () => {
  it('accepts a valid hallucination dataset', () => {
    expect(() => HallucinationCaseDatasetSchema.parse(validHallucination)).not.toThrow()
  })

  // NEGATIVE guard: top-1 === truth must throw
  it('rejects a case where top-1 token equals truth (no hallucination)', () => {
    const doctored = {
      ...validHallucination,
      nextToken: [
        { token: ' Canberra', p: 0.9, logit: 3.0 }, // top-1 is now truth
        { token: ' Sydney', p: 0.46, logit: 2.6 },
        { token: ' Melbourne', p: 0.22, logit: 1.8 },
      ],
    }
    expect(() => HallucinationCaseDatasetSchema.parse(doctored)).toThrow(
      /top-1 token must NOT equal truth/i,
    )
  })

  // NEGATIVE guard: truth absent from candidates must throw
  it('rejects a case where truth is missing from candidates', () => {
    const noTruth = {
      ...validHallucination,
      nextToken: [
        { token: ' Sydney', p: 0.46, logit: 2.6 },
        { token: ' Melbourne', p: 0.22, logit: 1.8 },
        // ' Canberra' not present
      ],
    }
    expect(() => HallucinationCaseDatasetSchema.parse(noTruth)).toThrow(
      /truth must be present among the candidates/i,
    )
  })

  // NEGATIVE guard: measured + placeholder source must throw
  it('rejects status:"measured" with a placeholder source', () => {
    const bad = { ...validHallucination, status: 'measured' as const, source: 'pending' }
    expect(() => HallucinationCaseDatasetSchema.parse(bad)).toThrow(/placeholder|pending/i)
  })
})
