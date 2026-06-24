<!-- Generated: 2026-06-04 | Updated: 2026-06-23 (one-scroll cutover) | Files scanned: 70+ | Token estimate: ~850 -->

# Architecture

## Shape

Single-page React app. One HTML page (`index.html`), one React root (`src/main.tsx`), one composing shell (`src/App.tsx`). No routing library. A cinematic prologue is the site entry; 14 stations then mount in a scroll-snap column; hash anchors map 1:1 to station IDs (see `src/scenes/scenes.config.ts`).

## Mount chain

```
index.html
 └── src/main.tsx                       ReactDOM root
      └── src/App.tsx                   Composes providers + mounts scenes
           ├── DepthContext             per-scene Surface↔Deep state
           ├── RunningExampleContext    shared prompt across scenes
           ├── SceneNavContext          prev/next + hash sync
           ├── <TopBar />               scene-aware pill (EyebrowLabel) + depth-all toggle
           ├── <Prologue />             src/prologue/Prologue.tsx — cinematic entry track
           ├── <ActDivider />           visual separator between Part 1 and Part 2
           ├── SCENES.map(scene => <SceneStation>{...})   14 stations
           └── <ProgressRail />         right-edge grouped rail (intro + Part 1 + Part 2 + Compare + About)
```

## Station pipeline (the product)

```
[Prologue — cinematic entry]

Part 1 · Around the model:
  Interlude → Context Window → System Prompt → Retrieval/RAG → Hallucination

Part 2 · Inside the model:
  Prompt → Tokenize → Embed → Attention → Predict → Decode → Output

  ↘ Compare (Claude vs ChatGPT)
  ↘ About    (provenance + dataset)
```

Source of truth: `src/scenes/scenes.config.ts`. Exports:
- `SceneId` union type — 15 IDs (intro + 5 Part-1 + 7 Part-2 + compare + about)
- `AccentToken` — 11 accent colors (7 Part-2 + 4 Part-1)
- `SceneConfig` interface — `{ id, title, accent, prompt, railLabel, implemented, part }`
- `SCENES: ReadonlyArray<SceneConfig>` — ordered list
- `getSceneById(id)`, `getMountedSceneIds()` — helpers
- `ACCENT_HEX: Record<AccentToken, string>` — color lookup

## Data flow

```
src/data/prompts/*.json
   ↓ (load + Zod validate)
src/data/loader.ts → typed datasets
   ↓ (sky/cat: provide via context)
RunningExampleContext (src/app/)
   ↓ (consume)
Part-2 scene components read selected fields

   ↓ (Act 2 datasets: loaded directly by scene)
loadConditioning()      → SystemScene
loadRetrievalToy()      → RagScene
loadHallucinationCase() → HallucinateScene

   ↓ (other illustrative datasets)
src/data/illustrative-embeddings.ts  → EmbedScene
src/data/compare.config.ts           → CompareScene
```

All external/JSON input is `unknown` until Zod-validated at `src/data/loader.ts`. Scene components consume typed data only.

## State

Three contexts under `src/app/`:
- **DepthContext** — per-scene Surface/Deep toggle; consumed by every `<DeepToggle>` and any component that renders different content per depth.
- **RunningExampleContext** — the active example prompt ("sky" or "cat"); shared across Prompt → Output so all scenes show the same trace.
- **SceneNavContext** — current scene ID, prev/next, hash sync via `useHashSync`.

No Redux, Zustand, Jotai, or other store. Context + local `useState` only.

## Cross-cutting hooks (`src/app/`)

- `useHashSync` — URL hash ↔ active scene. Honors initial-mount hash (commit `fd17866`).
- `useKeyboardNav` — keyboard prev/next + Esc-to-Surface.
- `useScrollSpy` — scroll position → active scene ID.
- `useReducedMotionPref` — wraps `matchMedia('(prefers-reduced-motion: reduce)')`.

## A11y model

- Per-scene `<section>` with unique `aria-labelledby` (enforced by `vitest-axe`).
- Two-layer a11y test: `vitest-axe` (jsdom; structure) + `@axe-core/playwright` (real browser; contrast).
- One known a11y debt: color-contrast findings deferred to a brand-level decision (see `docs/a11y/2026-06-01-audit.md`).

## Analytics

Three files under `src/analytics/`. The `track()` wrapper no-ops without `window.umami`. Button clicks use Umami's declarative `data-umami-event` attribute (no JS). Scene-reach uses `useTrackSceneReach` with once-per-session dedupe. Hard ceiling: 15 named events. Currently 7 (Sub-Plan B pruned 3 dead landing events from 10; the prologue and Act-2 scenes added zero new events). See `dependencies.md`.

## Provenance (product invariant)

All numerical visualizations come from **GPT-2 small**, run offline. Frontier-provider internals are not exposed by the providers. Any Deep panel that could mislead carries an amber `<CaveatNote>`. The `Compare` scene tier-tags every claim (a/b/c). See [`../../CLAUDE.md`](../../CLAUDE.md) §Provenance.
