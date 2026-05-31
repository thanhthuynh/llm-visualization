import sky from '@/data/prompts/sky.json'
import cat from '@/data/prompts/cat.json'
import { PromptDatasetSchema, type PromptDataset } from './schema'

export type PromptId = 'sky' | 'cat'

const RAW: Record<PromptId, unknown> = { sky, cat }

export function loadPromptDataset(id: PromptId): PromptDataset {
  if (!(id in RAW)) throw new Error(`unknown prompt id: ${id}`)
  return PromptDatasetSchema.parse(RAW[id])
}
