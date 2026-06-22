export type SceneId =
  | 'intro'
  | 'interlude'
  | 'window'
  | 'system'
  | 'rag'
  | 'hallucinate'
  | 'prompt'
  | 'tokenize'
  | 'embed'
  | 'attention'
  | 'predict'
  | 'decode'
  | 'output'
  | 'compare'
  | 'about'

export type AccentToken =
  | 'prompt'
  | 'tokenize'
  | 'embed'
  | 'attention'
  | 'predict'
  | 'decode'
  | 'output'
  | 'window'
  | 'system'
  | 'rag'
  | 'hallucinate'

export interface SceneConfig {
  id: SceneId
  title: string
  accent: AccentToken | null
  prompt: string
  railLabel: string | null
  implemented: boolean
  part?: 'intro' | 'part1' | 'part2'
}

export const SCENES: ReadonlyArray<SceneConfig> = [
  {
    id: 'intro',
    title: 'Inside an LLM',
    accent: null,
    prompt: '',
    railLabel: 'INTRO',
    implemented: false,
    part: 'intro',
  },
  {
    id: 'interlude',
    title: 'Around the model',
    accent: null,
    prompt: '',
    railLabel: 'PART 1',
    implemented: false,
    part: 'part1',
  },
  {
    id: 'window',
    title: 'Context Window',
    accent: 'window',
    prompt: '',
    railLabel: 'WINDOW',
    implemented: false,
    part: 'part1',
  },
  {
    id: 'system',
    title: 'The System Prompt',
    accent: 'system',
    prompt: '',
    railLabel: 'SYSTEM',
    implemented: false,
    part: 'part1',
  },
  {
    id: 'rag',
    title: 'Retrieval (RAG)',
    accent: 'rag',
    prompt: '',
    railLabel: 'RETRIEVE',
    implemented: false,
    part: 'part1',
  },
  {
    id: 'hallucinate',
    title: 'Hallucination',
    accent: 'hallucinate',
    prompt: '',
    railLabel: 'HALLUCINATE',
    implemented: false,
    part: 'part1',
  },
  {
    id: 'prompt',
    title: 'Prompt Input',
    accent: 'prompt',
    prompt: 'The sky is',
    railLabel: 'PROMPT',
    implemented: true,
    part: 'part2',
  },
  {
    id: 'tokenize',
    title: 'Tokenization',
    accent: 'tokenize',
    prompt: 'The sky is',
    railLabel: 'TOKENIZE',
    implemented: true,
    part: 'part2',
  },
  {
    id: 'embed',
    title: 'Embeddings',
    accent: 'embed',
    prompt: 'The sky is',
    railLabel: 'EMBED',
    implemented: true,
    part: 'part2',
  },
  {
    id: 'attention',
    title: 'Attention',
    accent: 'attention',
    prompt: 'The cat sat down because it was tired',
    railLabel: 'ATTENTION',
    implemented: true,
    part: 'part2',
  },
  {
    id: 'predict',
    title: 'Next-Token Prediction',
    accent: 'predict',
    prompt: 'The sky is',
    railLabel: 'PREDICT',
    implemented: true,
    part: 'part2',
  },
  {
    id: 'decode',
    title: 'Decoding Loop',
    accent: 'decode',
    prompt: 'The sky is',
    railLabel: 'DECODE',
    implemented: true,
    part: 'part2',
  },
  {
    id: 'output',
    title: 'Output Assembly',
    accent: 'output',
    prompt: 'The sky is',
    railLabel: 'OUTPUT',
    implemented: true,
    part: 'part2',
  },
  {
    id: 'compare',
    title: 'Claude vs ChatGPT',
    accent: 'predict',
    prompt: '',
    railLabel: 'COMPARE',
    implemented: true,
  },
  {
    id: 'about',
    title: 'About this explainer',
    accent: null,
    prompt: '',
    railLabel: null,
    implemented: true,
  },
] as const

export function getSceneById(id: SceneId): SceneConfig {
  const scene = SCENES.find((s) => s.id === id)
  if (!scene) throw new Error(`unknown scene: ${id}`)
  return scene
}

export function getMountedSceneIds(): SceneId[] {
  return SCENES.filter((s) => s.implemented).map((s) => s.id)
}

export const ACCENT_HEX: Record<AccentToken, string> = {
  prompt: '#FFC857',
  tokenize: '#6BF178',
  embed: '#4CC9F0',
  attention: '#F72585',
  predict: '#9D4EDD',
  decode: '#FF7B00',
  output: '#2EE6D6',
  window: '#6D9EFF',
  system: '#B8C4E0',
  rag: '#FF7BAE',
  hallucinate: '#FF5C5C',
}
