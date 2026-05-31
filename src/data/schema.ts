import { z } from 'zod'

export const TokenSchema = z.object({
  text: z.string(),
  id: z.number().int().nonnegative(),
})

export const NextTokenCandidateSchema = z.object({
  token: z.string(),
  p: z.number().min(0).max(1),
  logit: z.number(),
})

export const PromptDatasetSchema = z.object({
  prompt: z.string().min(1),
  source: z.string().min(1, 'provenance source is required'),
  tokens: z.array(TokenSchema).min(1),
  nextToken: z.array(NextTokenCandidateSchema).min(1),
  embedding2d: z.array(z.tuple([z.number(), z.number()])).min(1),
  attention: z.object({
    heads: z.array(z.array(z.array(z.number().min(0).max(1)))),
  }),
  bytes: z.record(z.string(), z.string()),
})

export type Token = z.infer<typeof TokenSchema>
export type NextTokenCandidate = z.infer<typeof NextTokenCandidateSchema>
export type PromptDataset = z.infer<typeof PromptDatasetSchema>
