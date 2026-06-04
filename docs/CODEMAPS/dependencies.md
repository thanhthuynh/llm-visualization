<!-- Generated: 2026-06-04 | Files scanned: 1 | Token estimate: ~500 -->

# Dependencies

## Runtime (6 packages)

| Package | Role |
|---|---|
| `react` (19) | UI |
| `react-dom` (19) | DOM renderer |
| `zod` | Schema validation at the data boundary (`src/data/loader.ts`) |
| `motion` | Animation primitives (React-native API). **The only animation library.** |
| `d3-scale` | Math scales (linear, log) — `PredictScene`, `DecodeScene` |
| `d3-scale-chromatic` | `d3-magma` color ramp for `AttentionMatrix` |

**Explicitly excluded** (mentioned to forestall accidental additions): no `gsap`, no `three`, no `framer-motion`, no `react-router`, no `redux`/`zustand`/`jotai`, no `tailwindcss-animate` plugin, no other `d3-*` modules.

## Build / test (29 devDependencies)

Categories:
- **Build**: `vite`, `@vitejs/plugin-react`, `typescript`, `@tailwindcss/vite`, `tailwindcss`
- **Lint/format**: `eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `prettier`, `prettier-plugin-tailwindcss`
- **Test (unit/a11y)**: `vitest`, `@vitest/coverage-v8`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `vitest-axe`, `axe-core`
- **Test (E2E/a11y)**: `@playwright/test`, `@axe-core/playwright`
- **Types**: `@types/react`, `@types/react-dom`, `@types/node`

## External services (runtime)

| Service | Purpose | Failure mode |
|---|---|---|
| **Cloudflare Pages** | Static hosting; auto-deploys from `main`; PR previews | Build failure blocks deploy; nothing in code touches CF API |
| **Umami Cloud** | Cookieless analytics | `track()` wrapper no-ops if `window.umami` is undefined (ad-blockers, dev without env var) |

No backend. No database. No third-party API called at runtime. The browser does not call any LLM provider — all numerical visualizations come from pre-computed JSON in `src/data/prompts/`.

## Environment variables

| Var | Where set | Required? | Purpose |
|---|---|---|---|
| `VITE_UMAMI_WEBSITE_ID` | Cloudflare Pages env-var UI (prod); unset locally | No (analytics no-op without it) | Umami site UUID |

The `.env.example` file is the contract. Never inline the actual UUID in docs, source, or committed config.

## Analytics event taxonomy

Defined in `src/analytics/events.ts` as an exhaustive union:

```
AnalyticsEvent =
  | 'scene-reached'
  | 'cta-start-explore' | 'cta-github' | 'cta-scene-card'
  | 'cta-landing-preview-toggle' | 'cta-depth-toggle'
  | 'cta-scene-nav' | 'cta-rail-jump'
  | 'cta-chip' | 'cta-head-select'
```

**Hard ceiling: 15 named events.** Currently 10. Adding one requires justification + matching props interface in `events.ts`. Button clicks should use `data-umami-event="..."` declaratively; only programmatic events (scene-reach) go through `track()`.

## Node

- Version: **20** (set in `.nvmrc`; CF Pages build uses the same)
- `package.json` has no `engines` field — `.nvmrc` is the only pin
