export type Tier = 'a' | 'b' | 'c'

export interface ContextWindow {
  vendor: 'anthropic' | 'openai'
  family: string
  tokens: number
  tier: Tier
}

export interface TokenizerExample {
  vendor: 'anthropic' | 'openai'
  label: string
  prompt: string
  tokenCount: number
  note: string
}

export interface Philosophy {
  vendor: 'anthropic' | 'openai'
  title: string
  description: string
  publicDoc: string
  tier: Tier
}

export interface LineupEntry {
  vendor: 'anthropic' | 'openai'
  name: string
  family: string
  tier: Tier
}

export interface CompareConfig {
  lastUpdated: string
  contextWindows: ReadonlyArray<ContextWindow>
  tokenizerExamples: ReadonlyArray<TokenizerExample>
  philosophies: ReadonlyArray<Philosophy>
  modelLineup: ReadonlyArray<LineupEntry>
}

export const COMPARE_CONFIG: CompareConfig = {
  lastUpdated: '2026-05-31',
  contextWindows: [
    { vendor: 'anthropic', family: 'Claude Opus / Sonnet (API)', tokens: 1_000_000, tier: 'a' },
    { vendor: 'openai', family: 'GPT-5.5 (API)', tokens: 1_000_000, tier: 'a' },
  ],
  tokenizerExamples: [
    {
      vendor: 'anthropic',
      label: 'Claude (proprietary BPE)',
      prompt: 'The cat sat down because it was tired',
      tokenCount: 9,
      note: 'Illustrative — Anthropic does not publish the tokenizer.',
    },
    {
      vendor: 'openai',
      label: 'GPT (tiktoken o200k-family)',
      prompt: 'The cat sat down because it was tired',
      tokenCount: 8,
      note: 'Illustrative — GPT uses the public tiktoken o200k tokenizer.',
    },
  ],
  philosophies: [
    {
      vendor: 'anthropic',
      title: 'Constitutional AI / RLAIF',
      description:
        'Anthropic publishes a constitution — a list of principles the model is trained to follow. Outputs are scored by another model against those principles, then the policy is updated.',
      publicDoc: 'Anthropic constitution',
      tier: 'a',
    },
    {
      vendor: 'openai',
      title: 'RLHF + Model Spec',
      description:
        'OpenAI uses Reinforcement Learning from Human Feedback. The Model Spec describes how the model is meant to behave; humans rate outputs and the policy is updated.',
      publicDoc: 'OpenAI Model Spec',
      tier: 'a',
    },
  ],
  modelLineup: [
    { vendor: 'anthropic', name: 'Claude Opus 4.8', family: 'Opus', tier: 'a' },
    { vendor: 'anthropic', name: 'Claude Opus 4.7', family: 'Opus', tier: 'a' },
    { vendor: 'anthropic', name: 'Claude Sonnet 4.6', family: 'Sonnet', tier: 'a' },
    { vendor: 'anthropic', name: 'Claude Haiku 4.5', family: 'Haiku', tier: 'a' },
    { vendor: 'openai', name: 'GPT-5.5', family: 'GPT', tier: 'a' },
    { vendor: 'openai', name: 'GPT-5.5 Pro', family: 'GPT', tier: 'a' },
    { vendor: 'openai', name: 'GPT-5.5 Thinking', family: 'GPT', tier: 'a' },
    { vendor: 'openai', name: 'GPT-5.5 Instant', family: 'GPT', tier: 'a' },
  ],
}
