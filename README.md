# Inside an LLM — Interactive Explainer

> Watch a prompt become an answer, one token at a time. Seven scenes, two reading paths — gist on the surface, receipts underneath.

A single-page, interactive explainer of what happens inside a Large Language Model between "you typed a prompt" and "the answer streamed out." Designed for two readers at once: a non-technical friend who wants the intuition, and a technically literate peer who wants to confirm nothing was hand-waved. The mechanism for serving both is progressive disclosure (Surface vs Deep toggles per scene), not two separate sites.

**Live site:** *(deployed on Cloudflare Pages — URL updates after first deploy)*
**Stack:** Vite · React 19 · TypeScript 5.7 strict · Tailwind v4 · Motion · D3 (scale only) · Zod · Umami · Playwright · vitest-axe

![Inside an LLM screenshot placeholder](docs/screenshot.png)

---

## Provenance — read this first

Every number, embedding coordinate, attention weight, and probability shown on this site comes from a small open reference model — **GPT-2 small**, run offline. **They are illustrative.** Frontier providers (Claude, ChatGPT) do not expose token-level attention, embedding coordinates, or full next-token distributions for arbitrary input, so this site cannot honestly visualize their internals. The `About` scene says this in-app, and every Deep panel that could mislead carries an amber CaveatNote.

The "Compare" scene goes one level further: every claim row is tagged **(a) confirmed**, **(b) reasonably inferable**, or **(c) widely reported**, with a `lastUpdated` stamp.

If you are a technical reader: please catch us in a lie. It is the primary success criterion of the project that you cannot.

---

## The pipeline

| # | Scene | Surface beat | Deep beat |
|---|---|---|---|
| 1 | **Prompt** | Everything starts with a string of characters. | Why the literal string matters; canonical example prompts. |
| 2 | **Tokenize** | Text is sliced into the model's chosen pieces. | BPE; real token IDs (`464`, `6766`, `318`); byte view (`62 6c 75 65 = "blue"`). |
| 3 | **Embed** | Each token becomes a coordinate the network can do math on. | 2D meaning-space with contextual-shift dot. |
| 4 | **Attention** | Tokens look at the tokens that matter, weighted by relevance. | Arcs + 8×8 matrix with d3-magma ramp + causal mask + head selector. |
| 5 | **Predict** | A probability for every possible next token, ranked. | Logits → softmax (`3.1/0.9/0.4 → 0.71/0.06/0.04`); live temperature slider. |
| 6 | **Decode** | Sample one token, append it, run the loop again. | Side-by-side T=0.2 PEAKED vs T=1.4 FLATTER distributions. |
| 7 | **Output** | Tokens stream out until the end-of-sequence signal fires. | Streaming reply bubble; detokenize chain; honors `prefers-reduced-motion`. |
| + | **Compare** | Claude vs ChatGPT: convergence, not "bigger is smarter." | Tier-tagged claims, Constitutional AI vs RLHF, paired context-window bars. |
| + | **About** | Provenance, methodology, dataset sourcing. | Model name, dataset URL, illustrative-vs-measured discipline. |

---

## Run, test, build

```bash
npm install
npm run dev            # Vite dev server on http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | typecheck + production build to `dist/` (≈146 KB gzip) |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run typecheck` | `tsc --noEmit` on app + node configs |
| `npm run lint` | ESLint — zero errors, zero warnings |
| `npm run format` | Prettier write across `src/` |
| `npm test` | Vitest (jsdom) — unit + a11y-unit |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:coverage` | Vitest with v8 coverage |
| `npm run e2e` | Playwright — full E2E suite (Chromium) |
| `npm run a11y` | vitest-axe — per-scene + app-shell axe smoke |
| `npm run a11y:e2e` | Playwright + `@axe-core/playwright` — E2E axe scan across all 9 scenes |

---

## Project structure

```
src/
├── app/              # Context providers + cross-cutting hooks (hash-sync, keyboard, scroll-spy)
├── components/       # Primitives (Chip, DataBar, CaveatNote, ProgressRail, TopBar, ...)
├── scenes/           # Nine scene components + scenes.config.ts (single source of truth)
├── landing/          # Landing-page sections (hero, scene cards, methods, two-paths, footer)
├── analytics/        # Umami wrapper + scene-reach hook + event taxonomy
├── data/             # Zod-validated dataset loader + prompts/{sky,cat}.json
├── utils/            # Small pure helpers
├── App.tsx           # App shell — composes providers + mounts scenes
├── main.tsx          # React entry
└── index.css         # Tailwind v4 @theme tokens

tests/                # Unit + a11y-unit (vitest + jsdom)
e2e/                  # Playwright specs (happy-path, mvp-flow, a11y, honesty, decode, scroll, landing, compare)
docs/                 # Audit reports, design direction, brand voice, migration cheat sheets
.claude/plans/        # Per-feature implementation plans (the unit of release)
```

---

## Deploy

Hosted on **Cloudflare Pages**, free tier. Pushes to `main` auto-deploy via the CF Pages GitHub integration; every pull request gets a preview URL.

Build settings:
- Framework preset: **Vite**
- Build command: `npm run build`
- Output: `dist`
- Node: `20` (matches `.nvmrc`)

Required env var: `VITE_UMAMI_WEBSITE_ID` (see Analytics).

---

## Analytics

Pageviews, button clicks, and per-scene reach are tracked via [Umami Cloud](https://cloud.umami.is) — cookieless, GDPR-friendly, no consent banner required. The canonical event taxonomy lives in [`src/analytics/events.ts`](src/analytics/events.ts).

- **Button clicks** use Umami's declarative `data-umami-event="..."` attribute — no JS, no React state.
- **Scene-reach events** emit programmatically with once-per-session dedupe via [`useTrackSceneReach`](src/analytics/useTrackSceneReach.ts).
- The wrapper safely no-ops when `window.umami` is undefined (ad-blockers, dev without env var) — never throws.

Set `VITE_UMAMI_WEBSITE_ID` (see [`.env.example`](.env.example)) to your Umami site UUID in the Cloudflare Pages env-var UI. Leave it empty locally to avoid polluting production analytics.

By design the ceiling is ≤15 named events. Currently 10. We refuse to instrument everything.

---

## Engineering notes

- **TypeScript strict.** `noUncheckedIndexedAccess`, no `any` in app code (`unknown` + narrowing for external input). Zod validates every dataset at load.
- **No routing library.** One page, nine hash anchors, one tiny `useHashSync` hook.
- **No GSAP, no Three.js, no Framer Motion.** Just `motion` (React-native), `d3-scale` for math, `d3-scale-chromatic` for the attention-matrix ramp.
- **Scroll-snap stations.** Each scene plays its entrance once on entry, then hands control to the user. No scroll-scrubbing — interactivity-first.
- **Tailwind v4** with `@theme {}` tokens; canonical theme classes (`bg-surface-card`, `rounded-card`, …) preferred over arbitrary-form. Sixteen inline-style exceptions remain — all documented in [`docs/tailwind-migration/cheat-sheet.md`](docs/tailwind-migration/cheat-sheet.md) as CSS-var passthrough or template literals Tailwind can't express.
- **A11y two-layer.** `vitest-axe` per scene (jsdom; landmark / labels / structure) + `@axe-core/playwright` E2E (real browser; contrast). Per-scene unique landmark labels. See [`docs/a11y/2026-06-01-audit.md`](docs/a11y/2026-06-01-audit.md). Color-contrast deferred to a brand-level follow-up.
- **Motion budget.** ≤360 ms per transition, hero-only ambient loop on the landing, every animation respects `prefers-reduced-motion`.

---

## Documentation map

- **Public-facing pitch + run instructions:** this README
- **Visual design + technical architecture (source of truth):** the Figma file and `docs/landing-page-design-direction.md`
- **Product intent + decisions + success metrics:** [`docs/PRD.md`](docs/PRD.md)
- **Version history:** [`CHANGELOG.md`](CHANGELOG.md)
- **Topic docs:** see [`docs/README.md`](docs/README.md)

---

## License

[MIT](LICENSE) © 2026 Thanh
