<!-- Generated: 2026-06-04 | Updated: 2026-06-23 (one-scroll cutover) | Files scanned: 70+ | Token estimate: ~1000 -->

# Frontend

## src/ layout

```
src/
├── main.tsx              ReactDOM entry
├── App.tsx               Shell: composes providers + mounts prologue + 14 stations + rail
├── index.css             Tailwind v4 @theme tokens (--color-*, --font-*, --radius-*)
├── vite-env.d.ts
├── app/                  Providers + cross-cutting hooks
├── components/           Primitives (layout, display, scene-specific visuals)
├── scenes/               14-station scene components + scenes.config.ts (SSoT)
├── prologue/             Cinematic entry track + beats + reduced-motion static variant
├── motion/               Shared entrance token constants (@/motion/tokens)
├── analytics/            Umami wrapper + event taxonomy + scene-reach hook
└── data/                 Zod schemas + loader + datasets + prompts
```

## src/app/ (7 files)

| File | Role |
|---|---|
| `DepthContext.tsx` | Per-scene Surface/Deep state + `Depth` type |
| `RunningExampleContext.tsx` | Active example prompt shared across all scenes |
| `SceneNavContext.tsx` | Current scene + prev/next + hash sync wiring |
| `useHashSync.ts` | URL `#hash` ↔ active scene; honors initial mount |
| `useKeyboardNav.ts` | Keyboard prev/next + Esc-to-Surface |
| `useScrollSpy.ts` | IntersectionObserver → active scene ID |
| `useReducedMotionPref.ts` | `matchMedia('(prefers-reduced-motion: reduce)')` |

## src/scenes/ (15 files)

| File | Scene | Part | Accent |
|---|---|---|---|
| `scenes.config.ts` | — (SSoT: SCENES, SceneId, ACCENT_HEX, getSceneById, getMountedSceneIds) | — | — |
| `InterludeScene.tsx` | Around the model (interlude) | Part 1 | — |
| `WindowScene.tsx` | Context Window | Part 1 | window |
| `SystemScene.tsx` | The System Prompt | Part 1 | system |
| `RagScene.tsx` | Retrieval (RAG) | Part 1 | rag |
| `HallucinateScene.tsx` | Hallucination | Part 1 | hallucinate |
| `PromptScene.tsx` | Prompt Input | Part 2 | prompt |
| `TokenizeScene.tsx` | Tokenization | Part 2 | tokenize |
| `EmbedScene.tsx` | Embeddings | Part 2 | embed |
| `AttentionScene.tsx` | Attention | Part 2 | attention |
| `PredictScene.tsx` | Next-Token Prediction | Part 2 | predict |
| `DecodeScene.tsx` | Decoding Loop | Part 2 | decode |
| `AssembleScene.tsx` | Output Assembly | Part 2 | output |
| `CompareScene.tsx` | Compare | — | (neutral) |
| `AboutScene.tsx` | About | — | (neutral) |

The `AssembleScene` file backs the "Output" SceneId — the file name is historical. When adding a scene: add to `SceneId` union, add `SCENES` entry (with `part`), add component file, add hash anchor — `useHashSync` and nav update automatically.

## src/prologue/ (8 files)

| File | Role |
|---|---|
| `Prologue.tsx` | Entry point — delegates to `PrologueAnimated` or `PrologueStatic` |
| `PrologueAnimated.tsx` | Scroll-scrubbed 7-beat cinematic intro (Chromium-only smooth scroll) |
| `PrologueStatic.tsx` | Static reduced-motion variant (identical content, no scroll tie) |
| `PrologueMode.tsx` | Mode-selection logic (reduced-motion pref + `?prologue=static` override) |
| `beats.config.ts` | Beat definitions: id, label, copy, data binding |
| `beats/` | Individual beat components (`BeatShell`, `BeatEmbed`, `BeatProvenanceVow`, …) |
| `snap.ts` | Scroll-snap geometry constants |
| `useBeatProgress.ts` | Maps scroll position → active beat index |
| `usePrologueGate.ts` | Guards the gate: `INTRO` tick in rail maps to prologue anchor |

## src/components/ (primitives)

Grouped by purpose:

| Group | Files |
|---|---|
| **Layout / station** | `SceneStation`, `DeepPanel`, `DeepToggle`, `EyebrowLabel` (accent-capable), `TopBar`, `SceneNav`, `ProgressRail`, `ActDivider` |
| **Display primitives** | `Chip`, `DataBar`, `ContextWindowBar`, `AccentRule`, `CaveatNote`, `ClaimTier`, `PhilosophyCard`, `WindowTape` |
| **Scene-specific visuals** | `TokenizerCount`, `EmbeddingDot`, `EmbeddingSpace`, `AttentionArc`, `AttentionMatrix`, `HeadSelector`, `DistributionPair`, `ReplyBubble`, `PromptField` |
| **Tables** | `CompareTable` |
| **Non-component modules** | `railModel.ts` (builds typed `RailItem[]` list for `ProgressRail`) |

`CaveatNote` is load-bearing — it's the amber-warning component that gates honesty for any Deep panel that could mislead. Do not remove or weaken instances without product review.

`SceneStation` is the canonical wrapper for every scene's `<section>` — handles the unique `aria-labelledby`, scroll-snap, and the per-scene accent passthrough.

`ActDivider` renders the visual separator between Part 1 and Part 2 in the scroll column.

`WindowTape` is a shared visual used by `WindowScene` and other Part-1 scenes that need a context-window strip metaphor.

`EyebrowLabel` is accent-capable (accepts an `accent` prop) — used by `TopBar` to show the active station name in its theme color.

## src/motion/

| File | Role |
|---|---|
| `tokens.ts` | Shared entrance animation constants: duration, easing, stagger. Import as `@/motion/tokens`. |

All station entrance animations reference these tokens to enforce the ≤360 ms motion budget.

## Styling

- Tailwind v4 with `@theme {}` in `src/index.css` declaring all `--color-*`, `--font-*`, `--radius-*` tokens.
- Canonical theme classes (`bg-surface-card`, `rounded-card`, …) preferred. Arbitrary-form (`bg-(--color-X)`) is fallback.
- Inline `style={{...}}` reserved for runtime-computed values, arbitrary `gridTemplateColumns`, and one-off `calc()` only. See `docs/tailwind-migration/cheat-sheet.md`.

## Tests

- `tests/unit/*.test.tsx` — Vitest + jsdom, component-focused
- `tests/a11y/*.a11y.test.tsx` — vitest-axe per-scene axe smoke tests (16 files covering all stations + app shell)
- `tests/setup.ts`, `tests/vitest-axe.d.ts` — test infra
- `e2e/*.spec.ts` — Playwright (Chromium): `happy-path`, `mvp-flow`, `a11y` (14-station axe scan), `honesty-scenes`, `decoding-temperature`, `scroll-sync`, `compare-section`, `prologue`, `rail`, `around-the-model`
