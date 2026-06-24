# CLAUDE.md — Inside an LLM (Interactive Explainer)

Agent-facing entry doc. Public pitch + screenshots live in [README.md](README.md); product intent + decisions in [docs/PRD.md](docs/PRD.md); per-area source-tree maps in [docs/CODEMAPS/](docs/CODEMAPS/).

## What this repo is

A single-page React + TypeScript explainer of what happens between "you typed a prompt" and "the answer streamed out" of an LLM. One cinematic prologue overture, then 14 stations across two parts — **Part 1 · Around the model** (interlude + Context Window + System Prompt + Retrieval/RAG + Hallucination) and **Part 2 · Inside the model** (Prompt → Tokenize → Embed → Attention → Predict → Decode → Output) — plus Compare and About. Each station has a Surface beat and a Deep beat behind a per-scene depth toggle. One scrolling page, hash anchors per station, no router.

## Stack (lock these in your mental model)

| Layer | Choice | Notes |
|---|---|---|
| Build | Vite 7 | `npm run dev` → `localhost:5173` |
| UI | React 19 | Function components only |
| Types | TypeScript 5.7 **strict** | `exactOptionalPropertyTypes` on; `noUncheckedIndexedAccess` NOT enabled — narrow indexed access by convention; no `any` in app code (use `unknown` + narrowing) |
| Styles | Tailwind v4 with `@theme` tokens | Canonical theme classes preferred; arbitrary-form is fallback |
| Motion | `motion` (React-native) only | **No GSAP, no Three.js, no Framer Motion** |
| Math/scales | `d3-scale`, `d3-scale-chromatic` | No other D3 modules |
| Validation | Zod | Every dataset validated at load |
| Analytics | Umami Cloud | Cookieless; wrapper no-ops without `window.umami` |
| Unit + a11y-unit | Vitest + jsdom + `vitest-axe` | `npm test`, `npm run a11y` |
| E2E + a11y-e2e | Playwright + `@axe-core/playwright` | `npm run e2e`, `npm run a11y:e2e` |
| Hosting | Cloudflare Pages | Auto-deploys from `main`; PR previews |
| Node | 20 | See `.nvmrc` |

## Commands

| Command | What it does | When to run |
|---|---|---|
| `npm run dev` | Vite dev server | Local feature work |
| `npm run build` | Typecheck + production build to `dist/` | Before any release-readiness claim |
| `npm run preview` | Serve built `dist/` | Smoke-check the actual prod artifact |
| `npm run typecheck` | `tsc --noEmit` | Before commit |
| `npm run lint` | ESLint — zero errors, zero warnings | Before commit |
| `npm run format` | Prettier write across `src/` | Before commit |
| `npm test` | Vitest unit + a11y-unit | After any component change |
| `npm run test:watch` | Vitest watch mode | During TDD |
| `npm run test:coverage` | v8 coverage | Spot-checks only; no hard threshold enforced |
| `npm run e2e` | Playwright full suite (Chromium) | Before merging anything that touches scenes, scroll, or the prologue |
| `npm run a11y` | vitest-axe per-scene + app-shell | After any landmark/label change |
| `npm run a11y:e2e` | Playwright + axe across all stations | Before claiming the audit still passes |

## Architecture in 60 seconds

- **`src/scenes/scenes.config.ts` is the single source of truth.** It declares all station IDs, accent colors, order, and metadata. Any new station starts there; the scene component, hash anchor, and nav follow.
- **No routing library.** One scrolling page, hash anchors per station, one `useHashSync` hook in `src/app/`.
- **Scroll-snap stations, not scroll-scrubbing.** Each scene plays its entrance once on entry, then hands control to the user. Don't add scroll-tied animations.
- **Two reading paths via per-scene depth toggle.** Surface for intuition, Deep for receipts. State lives in `DepthContext` (`src/app/`).
- **Top-level dirs (see [docs/CODEMAPS/](docs/CODEMAPS/) for detail):**
  - `app/` — providers + cross-cutting hooks (hash-sync, keyboard, scroll-spy)
  - `components/` — primitives (Chip, DataBar, CaveatNote, ProgressRail, TopBar, …)
  - `scenes/` — 14-station scene components + `scenes.config.ts`
  - `prologue/` — the cinematic intro track + beats
  - `analytics/` — Umami wrapper, event taxonomy, scene-reach hook
  - `data/` — Zod-validated dataset loader + `prompts/{sky,cat,conditioning,retrieval-toy,hallucination-case}.json`

## Conventions that bite if you ignore them

- **Tailwind canonical theme classes first.** `bg-surface-card` not `bg-(--color-surface-card)`. Arbitrary-form is the documented fallback. Inline `style={{...}}` is reserved for runtime-computed values (CSS-var passthrough), arbitrary `gridTemplateColumns` Tailwind can't express, or one-off `calc()`. See [docs/tailwind-migration/cheat-sheet.md](docs/tailwind-migration/cheat-sheet.md). As of the one-scroll cutover there are 34 inline `style={{...}}` blocks across 19 files (all categorized under cheat-sheet Categories 1–3; `src/landing/` has been removed).
- **Per-scene unique landmark labels.** Every scene's section uses a unique `aria-labelledby` or `aria-label`. Duplicates fail the `vitest-axe` `landmark-unique` rule.
- **Motion budget ≤360 ms per transition.** Every animation respects `prefers-reduced-motion`. The prologue is the site entry experience — its beats are scroll-driven (not a continuous loop); a static fallback renders under `prefers-reduced-motion`. There is no ambient continuous-motion loop anywhere in the app.
- **Analytics hard ceiling: ≤15 named events.** Currently 7 (see `src/analytics/events.ts`; Sub-Plan B pruned 3 dead landing events from 10). Adding an event needs a justification. Button clicks should use Umami's `data-umami-event="..."` attribute, not JS. Scene-reach uses the `useTrackSceneReach` hook with once-per-session dedupe.
- **Zod at the boundary.** Every dataset loaded from `src/data/` is validated. Treat external input as `unknown` until narrowed.
- **TS strict; treat indexed access defensively.** `noUncheckedIndexedAccess` is NOT enabled, so the compiler won't force it — but narrow array/record access with a guard rather than `!` by convention.

## Provenance discipline (this is the project's primary success criterion)

Every number, embedding coordinate, attention weight, and probability shown on this site comes from **GPT-2 small**, run offline. **They are illustrative.** Frontier providers (Claude, ChatGPT) do not expose token-level attention, embedding coordinates, or full next-token distributions for arbitrary input, so this site cannot honestly visualize their internals.

Rules:

- Any Deep panel that could be misread as measuring a frontier model carries an amber `CaveatNote` component. Do not remove or weaken these.
- The `Compare` scene tags every claim row as **(a) confirmed**, **(b) reasonably inferable**, or **(c) widely reported**, with a `lastUpdated` stamp. If you add a row, you must pick a tier honestly. (c) is acceptable; quietly upgrading to (a) is not.
- The `About` scene names the model, the dataset URL, and the illustrative-vs-measured discipline in-app. Do not let copy elsewhere blur this line.
- Acceptance criterion: a technical reader cannot catch the site in a misleading claim. If you're unsure whether a visualization implies more than it can honestly show, add a CaveatNote.

## What NOT to commit (over-reveal filter)

- **Figma file IDs.** Always reference design source of truth as "the project's private Figma file (link kept in maintainer notes)". The ID was scrubbed from working tree on 2026-06-04 (see `docs/audits/2026-06-04-doc-drift.md` companion work).
- **Internal planning artifacts.** No `.claude/plans/*` paths, no PRP-style internal artifacts, no operator notes.
- **Absolute paths under `/Users/...` or any developer home dir.** Use repo-relative paths.
- **Vendor account UUIDs.** The Umami site ID lives only in `.env.example` as a contract — never inline in docs or code.
- **Untriaged inline `style={{}}` blocks in new components.** Either categorize under cheat-sheet Categories 1–3 in the same PR, or migrate to Tailwind utilities.

Run this before any doc commit: `grep -rn "<token>" --include="*.md"` for each of the above. Working-tree clean is the bar; git history is not rewritten.

## Where to go next

- Public pitch + run/test/build commands: [README.md](README.md)
- Per-area source maps: [docs/CODEMAPS/](docs/CODEMAPS/) (generated 2026-06-04)
- Product intent, decisions, success metrics: [docs/PRD.md](docs/PRD.md)
- A11y audit + remaining contrast findings: [docs/a11y/2026-06-01-audit.md](docs/a11y/2026-06-01-audit.md)
- Tailwind migration discipline + remaining exceptions: [docs/tailwind-migration/cheat-sheet.md](docs/tailwind-migration/cheat-sheet.md)
- Doc drift audit (latest): [docs/audits/2026-06-04-doc-drift.md](docs/audits/2026-06-04-doc-drift.md)
- Per-PR release log: [CHANGELOG.md](CHANGELOG.md)
- Brand voice (design-historical; the landing page was dissolved into the prologue): [docs/landing-page-brand-voice.md](docs/landing-page-brand-voice.md)
- Landing-page design direction (design-historical; the landing page was dissolved into the prologue): [docs/landing-page-design-direction.md](docs/landing-page-design-direction.md)
