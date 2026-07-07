# CLAUDE.md — The Atlas (Interactive Explainer)

Agent-facing entry doc. Public pitch + run/test/build commands live in [README.md](README.md); per-PR release log in [CHANGELOG.md](CHANGELOG.md). The design handoff that specified this build is not committed (see over-reveal filter below).

## What this repo is

**The Atlas** — a nautical-chart-themed, single-page scrolling explainer of LLM internals. A language model is treated as territory to be surveyed: every concept is a numbered chart plate across two volumes — **Volume I · Foundations** (I Boundaries of Memory / context window, II Standing Orders / system prompt, III Bearings from Afar / retrieval, IV The Inference Passage + IV·Detail The Passage Sounded / inference with live decode controls) and **Volume II · Agents** (V The Self-Directed Survey / agents, VI The Scouting Party / subagents, VII The Circuit / loops) — followed by a **Gazetteer** (17-term glossary) and a **Colophon** (about). One scrolling page, hash slugs `#/{id}` per section, no router. Dark only — dark IS the design.

## Stack (lock these in your mental model)

| Layer | Choice | Notes |
|---|---|---|
| Build | Vite 7 | `npm run dev` → `localhost:5173` |
| UI | React 19 | Function components only |
| Types | TypeScript 5.7 **strict** | `exactOptionalPropertyTypes` on; `noUncheckedIndexedAccess` NOT enabled — narrow indexed access by convention; no `any` in app code |
| Styles | Tailwind v4 with `@theme` tokens | Atlas tokens in `src/index.css`; canonical theme classes first, arbitrary-value utilities for one-off geometry |
| Motion | `motion` (entrances) + Web Animations API (ambient loops) | **No GSAP, no Three.js, no anime.js** |
| Fonts | Self-hosted Fraunces · Hanken Grotesk · Spline Sans Mono | Latin variable woff2 in `public/fonts/`; no third-party font requests |
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
| `npm run typecheck` | `tsc --noEmit` (app + node configs) | Before commit |
| `npm run lint` | ESLint — zero errors, zero warnings | Before commit |
| `npm run format` | Prettier write across `src/`, `tests/`, `e2e/` | Before commit |
| `npm test` | Vitest unit + a11y-unit | After any component change |
| `npm run e2e` | Playwright full suite (Chromium) | Before merging anything touching plates, nav, or motion |
| `npm run a11y` | vitest-axe per plate + app shell | After any landmark/label change |
| `npm run a11y:e2e` | Playwright + axe across all 11 sections | Before claiming the audit still passes |

## Architecture in 60 seconds

- **`src/plates/plates.config.ts` is the single source of truth.** It declares the 11 canonical section ids (`home`, `plate-i`…`plate-vii`, `plate-iv-detail`, `gazetteer`, `about`), rail labels/groups, header-nav mapping, and volume-divider placement. Section ids double as hash slugs (`#/{id}`).
- **Fixed 1280px design canvas.** Every screen is a 1280×960 `<PlateSheet>`; `useScaleToFit` scales the whole stage with CSS `zoom` (layout-affecting, so document height stays correct). The station rail hides below 1100px viewports.
- **No routing library.** Scroll-spy = the *last section whose top passed the viewport midpoint* (rAF-throttled scroll listener, not IntersectionObserver); `useHashSync` mirrors the active section to the URL via `replaceState`; keyboard pages with ←/k and →/j; `scrollToScene` offsets by header height × stage zoom + 26px.
- **Top-level dirs:**
  - `app/` — nav context + cross-cutting hooks (hash-sync, scroll-spy, keyboard, scale-to-fit, stage zoom)
  - `components/` — shell + frame primitives (PlateSheet/TitleRow/Lede/Footer, AtlasHeader, StationRail, RouteLink, AtlasSection, VolumeDivider)
  - `plates/` — the 11 screen components + `plates.config.ts` + `nextToken.ts` (pure decode math) + `gazetteer.data.ts`
  - `motion/` — `useAtlasEntrance` (entrance + ambient grammar)
  - `analytics/` — Umami wrapper, event taxonomy, scene-reach hook

## Conventions that bite if you ignore them

- **Theme tokens first, never raw hex in TSX.** Colors come from the `@theme` tokens (`text-gold`, `text-blue`, `bg-sheet`, `bg-panel/40`, the `text-ink-*` ramp; hairlines are `border-ink-nav/18` etc). Exceptions: SVG stroke/fill attributes and gradient strings transcribed from the design reference (comment them).
- **Per-section unique landmark labels.** `<AtlasSection>` gives every section a unique `aria-label`; duplicates fail the vitest-axe landmark-unique rule.
- **Motion grammar is fixed.** Entrance per section (IO threshold 0.15, once, never re-run): sheet 620ms rise, SVG dash-draw 760ms/40ms stagger, circle pop 520ms/26ms stagger. Ambient loops: gold dashed routes flow at ~14px/s (WAAPI), hollow halo circles pulse 2.4s. ALL of it is skipped under `prefers-reduced-motion` — content fully visible statically. Don't add scroll-tied animation.
- **Analytics hard ceiling: ≤15 named events.** Currently 5 (see `src/analytics/events.ts`). `scene-reached` fires from `useTrackSceneReach` (once per section per session); all click events use Umami's `data-umami-event` attributes, not JS calls.
- **Keyboard nav must not eat form controls.** ←/k →/j paging ignores INPUT/TEXTAREA/SELECT — the Plate IV·Detail sliders depend on this.

## Honesty discipline (primary success criterion)

**Every number on this site is illustrative.** Token counts, similarity scores, attention weights, embedding bars, the candidate logits behind the Plate IV·Detail controls (`"A" 3.0 · "The" 2.3 · "In" 1.4 · "Each" 0.9 · "Tokens" 0.7 · "Think" 0.2`) — all of them are fixed design-reference values, not measurements of any real model. Rules:

- Keep the `// illustrative — design-reference values, not measured` comments next to hardcoded data. Add the same comment to any new illustrative data.
- The decode math (`src/plates/nextToken.ts`) is real math over illustrative inputs: exact softmax with temperature clamped to ≥0.05, descending sort, `cum < topP` nucleus rule, greedy ⇒ rank 1. Change it only with unit tests proving the distribution.
- Do not add copy implying any value was measured from a real model. A technical reader must not be able to catch the site in a misleading claim.

## What NOT to commit (over-reveal filter)

- **The design handoff package** (`design_handoff_atlas_website/`, root-level prototype files). It stays untracked; reference it as "the design handoff (kept in maintainer notes)".
- **Internal planning artifacts.** No `.claude/plans/*` paths, no operator notes.
- **Absolute paths under `/Users/...`** — use repo-relative paths in docs and code.
- **Vendor account UUIDs.** The Umami site ID lives only in `.env.example` as a contract.

## Where to go next

- Public pitch + commands: [README.md](README.md)
- Per-PR / per-milestone release log: [CHANGELOG.md](CHANGELOG.md)
- Historical docs from the previous product ("Inside an LLM": PRD, a11y audits, Tailwind migration notes) live under `docs/` — they describe the pre-Atlas site and are kept for provenance, not as current guidance.
