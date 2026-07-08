# Changelog

All notable changes are documented per merged PR. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions use date-tagged milestones rather than semver since this project ships as a single deployed site rather than a published package.

PR numbers are canonical.

---

## [2026-07-08] — Design-handoff visual fixes (Plates VI · VII · Colophon) + README showcase

Four-point correction pass against the updated design reference (screens 08/09/11), one commit per fix, followed by a public-facing README overhaul.

- **Security** `npm audit fix` to zero known vulnerabilities (was 2 critical / 2 high / 1 moderate / 1 low, all in dev tooling): vitest ≥ 3.2.6 (UI-server arbitrary file read), vite ≥ 7.3.4 (`server.fs.deny` bypass + launch-editor NTLMv2 disclosure, Windows), form-data (CRLF injection), js-yaml (merge-key DoS), esbuild (dev-server file read, Windows). Lockfile-only — the shipped bundle is byte-identical; full gate suite (typecheck · lint · 134 unit · 12 a11y · build · 24 e2e · 11 a11y-e2e) green after the bumps. GitHub repo About/description/topics refreshed to match the Atlas (the old description predated the rebuild and claimed "real numbers from GPT-2 small", contradicting the honesty rule).
- **Changed** README into a showcase landing page: centered masthead with live-site link and badge row, three committed product screenshots (`docs/screens/` — home route map, Plate IV·Detail interactive sounding, Plate VI scouting party), an "Under the hood" section (no-router scroll architecture, fixed 1280×960 sheet + CSS zoom, real decode math, motion grammar, self-hosted fonts, a11y gates, cookieless analytics ceiling), and a project-structure tree. The honesty section stays up top, verbatim in spirit: every number illustrative, only the math real.

- **Fixed** Plate VI (*The Scouting Party*): the fan-out/fan-in route SVG was stretched to fill the flexible diagram area (`preserveAspectRatio="none"` + `h-full`) while the lead/subagent cards sat at fixed pixel positions, so the curves drifted off the cards and collided with the caption. The diagram is now a fixed 1088×470 canvas — SVG at its natural 1:1 viewBox scale, cards and route labels pixel-positioned inside the same canvas — vertically centered in the remaining sheet height, with the caption moved out of the canvas into normal flow below it. Site rule, now commented at the source: never scale a route SVG independently of its pixel-positioned overlays. (Audited the home hero map, Plate V, Plate III, and Plate IV·Detail for the same defect: none drift — their SVGs are either at fixed natural size or share a normalized %-coordinate space with their overlays.)
- **Fixed** Plate VII (*The Circuit*): the "Reason" label overlapped the top station circle. All three station labels now take the corrected reference geometry — Reason centered on the panel (circle cx = panel center) with its glyphs ~14px clear above the circle, Observe right-aligned (`left:0, width:112px`) and Act offset (`left:358px`) for an ~11px gap to their circles, both vertically centered on the circle centers (tops 278→274). The whole circuit block (470×430 panel + iterations/stop-conditions column, a 1088×430 canvas) is now vertically centered in the sheet's remaining height instead of pinned under the lede.
- **Fixed** Colophon (*About*): the intro paragraph sat in the full-width header block, pushing the two-column grid down until the edition index's final row (APP. · Gazetteer of Terms) clipped past the sheet bottom. The intro now opens the grid's LEFT column (max-width 620px, margin 0 0 30px) above THE PREMISE; the grid starts directly under the H1 (margin-top 26px), so the right column (COLOPHON card + IN THIS EDITION) top-aligns with the intro's first line and the full index through APP. fits with clear margin above the footer rule (measured: card top Δ0px from intro top; 14px clearance below the APP. row).

## [Unreleased] — The Atlas rebuild (branch `feat/atlas-rebuild`)

Full product replacement: "Inside an LLM" → **The Atlas**, a nautical-chart-themed single-page explainer of LLM internals (7 plates + Plate IV·Detail in two volumes, gazetteer, colophon). Recreated natively from the design handoff in the existing Vite + React 19 + TS strict + Tailwind v4 stack. One commit per milestone.

### M0 — Theme + scaffold

- **Added** Atlas `@theme` design tokens (page/sheet/panel surfaces, gold + blue accents, 8-step ink ramp, Fraunces/Hanken Grotesk/Spline Sans Mono families, sheet shadow, motion durations). Dark only — no light mode.
- **Added** self-hosted variable fonts (latin subsets, `public/fonts/*.woff2`) replacing all third-party Google Fonts requests; preloads in `index.html`.
- **Added** `src/plates/plates.config.ts` — successor to `scenes.config.ts`: 11 canonical section ids (`home`, `plate-i`…`plate-vii`, `plate-iv-detail`, `gazetteer`, `about`), rail labels/groups, header-nav mapping, volume-divider placement.
- **Added** `<PlateSheet>` chart frame (1280×960 sheet, 48px survey grid, double gold frame at insets 34/42, tick strips, chart/hero variants) plus `PlateTitleRow`/`PlateLede`/`PlateFooter`, `<VolumeDivider>`, `<AtlasSection>` (unique landmark labels).
- **Changed** `App.tsx` to the Atlas scroll column (1280 canvas, 36px section gap, volume dividers); placeholder plate components stubbed for the M2–M5 workstreams.
- **Changed** `npm run lint` to ignore the vendored design-handoff prototype files.

### M1 — Shell + navigation

- **Added** sticky `<AtlasHeader>` (brand mark + CHARTS · GLOSSARY · ABOUT, active item follows the scroll-spy section's nav group) and fixed `<StationRail>` (11 stations under VOLUME I / VOLUME II / REFERENCE captions, gold active marker, hidden below 1100px).
- **Added** `<RouteLink>` (real `#/{id}` anchors with offset-aware smooth scrolling), `AtlasNav` context, `useScaleToFit` (CSS `zoom` scales the 1280px canvas to the viewport; rail-aware available width).
- **Changed** hook internals per the handoff spec: `useScrollSpy` now uses the viewport-midpoint rule behind rAF (was IntersectionObserver), `useHashSync` writes `#/{id}` slugs via replaceState, `useKeyboardNav` pages with ←/k and →/j (was ↑/↓), `scrollToScene` offsets by header height × stage zoom + 26px (was scrollIntoView).
- **Changed** hook unit tests to the new behaviors; shell tests cover header/rail rendering and active-state mapping.

### M2 — Volume I plates

- **Added** `PlateI` (*The Boundaries of Memory*): 128K context-window transect — axis, six-segment bar (System/Retrieved/Conversation/Input/Reserved-hatch/Open) with leader lines and token counts, three-column notes grid, `1 SQUARE = 1,024 TOKENS` footer.
- **Added** `PlateII` (*Standing Orders*): pinned SYSTEM message stack + six order entries + `COST · 412 TOKENS` callout.
- **Added** `PlateIII` (*Bearings from Afar*): 760×360 vector-space SVG (solid near-docs vs dashed far-docs with similarity scores), `RETRIEVED → CONTEXT` panel, five-step retrieval pipeline strip.
- All copy verbatim from the design reference; all numbers illustrative and commented as such. Render tests per plate.

### M3 — The Inference Passage + Plate IV·Detail

- **Added** `PlateIV` (*The Inference Passage*): seven stations on a dashed gold route with abstract glyph cards (text lines, token chips, embedding/attention heat grids, probability bars, nucleus rows, output caret) and the token scale-bar footer.
- **Added** `PlateIVDetail` (*The Passage, Sounded*): the prompt "What is a token?" charted across seven positioned cards on a 1088×586 canvas with a dashed connecting polyline, plus live **temperature / top-p / decode** controls that recompute the Prediction and Sampling cards instantly.
- **Added** `nextToken.ts` — pure next-token distribution math matching the prototype exactly: `softmax(logit / max(T, 0.05))`, descending sort, `cum < topP` nucleus rule, greedy ⇒ rank 1; fixed illustrative candidate logits (A 3.0 · The 2.3 · In 1.4 · Each 0.9 · Tokens 0.7 · Think 0.2). 9 unit tests cover sharpening, flattening, nucleus boundaries, greedy strings, and bar widths.

### M4 — Volume II plates

- **Added** `PlateV` (*The Self-Directed Survey*): the reason → act → observe agent loop as dashed gold arcs with GOAL/ANSWER arrows, the five-instrument panel, and the three-step run log.
- **Added** `PlateVI` (*The Scouting Party*): lead-agent fan-out/fan-in — dashed gold dispatch curves and solid blue findings curves (stretched-viewBox rendering faithfully preserved), three isolated-context subagent cards with RETURNS token bars.
- **Added** `PlateVII` (*The Circuit*): the closed loop with turn markers, the three-turn iterations table, and the goal-met / step-limit / no-progress stop conditions.
- SVG marker ids namespaced per plate (`pv-`/`pvi-`/`pvii-`) so arrowheads can't collide on the one-scroll page. 22 render tests.

### M5 — Reference screens

- **Added** `HomePlate` hero: kicker, display H1, stat block, and the chart-panel route map — SVG route network plus station rings, the Plate IV gateway diamond, and the Plate V bullseye, with seven clickable station labels routing to their plates.
- **Added** `GazetteerPlate` + `gazetteer.data.ts`: 17 alphabetized entries (term · plate ref · one-line definition), every entry a cross-link to its plate; the `17 ENTRIES` footer count derives from the data.
- **Added** `ColophonPlate` (*About the Atlas*): premise, HOW TO READ THESE CHARTS legend, colophon card, and the clickable IN THIS EDITION plate index.
- Shell test queries scoped to header/rail/dividers now that hero and colophon legitimately repeat those strings.

### M6 — Motion, a11y, analytics, ship

- **Added** `useAtlasEntrance`: per-section entrance grammar (sheet 620ms rise, SVG dash-draw 760ms with 40ms stagger, circle pop 520ms with 26ms stagger; IntersectionObserver 0.15, once per section) + ambient loops (gold dashed routes flow at ~14px/s, hollow halo circles pulse 2.4s). Entrances run on `motion`; ambient loops on the Web Animations API (motion's `animate()` does not reliably loop `stroke-dashoffset`). Everything is skipped under `prefers-reduced-motion` — verified statically visible.
- **Changed** analytics to the Atlas taxonomy (5 of ≤15 events): `scene-reached` re-pointed at the 11 section ids via `useTrackSceneReach`; `cta-rail-jump`, `cta-nav`, `cta-route-link`, `cta-decode-control` fire declaratively via `data-umami-event` attributes.
- **Changed** test suites to the Atlas: per-plate vitest-axe suite + app-shell axe; Playwright specs rewritten (a11y sweep across all 11 sections, happy path, navigation shell incl. reduced-motion keyboard determinism, Plate IV·Detail decode controls). 134 unit/a11y tests + 24 e2e tests green.
- **Removed** all dead old-site code: `src/scenes`, `src/prologue`, old components/contexts/hooks, `src/data` datasets, `src/utils`, old motion module, ~75 obsolete test files; dropped unused `d3-scale`, `d3-scale-chromatic`, `zod` dependencies and the d3 vendor chunk.
- **Changed** `index.html` meta/title to The Atlas; `CLAUDE.md`/`README.md` rewritten to describe the shipped product (all-illustrative honesty discipline); design-handoff paths scrubbed from source comments and gitignored.

---

## [2026-06-23] — One-scroll cutover (Sub-Plan E)

**PR [#20](https://github.com/thanhthuynh/llm-visualization/pull/20) · `feat(cutover): Sub-Plan E — test canonicalization, OG/meta, CLAUDE.md corrections, docs/provenance sweep`**

### Added
- E2E `/#`-entry canonical test: all 14 implemented stations reachable from root hash.
- 14-station Playwright a11y coverage (expanded from 9 to cover all Part-1 + Part-2 + Compare + About).
- Deterministic keyboard-nav E2E spec (settled flake from rail-label refactor).

### Changed
- `index.html` OG/meta tags updated to reflect the 14-station one-scroll reality (title, description, `og:title`, `og:description`).
- `CLAUDE.md` corrected: `noUncheckedIndexedAccess` claim, 14-station architecture description, stale `landing/` references removed, analytics event count updated 10→7, motion budget note updated to prologue-accurate framing.
- CODEMAPS (`data.md`, `architecture.md`, `frontend.md`) refreshed to reflect prologue + 14 stations + 3 Act-2 datasets + new components (`WindowTape`, `ActDivider`, `EyebrowLabel` accent-capable, `railModel`, `@/motion/tokens`); `src/landing/` references removed.
- `CHANGELOG.md` backfilled with entries for PRs #16–#20.

---

## [2026-06-22] — Act 2: Around the model (Sub-Plan D)

**PR [#19](https://github.com/thanhthuynh/llm-visualization/pull/19) · `feat: Act 2 — Around the model (data layer + 5 Part-1 scenes; one-scroll Sub-Plan D)`**

### Added
- Three illustrative datasets + Zod schemas + loaders (all `status:'illustrative'`):
  - `conditioning.json` / `ConditioningDatasetSchema` / `loadConditioning` — System Prompt scene.
  - `retrieval-toy.json` / `RetrievalToyDatasetSchema` / `loadRetrievalToy` — RAG scene.
  - `hallucination-case.json` / `HallucinationCaseDatasetSchema` / `loadHallucinationCase` — Hallucination scene; `superRefine` asserts `top-1 ≠ truth` and `truth ∈ candidates`.
- Five Part-1 scene components: `InterludeScene`, `WindowScene`, `SystemScene`, `RagScene`, `HallucinateScene`.
- `WindowTape` shared component — context-window strip visual used across Part-1 scenes.
- `DatasetStatusSchema` (`'illustrative' | 'measured'`) + shared `refineMeasuredSource` guard in `schema.ts`.
- 14-station mount: `scenes.config.ts` updated with Part-1 scene entries (`part:'part1'`); `getMountedSceneIds()` now returns all 14 implemented stations.
- Unit tests for all three Act-2 datasets (schema validation, superRefine negative cases).
- A11y smoke tests for `WindowScene`, `SystemScene`, `RagScene`, `HallucinateScene`, `InterludeScene`.

---

## [2026-06-21] — Unified chrome (Sub-Plan C)

**PR [#18](https://github.com/thanhthuynh/llm-visualization/pull/18) · `feat: unified chrome — grouped rail, scene-aware top bar, entrance grammar (one-scroll Sub-Plan C)`**

### Added
- `railModel.ts` — typed `RailItem[]` builder; `ProgressRail` now renders grouped Part 1 / Part 2 / Compare / About sections with implementation-aware ticks.
- `ActDivider` component — visual separator between Part 1 and Part 2 in the scroll column.
- `EyebrowLabel` accent-capable — accepts `accent` prop; `TopBar` uses it to show active station name in its theme color.
- `scrollToScene` helper — reduced-motion-aware programmatic scroll; all nav sources (rail, keyboard, prev/next) route through it.
- `@/motion/tokens` (`src/motion/tokens.ts`) — shared entrance animation constants enforcing the ≤360 ms budget; used by all station entrance animations.
- Shared once-on-enter station entrance grammar — opacity/transform cascade capped at 360 ms, reduced-motion safe.

### Changed
- `ProgressRail` redesigned: grouped intro + part-label + station ticks + compare + about; dot labels collapsed to single `aria-label` per tick.
- `TopBar` pill now reflects the active scene accent color via `EyebrowLabel`.

---

## [2026-06-20] — Cinematic prologue (Sub-Plan B)

**PR [#17](https://github.com/thanhthuynh/llm-visualization/pull/17) · `feat: cinematic prologue as site entry (one-scroll Sub-Plan B)`**

### Added
- `src/prologue/` — cinematic 7-beat scroll-scrubbed intro (`PrologueAnimated`), reduced-motion static variant (`PrologueStatic`), mode selector (`PrologueMode`), beat config (`beats.config.ts`), per-beat components, snap geometry (`snap.ts`), `useBeatProgress`, `usePrologueGate`.
- "INTRO" tick in `ProgressRail` maps to `#intro` prologue anchor.
- Skip-intro affordance wired to the interlude forward target.
- Prologue E2E spec + a11y axe scan at `/`.

### Removed
- `src/landing/` — all 8 landing-page section files deleted. Copy and provenance prose migrated to the `AboutScene` finale.

### Changed
- Analytics: 3 dead landing-page events pruned from `events.ts` (10 → 7 named events).

---

## [2026-06-19] — One-scroll foundation (Sub-Plan A)

**PR [#16](https://github.com/thanhthuynh/llm-visualization/pull/16) · `feat: one-scroll foundation — /explorer→/ route collapse, body scroll model, registry-driven scene mount (Sub-Plan A)`**

### Added
- Registry-driven scene mount: `App.tsx` maps `SCENES` entries to `<SceneStation>` components; new scenes require only a `scenes.config.ts` entry + component file.

### Changed
- Route collapsed: `/explorer` → `/`. Single URL, single page.
- Scroll model: document/body scroll (was container-scroll); enables native scroll-snap across the full page.
- `scenes.config.ts` extended with `part` field (`'intro' | 'part1' | 'part2'`) to support grouped rail and `ActDivider` placement.

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
