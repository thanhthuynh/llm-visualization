<!-- Generated: 2026-06-04 | Files scanned: 6 | Token estimate: ~450 -->

# Data Layer

## Files (src/data/)

| File | Role |
|---|---|
| `schema.ts` | Zod schemas defining the typed shape of every JSON dataset |
| `loader.ts` | Loads + validates JSON prompts; throws on schema failure |
| `illustrative-embeddings.ts` | Hand-curated 2D coordinates for `EmbedScene` |
| `compare.config.ts` | Compare-scene claim rows + tier tags + `lastUpdated` stamps |
| `prompts/sky.json` | Running example: "Why is the sky blue?" |
| `prompts/cat.json` | Running example: "Tell me a story about a cat" |

## Type flow

```
JSON file (unknown)
   ↓ schema.parse()       — Zod, throws on shape mismatch
RunningExample (typed)
   ↓ provide via context
RunningExampleContext (src/app/)
   ↓ consume
scene component selects fields by name
```

**Boundary rule:** Anything entering from `src/data/prompts/*.json` is `unknown` until parsed. There is no opt-out — schema failure is a hard error, not a silent fallback. This is the only place the codebase trusts an external shape.

## Datasets are illustrative, not measured

All numerical fields (token IDs, embedding coordinates, attention weights, logits, probabilities) are pre-computed from **GPT-2 small** run offline. They are intentionally:

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
