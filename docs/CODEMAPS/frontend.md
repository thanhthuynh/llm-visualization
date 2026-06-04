<!-- Generated: 2026-06-04 | Files scanned: 47 | Token estimate: ~900 -->

# Frontend

## src/ layout

```
src/
├── main.tsx              ReactDOM entry
├── App.tsx               Shell: composes providers + mounts scenes + landing + rail
├── index.css             Tailwind v4 @theme tokens (--color-*, --font-*, --radius-*)
├── vite-env.d.ts
├── app/                  Providers + cross-cutting hooks
├── components/           24 primitives
├── scenes/               9 scene components + scenes.config.ts (SSoT)
├── landing/              8 landing-page sections
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

## src/scenes/ (10 files)

| File | Scene | Accent |
|---|---|---|
| `scenes.config.ts` | — (SSoT: SCENES, SceneId, ACCENT_HEX, getSceneById, getMountedSceneIds) | — |
| `PromptScene.tsx` | 1. Prompt | prompt |
| `TokenizeScene.tsx` | 2. Tokenize | tokenize |
| `EmbedScene.tsx` | 3. Embed | embed |
| `AttentionScene.tsx` | 4. Attention | attention |
| `PredictScene.tsx` | 5. Predict | predict |
| `DecodeScene.tsx` | 6. Decode | decode |
| `AssembleScene.tsx` | 7. Output (a.k.a. assemble) | output |
| `CompareScene.tsx` | + Compare | (neutral) |
| `AboutScene.tsx` | + About | (neutral) |

The `AssembleScene` file backs the "Output" SceneId — the file name is historical (assembly metaphor from earlier drafts). When adding a scene: add to `SceneId` union, add `SCENES` entry, add component file, add hash anchor — `useHashSync` and nav update automatically.

## src/components/ (24 primitives)

Grouped by purpose:

| Group | Files |
|---|---|
| **Layout / station** | `SceneStation`, `DeepPanel`, `DeepToggle`, `EyebrowLabel`, `TopBar`, `SceneNav`, `ProgressRail` |
| **Display primitives** | `Chip`, `DataBar`, `ContextWindowBar`, `AccentRule`, `CaveatNote`, `ClaimTier`, `PhilosophyCard` |
| **Scene-specific visuals** | `TokenizerCount`, `EmbeddingDot`, `EmbeddingSpace`, `AttentionArc`, `AttentionMatrix`, `HeadSelector`, `DistributionPair`, `ReplyBubble`, `PromptField` |
| **Tables** | `CompareTable` |

`CaveatNote` is load-bearing — it's the amber-warning component that gates honesty for any Deep panel that could mislead. Do not remove or weaken instances without product review.

`SceneStation` is the canonical wrapper for every scene's `<section>` — handles the unique `aria-labelledby`, scroll-snap, and the per-scene accent passthrough.

## src/landing/ (8 sections)

| File | Role |
|---|---|
| `Landing.tsx` | Composes sections in order |
| `Hero.tsx` | Top — pitch + chip-strip mechanic + ambient motion loop |
| `HeroPipelinePreview.tsx` | Mini-pipeline visualization (illustrative) |
| `SceneCardGrid.tsx` | 9 scene cards, deep-link to `#hash` |
| `SurfaceDeepPreview.tsx` | Demonstrates Surface ↔ Deep toggle |
| `ProvenanceBlock.tsx` | "Methods section, not a disclaimer" — provenance prose |
| `TechStack.tsx` | Stack listing |
| `LandingFooter.tsx` | Footer + GitHub link |

The 5 files with pending-triage inline `style={{}}` (per cheat-sheet update 2026-06-04): `Hero`, `HeroPipelinePreview`, `LandingFooter`, `SceneCardGrid`, `SurfaceDeepPreview`.

## Styling

- Tailwind v4 with `@theme {}` in `src/index.css` declaring all `--color-*`, `--font-*`, `--radius-*` tokens.
- Canonical theme classes (`bg-surface-card`, `rounded-card`, …) preferred. Arbitrary-form (`bg-(--color-X)`) is fallback.
- Inline `style={{...}}` reserved for runtime-computed values, arbitrary `gridTemplateColumns`, and one-off `calc()` only. See `docs/tailwind-migration/cheat-sheet.md`.

## Tests

- `tests/unit/*.test.tsx` — Vitest + jsdom, component-focused
- `tests/setup.ts`, `tests/vitest-axe.d.ts` — test infra
- `e2e/*.spec.ts` — Playwright (Chromium): `happy-path`, `mvp-flow`, `a11y`, `honesty-scenes`, `decoding-temperature`, `scroll-sync`, `landing`, `compare-section`
