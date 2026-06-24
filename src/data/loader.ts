import sky from '@/data/prompts/sky.json'
import cat from '@/data/prompts/cat.json'
import conditioning from '@/data/prompts/conditioning.json'
import retrievalToy from '@/data/prompts/retrieval-toy.json'
import hallucinationCase from '@/data/prompts/hallucination-case.json'
import {
  PromptDatasetSchema,
  ConditioningDatasetSchema,
  RetrievalToyDatasetSchema,
  HallucinationCaseDatasetSchema,
  type PromptDataset,
  type ConditioningDataset,
  type RetrievalToyDataset,
  type HallucinationCaseDataset,
} from './schema'

export type PromptId = 'sky' | 'cat'

const RAW: Record<PromptId, unknown> = { sky, cat }

export function loadPromptDataset(id: PromptId): PromptDataset {
  if (!(id in RAW)) throw new Error(`unknown prompt id: ${id}`)
  return PromptDatasetSchema.parse(RAW[id])
}

export function loadConditioning(): ConditioningDataset {
  return ConditioningDatasetSchema.parse(conditioning)
}

export function loadRetrievalToy(): RetrievalToyDataset {
  return RetrievalToyDatasetSchema.parse(retrievalToy)
}

export function loadHallucinationCase(): HallucinationCaseDataset {
  return HallucinationCaseDatasetSchema.parse(hallucinationCase)
}
