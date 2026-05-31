import sky from '@/data/prompts/sky.json'
import { PromptDatasetSchema, type PromptDataset } from './schema'

export type PromptId = 'sky'

const RAW: Record<PromptId, unknown> = { sky }

export function loadPromptDataset(id: PromptId): PromptDataset {
  if (!(id in RAW)) throw new Error(`unknown prompt id: ${id}`)
  return PromptDatasetSchema.parse(RAW[id])
}
