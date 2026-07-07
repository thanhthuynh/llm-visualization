import type { SectionId } from '@/plates/plates.config'

/**
 * The 17 gazetteer entries, in the reference's row-major (alphabetized) order.
 * Terms, plate refs, and definitions are transcribed verbatim from the design
 * reference (the design handoff (kept in maintainer notes),
 * `#gazetteer`). All copy is final; every entry cross-links to its plate.
 */
export interface GazetteerEntry {
  term: string
  plateRef: string
  to: SectionId
  definition: string
}

export const GAZETTEER_ENTRIES: ReadonlyArray<GazetteerEntry> = [
  {
    term: 'Agent',
    plateRef: 'PL. V',
    to: 'plate-v',
    definition: 'A model given a goal, tools, and a loop to act in.',
  },
  {
    term: 'Attention',
    plateRef: 'PL. IV',
    to: 'plate-iv',
    definition: 'Weighing how each token relates to all the others.',
  },
  {
    term: 'Context Window',
    plateRef: 'PL. I',
    to: 'plate-i',
    definition: 'The span of tokens a model can hold in view at once.',
  },
  {
    term: 'Embedding',
    plateRef: 'PL. IV',
    to: 'plate-iv',
    definition: 'A vector that places a token in meaning-space.',
  },
  {
    term: 'Iteration',
    plateRef: 'PL. VII',
    to: 'plate-vii',
    definition: 'One turn of the loop — a single reason–act–observe.',
  },
  {
    term: 'Logits',
    plateRef: 'PL. IV',
    to: 'plate-iv',
    definition: 'Raw scores over the vocabulary, before they become odds.',
  },
  {
    term: 'Loop',
    plateRef: 'PL. VII',
    to: 'plate-vii',
    definition: 'The repeated reason–act–observe circuit of an agent.',
  },
  {
    term: 'Prompt',
    plateRef: 'PL. IV',
    to: 'plate-iv',
    definition: "The reader's words, taken in as written.",
  },
  {
    term: 'Retrieval · RAG',
    plateRef: 'PL. III',
    to: 'plate-iii',
    definition: 'Bringing outside documents into the context window.',
  },
  {
    term: 'Sampling',
    plateRef: 'PL. IV',
    to: 'plate-iv',
    definition: 'Drawing one token from the predicted distribution.',
  },
  {
    term: 'Subagent',
    plateRef: 'PL. VI',
    to: 'plate-vi',
    definition: 'A scout the lead dispatches to survey in isolation.',
  },
  {
    term: 'System Prompt',
    plateRef: 'PL. II',
    to: 'plate-ii',
    definition: "Standing orders that fix the model's role and bounds.",
  },
  {
    term: 'Temperature',
    plateRef: 'PL. IV',
    to: 'plate-iv',
    definition: 'A dial on boldness — higher means more surprise.',
  },
  {
    term: 'Token',
    plateRef: 'PL. IV',
    to: 'plate-iv',
    definition: "A subword unit — the model's smallest piece of language.",
  },
  {
    term: 'Tool',
    plateRef: 'PL. V',
    to: 'plate-v',
    definition: 'An instrument the agent may call to act on the world.',
  },
  {
    term: 'Top-p',
    plateRef: 'PL. IV',
    to: 'plate-iv',
    definition: 'Keeping only the likeliest tokens that sum to p.',
  },
  {
    term: 'Vector Store',
    plateRef: 'PL. III',
    to: 'plate-iii',
    definition: 'A library of documents indexed by meaning, not words.',
  },
]
