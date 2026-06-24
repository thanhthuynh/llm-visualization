<!-- Generated: 2026-06-04 | Updated: 2026-06-23 (one-scroll cutover) | Files scanned: 11 | Token estimate: ~600 -->

# Data Layer

## Files (src/data/)

| File | Role |
|---|---|
| `schema.ts` | Zod schemas defining the typed shape of every JSON dataset |
| `loader.ts` | Loads + validates JSON prompts; throws on schema failure |
| `illustrative-embeddings.ts` | Hand-curated 2D coordinates for `EmbedScene` |
| `compare.config.ts` | Compare-scene claim rows + tier tags + `lastUpdated` stamps |
| `prompts/sky.json` | Running example: "Why is the sky blue?" (Part 2 backbone) |
| `prompts/cat.json` | Running example: "Tell me a story about a cat" (Attention scene) |
| `prompts/conditioning.json` | Act 2 — System Prompt scene illustrative dataset (`ConditioningDatasetSchema`) |
| `prompts/retrieval-toy.json` | Act 2 — Retrieval/RAG scene illustrative dataset (`RetrievalToyDatasetSchema`) |
| `prompts/hallucination-case.json` | Act 2 — Hallucination scene illustrative dataset (`HallucinationCaseDatasetSchema`) |

## Type flow

```
JSON file (unknown)
   ↓ schema.parse()       — Zod, throws on shape mismatch
Typed dataset
   ↓ provide via context (sky/cat) or direct call (Act 2 datasets)
RunningExampleContext (src/app/) — sky/cat only
   ↓ consume
scene component selects fields by name

Act 2 loaders called directly from scene components:
  loadConditioning()        → ConditioningDataset    (SystemScene)
  loadRetrievalToy()        → RetrievalToyDataset    (RagScene)
  loadHallucinationCase()   → HallucinationCaseDataset (HallucinateScene)
```

**Boundary rule:** Anything entering from `src/data/prompts/*.json` is `unknown` until parsed. There is no opt-out — schema failure is a hard error, not a silent fallback. This is the only place the codebase trusts an external shape.

## Act 2 schema details

### `ConditioningDatasetSchema` (`conditioning.json`)
Fields: `basePrompt`, `conditionedPrompt`, `base` (candidates), `conditioned` (candidates), `source`, `status: 'illustrative'`. Guards: `status='measured'` with placeholder source fails. Used by `SystemScene` to show how a system prompt shifts the token distribution.

### `RetrievalToyDatasetSchema` (`retrieval-toy.json`)
Fields: `query`, `chunks` (array of `{ text, sim }`), `source`, `status: 'illustrative'`. Guards: same measured-source guard. Used by `RagScene` to illustrate cosine-similarity retrieval ranking.

### `HallucinationCaseDatasetSchema` (`hallucination-case.json`)
Fields: `prompt`, `truth`, `nextToken` (candidates), `source`, `status: 'illustrative'`. Guards: (1) measured-source guard; (2) `superRefine` asserts `top-1 token ≠ truth` (the model is confidently wrong); (3) `truth` must appear somewhere in the candidates list. Used by `HallucinateScene`.

## Datasets are illustrative, not measured

All numerical fields (token IDs, embedding coordinates, attention weights, logits, probabilities, similarity scores) are pre-computed from **GPT-2 small** run offline. They are intentionally:

- Stable (no recomputation in-browser)
- Inspectable (committed JSON)
- Limited (two prompts: `sky`, `cat`)

Adding a new prompt: write JSON, validate against `schema.ts`, register in `loader.ts`. Any Deep panel rendered from it must inherit the existing `CaveatNote` discipline if the visualization could be misread as measuring a frontier model.

## Compare claims (`compare.config.ts`)

Each row carries a tier (`a` confirmed / `b` reasonably inferable / `c` widely reported) and a `lastUpdated` stamp. Tier downgrading is fine; quietly upgrading from `c` to `a` is the integrity failure to avoid.

## What's NOT in src/data/

- No database. No fetched data. No localStorage of user input.
- No prompt execution. The site does not call any LLM at runtime.
- Analytics events are in `src/analytics/`, not here — they're observation, not data input.
