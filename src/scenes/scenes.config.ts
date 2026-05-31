export type SceneId =
  | 'prompt'
  | 'tokenize'
  | 'embed'
  | 'attention'
  | 'predict'
  | 'decode'
  | 'output'
  | 'about'

export type AccentToken =
  | 'prompt'
  | 'tokenize'
  | 'embed'
  | 'attention'
  | 'predict'
  | 'decode'
  | 'output'

export interface SceneConfig {
  id: SceneId
  title: string
  accent: AccentToken | null
  prompt: string
  railLabel: string | null
  implemented: boolean
}

export const SCENES: ReadonlyArray<SceneConfig> = [
  {
    id: 'prompt',
    title: 'Prompt Input',
    accent: 'prompt',
    prompt: 'The sky is',
    railLabel: 'PROMPT',
    implemented: false,
  },
  {
    id: 'tokenize',
    title: 'Tokenization',
    accent: 'tokenize',
    prompt: 'The sky is',
    railLabel: 'TOKENIZE',
    implemented: false,
  },
  {
    id: 'embed',
    title: 'Embeddings',
    accent: 'embed',
    prompt: 'The sky is',
    railLabel: 'EMBED',
    implemented: false,
  },
  {
    id: 'attention',
    title: 'Attention',
    accent: 'attention',
    prompt: 'The cat sat down because it was tired',
    railLabel: 'ATTENTION',
    implemented: false,
  },
  {
    id: 'predict',
    title: 'Next-Token Prediction',
    accent: 'predict',
    prompt: 'The sky is',
    railLabel: 'PREDICT',
    implemented: true,
  },
  {
    id: 'decode',
    title: 'Decoding Loop',
    accent: 'decode',
    prompt: 'The sky is',
    railLabel: 'DECODE',
    implemented: false,
  },
  {
    id: 'output',
    title: 'Output Assembly',
    accent: 'output',
    prompt: 'The sky is',
    railLabel: 'OUTPUT',
    implemented: false,
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
}
