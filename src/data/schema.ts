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

// ── Act 2 schemas ──────────────────────────────────────────────────────────────

export const DatasetStatusSchema = z.enum(['illustrative', 'measured'])
export type DatasetStatus = z.infer<typeof DatasetStatusSchema>

/** Shared guard: a 'measured' dataset must not carry a placeholder/pending source. */
function refineMeasuredSource(d: { status: DatasetStatus; source: string }, ctx: z.RefinementCtx) {
  if (d.status === 'measured' && /placeholder|pending/i.test(d.source)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'measured dataset source must not be placeholder/pending',
    })
  }
}

export const ConditioningDatasetSchema = z
  .object({
    basePrompt: z.string().min(1),
    conditionedPrompt: z.string().min(1),
    base: z.array(NextTokenCandidateSchema).min(1),
    conditioned: z.array(NextTokenCandidateSchema).min(1),
    source: z.string().min(1),
    status: DatasetStatusSchema,
  })
  .superRefine(refineMeasuredSource)

export const RetrievalToyDatasetSchema = z
  .object({
    query: z.string().min(1),
    chunks: z.array(z.object({ text: z.string().min(1), sim: z.number().min(-1).max(1) })).min(2),
    source: z.string().min(1),
    status: DatasetStatusSchema,
  })
  .superRefine(refineMeasuredSource)

export const HallucinationCaseDatasetSchema = z
  .object({
    prompt: z.string().min(1),
    truth: z.string().min(1),
    nextToken: z.array(NextTokenCandidateSchema).min(1),
    source: z.string().min(1),
    status: DatasetStatusSchema,
  })
  .superRefine((d, ctx) => {
    refineMeasuredSource(d, ctx)
    const norm = (t: string) => t.trim().toLowerCase()
    const top1 = [...d.nextToken].sort((a, b) => b.p - a.p)[0]
    if (top1 && norm(top1.token) === norm(d.truth)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'hallucination case: top-1 token must NOT equal truth (the model is confidently wrong)',
      })
    }
    if (!d.nextToken.some((c) => norm(c.token) === norm(d.truth))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'hallucination case: truth must be present among the candidates',
      })
    }
  })

export type ConditioningDataset = z.infer<typeof ConditioningDatasetSchema>
export type RetrievalToyDataset = z.infer<typeof RetrievalToyDatasetSchema>
export type HallucinationCaseDataset = z.infer<typeof HallucinationCaseDatasetSchema>
