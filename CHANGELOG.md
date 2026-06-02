# Changelog

All notable changes are documented per merged PR. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions use date-tagged milestones rather than semver since this project ships as a single deployed site rather than a published package.

PR numbers are canonical.

---

## [2026-06-02] — Analytics + Public Launch

**PR [#13](https://github.com/thanhthuynh/llm-visualization/pull/13) · `feat(analytics): Umami Cloud tracking + CF Pages deploy spec`**

### Added
- Umami Cloud tracking via vendor script in `index.html` with `%VITE_UMAMI_WEBSITE_ID%` placeholder Vite substitutes at build time.
- `src/analytics/events.ts` — canonical event-name union + typed payload interfaces (10 named events).
- `src/analytics/umami.ts` — typed `track()` wrapper; safely no-ops when `window.umami` is undefined.
- `src/analytics/useTrackSceneReach.ts` — once-per-session scene-reach hook with `useRef<Set>` dedupe.
- `data-umami-event="…"` declarative click tracking on landing CTAs, in-app navigation (rail, prev/next), and in-scene controls (chips, depth toggles, head selector, landing-preview toggle).
- `.env.example` documenting `VITE_UMAMI_WEBSITE_ID`.
- README "Deploy" + "Analytics" sections.
- Cloudflare Pages deployment spec.

### Tests
- `tests/analytics/umami.test.ts` — wrapper no-ops without `window.umami`; forwards args exactly when present.
- `tests/analytics/useTrackSceneReach.test.tsx` — dedupe across rerenders; re-emits on scene change; depth changes do not re-emit.

---

**PR [#12](https://github.com/thanhthuynh/llm-visualization/pull/12) · `fix(explorer): honor URL hash on initial mount so scene-card deep-links work`**

### Fixed
- Initial-mount hash sync — scene-card deep links from the landing page now scroll directly to the target scene.

### Tests
- App-level test spies on `scrollIntoView` to cover the `useLayoutEffect` initial-hash path.

---

## [2026-06-01] — Landing page

**PR [#11](https://github.com/thanhthuynh/llm-visualization/pull/11) · `Plan 10 — Landing page (full implementation)`**

### Added
- Six landing sections per `docs/landing-page-design-direction.md`:
  - Hero with eyebrow, H1, lede, CTA row, and animated chip-strip preview (~7.4 s cycle, reduced-motion safe).
  - "What you'll see" scene-card grid (7 cards + monogram cap, accent stripes, hover lift).
  - "Methods · Provenance" section with amber left-rule and inline definition list.
  - "Two ways to read it" Surface↔Deep toggle demo cross-fading Predict scene copy.
  - Tech-stack neutral mono section.
  - Footer with seven-dot pipeline strip, launch CTA, GitHub + MIT links, build-time commit hash.
- Build-time commit-hash plumbing into `vite.config.ts`.
- Landing-page routing (hash-based, no router).

---

## [2026-06-01] — Bug fixes + landing design

**PR [#10](https://github.com/thanhthuynh/llm-visualization/pull/10) · `Plan 9 — Decode-loop / nav-sync / Prev-style bug fixes + landing-page design`**

### Added
- `useScrollSpy` hook — wheel/trackpad scroll updates the progress rail.
- `docs/landing-page-design-direction.md` — landing-page design brief (Figma input).
- `docs/landing-page-brand-voice.md` — voice profile derived from in-app copy.

### Fixed
- Decode temperature slider now drives the live softmax distribution (not stale).
- SceneNav Prev button uses `text-text-primary` when enabled (was incorrect token).
- ESLint `no-undef` resolved via local IO type aliases in the affected test.

---

## [2026-06-01] — Canonical Tailwind classes

**PR [#9](https://github.com/thanhthuynh/llm-visualization/pull/9) · `refactor: canonical Tailwind classes + drop deprecated tsconfig baseUrl`**

### Changed
- `bg-(--color-X)` → `bg-X` and similar across the codebase where Tailwind v4's `@theme {}` auto-generates utilities.
- Pilot on `CaveatNote.tsx`, then propagated repo-wide.
- `docs/tailwind-migration/cheat-sheet.md` extended with the canonical-vs-arbitrary translation table.

### Fixed
- Dropped deprecated `tsconfig.baseUrl`; paths now resolve relative to tsconfig directly (TS 5+).
- Prefixed `tsconfig.paths` values with `./` (TS 5090 requires relative paths without `baseUrl`).

---

## [2026-06-01] — Tailwind migration

**PR [#8](https://github.com/thanhthuynh/llm-visualization/pull/8) · `refactor: migrate inline styles to Tailwind utilities + CSS-var passthrough`**

### Changed
- Five-wave migration of inline `style={{...}}` to Tailwind utilities:
  - Wave 1 — pure-static components (`CaveatNote`, `Chip`).
  - Wave 2 — primitive components.
  - Wave 3 — dynamic-style components (CSS-var passthrough pattern established).
  - Wave 4 — layout primitives.
  - Wave 5 — all nine scenes.
- `docs/tailwind-migration/cheat-sheet.md` documents the translation tables (layout, visual/typography, dynamic-value passthrough) and the 16 legitimate remaining inline-style exceptions.

### Tests
- Updated `ClaimTier` and `ProgressRail` tests to read CSS-var values instead of resolved styles.

---

## [2026-06-01] — Accessibility audit

**PR [#7](https://github.com/thanhthuynh/llm-visualization/pull/7) · `test(a11y): axe-core unit + E2E + audit doc; fix landmark-unique; defer color-contrast`**

### Added
- `vitest-axe` per-scene axe smoke tests (9 scenes + app shell = 10 unit tests).
- `@axe-core/playwright` E2E axe scan across all 9 scenes via rail navigation.
- `npm run a11y` + `npm run a11y:e2e` scripts.
- `docs/a11y/2026-06-01-audit.md` — full audit report with deferred follow-ups.

### Fixed
- **Serious — `landmark-unique`:** `<nav aria-label="Scene navigation">` repeated across all 9 scenes when rendered together. `SceneNav` now accepts an optional `label`; `SceneStation` passes `${title}: scene navigation` so every landmark is uniquely labeled. (Commit `289abe9`.)

### Deferred
- **Serious — `color-contrast` (9 occurrences):** every scene's accent text falls below 4.5:1 vs `#16161f`. Tracked as a brand-level follow-up: lighten the 7 accents OR restrict accent text to ≥14pt bold OR restrict accents to backgrounds + borders only.

### Status snapshot at ship
- 10/10 unit-axe pass · 9/9 E2E-axe pass (with color-contrast filtered) · 194/194 unit pass · lint clean · typecheck clean · `npm run build` 467 KB / 146 KB gzip.

---

## [2026-06-01] — ESLint hygiene

**PR [#6](https://github.com/thanhthuynh/llm-visualization/pull/6) · `chore(eslint): config hygiene — globals.node + .vite ignore + drop disable-no-undef`**

### Changed
- Added the `globals` package; split browser vs node globals per config file.
- Added `.vite` to ESLint ignores.
- Dropped `/* eslint-disable no-undef */` directives in `vite.config`, `vitest.config`, `playwright.config`, and `tests/setup` — proper globals coverage made them unnecessary.

---

## [2026-06-01] — Compare section

**PR [#5](https://github.com/thanhthuynh/llm-visualization/pull/5) · `feat: Compare section (Claude vs ChatGPT scale-up)`**

### Added
- `CompareScene` with the "convergence, not bigger-is-smarter" framing.
- `ClaimTier` — (a)(b)(c) tier badges on every claim row.
- `CompareTable` — tier-tagged claim rows with `lastUpdated`.
- `PhilosophyCard` — Constitutional AI / RLHF blocks.
- `TokenizerCount` — paired-card primitive.
- `ContextWindowBar` — paired-bars primitive (vendor-keyed colors).
- `src/data/compare.config.ts` — tier-tagged claims dataset.
- Compare rail dot enabled in `ProgressRail`; `'compare'` added to `SceneId` union (reuses predict accent).

### Tests
- E2E: `compare-section.spec.ts`; `mvp-flow` ArrowDown count updated for 9-stop pipeline.

---

## [2026-05-31] — Honesty-critical scenes

**PR [#4](https://github.com/thanhthuynh/llm-visualization/pull/4) · `feat: honesty-critical scenes (Embeddings + Attention)`**

### Added
- `EmbedScene` (cyan accent) with 2D meaning-space, axes, cluster ellipse, and contextual-shift dot.
- `EmbeddingSpace` SVG + `EmbeddingDot` (solid + ghost variants).
- `AttentionScene` with arcs, 8×8 attention matrix, head selector, and 2 CaveatNotes.
- `AttentionArc` — quadratic Bezier with weight-scaled stroke.
- `AttentionMatrix` — d3-magma ramp + causal mask.
- `HeadSelector` — 3-button group with `aria-pressed`.
- `cat.json` dataset; `PromptId` widened to `sky | cat`.

### Decided
- **3D embeddings dropped** in favor of 2D meaning-space per Figma. `react-three-fiber` / `three.js` removed from the recommended library set.

### Tests
- E2E: `honesty-scenes.spec.ts` covering Attention caveats + Embed meaning-space.

---

## [2026-05-31] — Figma fidelity polish

**PR [#3](https://github.com/thanhthuynh/llm-visualization/pull/3) · `feat: Figma-fidelity scene polish + desktop-responsive layout`**

### Changed
- Aligned all scenes to the Figma design-system tokens.
- Switched to desktop-responsive layout.

---

## [2026-05-31] — MVP scenes

**PR [#2](https://github.com/thanhthuynh/llm-visualization/pull/2) · `phase 2`**

### Added
- `PromptScene` with prompt field + example chips.
- `PromptField` with blinking caret.
- `TokenizeScene` with motion layout reflow + CaveatNote.
- `DecodeScene` with temperature slider + side-by-side distributions.
- `DistributionPair` (Decode deep view).
- `AssembleScene` with streaming reply + detokenize chain.
- `ReplyBubble` with streaming + `prefers-reduced-motion` support.
- Cross-scene MVP-flow E2E.

### Changed
- `App.tsx` now derives mounted scene IDs from `SceneConfig.implemented`.

---

## [2026-05-31] — Foundation + reference scene

**PR [#1](https://github.com/thanhthuynh/llm-visualization/pull/1) · `Feat/llm explainer foundation`**

### Added
- **Design tokens** (Tailwind v4 `@theme {}` block): seven accent hex values, dark surface palette, typography (Space Grotesk / Inter / Space Mono), radii, spacing.
- **Data layer:** `sky.json` precomputed GPT-2-small dataset; Zod schema + loader with required provenance.
- **Context providers:** `DepthContext` (Surface/Deep), `RunningExampleContext` (selected prompt + dataset).
- **Cross-cutting hooks:** `useHashSync` (scroll-snap deep linking), `useKeyboardNav` (arrows / PageUp / PageDown).
- **Primitives:** `EyebrowLabel`, `AccentRule`, `Chip`, `DataBar`, `CaveatNote`, `DeepToggle`, `ProgressRail`, `TopBar`, `SceneStation`.
- **Reference scene:** `PredictScene` end-to-end with temperature slider — the pattern every subsequent scene mirrors.
- **About scene:** provenance / illustrative-model note; dataset source string surfaced in UI.
- **A11y:** `DataBar` honors `prefers-reduced-motion`.
- **README:** status, provenance note, run/test commands.
- **E2E foundation:** Playwright happy-path covering `PredictScene` + a11y basics.

---

## Pre-foundation — initial scaffold

Vite + React 19 + TypeScript strict scaffold, Tailwind v4 install, ESLint + Prettier configuration, Vitest + Playwright test plumbing.
