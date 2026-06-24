# Inside an LLM — Product Requirements Document (Retrospective)

**Version:** 1.0 — written at ship, 2026-06-02.
**Status:** All milestones merged to `main`; site live on Cloudflare Pages with Umami analytics. This document is the *product-lens companion* to the design/engineering spec — what we built, why we made the calls we made, and how we'll know it's working.
**Related docs:**
- **Spec (visual + architecture source of truth):** Engineering + visual spec v1.1 — pinned to the project's private Figma file (link kept in maintainer notes). Where this PRD and the spec disagree on visuals or architecture, the spec wins. This PRD wins on product intent, decisions, and metrics.
- **Spec (v1.0 historical):** Engineering + visual spec v1.0 — the pre-Figma brief; kept for changelog continuity.
- **Repo:** `github.com/thanhthuynh/llm-visualization`
- **CHANGELOG:** in-repo `CHANGELOG.md` (per-PR release entries)
- **A11y audit:** in-repo `docs/a11y/2026-06-01-audit.md`
- **Landing page brand voice + design direction:** in-repo `docs/landing-page-brand-voice.md`, `docs/landing-page-design-direction.md`

---

## 0. Three-doc map — read this first

This project ships three documents on purpose:

| Doc | Question it answers | Source of truth for |
|---|---|---|
| **Spec v1.1** | *What does it look like and how is it built?* | Visual design (Figma-locked), layout grid, component contracts, technical architecture |
| **PRD (this doc)** | *Why does it exist, and how will we know it worked?* | Product intent, decision log, analytics taxonomy, success metrics, scope |
| **README** (in repo) | *What is this, and how do I run it?* | Public-facing pitch, install/test/build commands, provenance disclosure |

If a future reader has 10 minutes and one tab, send them to the README. If they have an hour and want to build on top of it, the spec. If they're deciding whether to make a similar project — or auditing whether this one met its goals — this PRD.

---

## 1. Project overview

### One-line description
A single-page, scroll-snapped interactive explainer of what a Large Language Model does between "you typed a prompt" and "the answer streamed out," shipped with two reading paths (Surface for intuition, Deep for receipts) and a side-by-side of how Claude and ChatGPT compare on architecture and posture.

### Audience (exactly two tiers, no third)
- **Surface reader.** A non-technical friend who wants the intuition. Follows Prev/Next, never opens a deep toggle, leaves with a correct (if coarse) mental model. Must not feel talked down to.
- **Deep reader.** A technically literate peer who wants to confirm we didn't hand-wave. Opens deep toggles, checks the numbers, expects honest sourcing.

There is no "expert/researcher" third tier and no "kid-friendly" zeroth tier. Two-tier respectful disclosure is the entire UX hypothesis.

### Why this project exists (the brief in one paragraph)
LLMs are explained badly almost everywhere. "AI thinks" / "AI understands" framing is wrong; one-bar-per-token decoder cartoons are wrong; the "Claude vs ChatGPT, which is smarter" framing is wrong. This project's job is to deliver a single, honest pass through the actual pipeline using real numbers from a real (small, open) model and explicitly mark what *cannot* be shown for frontier models. Where the conventional framing is wrong, replace it with the right one (e.g., "temperature is a randomness dial, not a creativity dial"; "the honest story between Claude and ChatGPT is convergence, not bigger-is-smarter").

### Success criteria — in priority order
1. **A technical viewer cannot catch you in a lie.** Every simplification is either accurate-as-far-as-it-goes or explicitly flagged. Under-claiming with caveats is acceptable; a confidently wrong picture is not. Verified by: every illustrative number cites a model/file/commit; deep panels carry CaveatNote callouts; the About scene names the model.
2. **A non-technical viewer completes the Surface path without opening a single deep toggle** and leaves with a correct mental model. Verified by: Umami `scene-reached` funnel (target: ≥40% of visitors reach `output` without firing `cta-depth-toggle`).
3. **60fps on a recent laptop; no jank on a mid-range phone.** Verified by: build size (146 KB gzip), no Three.js or GSAP in the bundle, motion budget capped at 360 ms per transition.
4. **Keyboard-operable and legible to a screen reader.** Verified by: 10/10 unit-axe pass, 9/9 E2E-axe pass (color-contrast deferred to brand follow-up), per-scene unique landmarks.
5. **As a portfolio piece it signals craft** — opinionated visual design, restrained library use, honest engineering. Verified by: README provenance section, CHANGELOG covering 10 disciplined Plan releases, public CF Pages URL.

### What we deliberately did NOT build
- No free-text-prompt → live-model internals. Visualizations are precomputed from one curated dataset per prompt because honest live attention/embeddings/distributions on arbitrary input require the actual model in-browser, and that violates the "no library bloat" budget.
- No frontier-API integration. Claude and ChatGPT don't expose token-level state; calling their APIs would give us output text but not the internals we're claiming to visualize. We chose epistemic honesty over fake-but-fancy.
- No accounts, persistence, comments, share-state-as-URL, multi-language, CMS. None of these serve the explainer goal.
- No 3D embeddings (dropped in v1.1 — see Decision #4 below).
- No light mode. Dark is the design.

---

## 2. Scope as shipped

Stations mounted in production (see `src/scenes/scenes.config.ts` for current list):

| # | Scene | Accent | Surface beat | Deep beat |
|---|---|---|---|---|
| 1 | Prompt | `#FFC857` yellow | "Everything starts with a string of characters." | Why the literal string matters; canonical example prompts. |
| 2 | Tokenize | `#6BF178` green | "The text is sliced into the model's chosen pieces." | BPE; token IDs (`464`, `6766`, `318`); byte view (`62 6c 75 65 = "blue"`). |
| 3 | Embed | `#4CC9F0` cyan | "Each token becomes a coordinate the network can do math on." | 2D meaning-space (≈8 labeled dots, cluster ellipse, contextual-shift dot after attention). |
| 4 | Attention | `#F72585` magenta | "Tokens look at the tokens that matter, weighted by relevance." | Arcs + 8×8 matrix with d3-magma ramp + causal mask + head selector (0/1/2). |
| 5 | Predict | `#9D4EDD` purple | "A probability for every possible next token, ranked." | Logits → softmax (`3.1/0.9/0.4 → 0.71/0.06/0.04`); temperature slider live-reshapes the distribution. |
| 6 | Decode | `#FF7B00` orange | "Sample one token, append it, run the loop again." | Side-by-side T=0.2 PEAKED vs T=1.4 FLATTER distributions; temperature slider drives both. |
| 7 | Output (Assemble) | `#2EE6D6` teal | "Tokens stream out until the end-of-sequence signal fires." | Streaming reply bubble; detokenize chain; reduced-motion respected. |
| 8 | Compare | (reuses predict purple) | "Claude vs ChatGPT: not bigger-is-smarter — convergence." | Tier-tagged claims (a)(b)(c), Constitutional AI vs RLHF cards, paired tokenizer counts, paired context-window bars. Provenance: claim-row `lastUpdated`. |
| 9 | About | none | Provenance section + how to read it. | Dataset source string, model name, illustrative-vs-measured discipline. |

Plus a **landing page** at the root that previews the seven-scene pipeline with an animated chip-strip, a scene-card grid, a methods/provenance section, and a Surface↔Deep toggle demo.

---

## 3. The 25 decisions worth remembering

Citations point at the artifact that proves the decision: commit (`abc1234`), file path, PR number, or spec §.

### Product & UX

| # | Decision | Rationale | Where it lives |
|---|---|---|---|
| 1 | **Two-tier progressive disclosure**, not two separate sites | One reader can become the other in 1 click; saves us from forking copy, components, navigation | `src/app/DepthContext.tsx`; `src/components/DeepToggle.tsx`; spec §1 |
| 2 | **Scroll-snap stations, not scroll-scrubbed animation** | Scrubbing fights interactivity; snapping lets each scene play its entrance once and then hand control to the user. Bonus: skips GSAP (~30 KB) | `useKeyboardNav`, `useHashSync`, `useScrollSpy`; spec §2 |
| 3 | **Curated example prompts with precomputed data, not free text** | Honest live model = ship a model in-browser ≈ 100 MB+ download. Precomputed = honest + tiny. The honesty boundary is "this site never shows fake numbers." | `src/data/prompts/sky.json`, `cat.json`; spec §7 |
| 4 | **Drop 3D embeddings → 2D meaning-space** | Figma drew 2D; building a 3D version would be a *departure from the approved design*. Side effect: react-three-fiber/Three.js drops out of the bundle entirely (~150 KB gzip saved) | `src/components/EmbeddingSpace.tsx`; spec v1.1 §0 ¶4 |
| 5 | **Claude-vs-ChatGPT framed as "convergence," not "which is bigger"** | The honest contemporary story is that the labs have converged on similar architectures with different posture (Constitutional AI vs RLHF). The "bigger = smarter" framing is stale and was never the right one | `src/scenes/CompareScene.tsx`; `src/data/compare.config.ts`; PR #5 |
| 6 | **Claims tier-tagged (a)(b)(c)** instead of single-bar facts | A frontier-comparison scene with un-tagged claims is the road to embarrassment when the vendors ship next month. Tiers: (a) on the vendor's docs, (b) reasonably inferable, (c) widely reported but not confirmed. Plus a `lastUpdated` stamp per row | `src/components/ClaimTier.tsx`; `src/data/compare.config.ts` |
| 7 | **Caveats are first-class UI**, not footnotes | CaveatNote is its own component with amber accent (`#FBBF24`). Used wherever a Deep panel could mislead | `src/components/CaveatNote.tsx`; design system spec §6 |
| 8 | **Running-example pill is currently scene-aware in the stage, static in the TopBar** | Figma drew the TopBar pill as static; the visual stage uses the per-scene example. Documented as a known gap to close before v2 | `src/components/TopBar.tsx`; spec v1.1 §0 ¶7 + §10 |
| 9 | **Tokenize Deep ships without a CaveatNote** (uses plain body text) | Every other caveat-bearing Deep panel uses the amber component; Tokenize doesn't. Flagged as a small consistency gap in spec §10. Tracked, not yet closed | `src/scenes/TokenizeScene.tsx`; spec v1.1 §0 ¶8 |
| 10 | **Landing page is a "quiet technical document," not a SaaS landing** | The site is an explainer; the landing should feel built by the same hand. No hype, no gradients, no testimonials, no "trusted by." Provenance is treated as a feature, not an apology | `docs/landing-page-design-direction.md`; `src/landing/*`; PR #11 |
| 11 | **The 7-color pipeline spectrum is the brand wordmark** | Visitor sees the spectrum in the hero chip strip, the scene cards, the section accent rules, and the footer dots — three times before they click "Start" | `src/landing/*`; `ACCENT_HEX` in `scenes.config.ts:115-123` |

### Engineering

| # | Decision | Rationale | Where it lives |
|---|---|---|---|
| 12 | **Vite + React 19 + TypeScript 5.7 strict** | Smallest competent frontend stack for a SPA explainer; SSR not needed (single page, no SEO content competition); React 19 for the form/use APIs not strictly required but free upgrade | `package.json`; `tsconfig.json` (strict + `noUncheckedIndexedAccess` family) |
| 13 | **Tailwind v4 via `@tailwindcss/vite`**, no PostCSS pipeline | v4 ships its own engine; one fewer config file; auto-generates utilities from `@theme {}` CSS-vars | `vite.config.ts`; `src/index.css` |
| 14 | **All inline styles migrated to Tailwind utilities** | Style consistency, lint coverage, less custom CSS. Two-wave migration: first using arbitrary-form (`bg-(--color-X)`), then switching to canonical theme classes (`bg-X`) where Tailwind v4 auto-generates them | `docs/tailwind-migration/cheat-sheet.md`; PRs #8 + #9 |
| 15 | **CSS-var passthrough for runtime values** | Tailwind can't express runtime-computed values (per-scene accents, dynamic widths). Pattern: `style={{ '--bar-w': pct + '%' } as CSSProperties} className="w-[var(--bar-w)]"`. 16 legitimate inline-style exceptions remain, all documented | `docs/tailwind-migration/cheat-sheet.md` "Remaining inline styles" |
| 16 | **Motion (formerly Framer Motion), not GSAP** | Motion is React-native, smaller, and handles layout animations and reduced-motion out of the box. We never needed timeline scrubbing | `package.json` `"motion"`; spec §6 |
| 17 | **d3-scale + d3-scale-chromatic only — no d3-selection, no d3-axis** | We hand-render SVG with React; we just need the math (linear scales) and the chromatic ramps (magma for the attention matrix) | `package.json`; `src/components/AttentionMatrix.tsx` |
| 18 | **Zod-validated dataset loading at runtime** | Datasets are JSON shipped in `src/data/prompts/`; runtime validation catches schema drift in dev and surfaces it loudly | `src/data/loader.ts` (Zod schemas); spec §7 |
| 19 | **No router — hash-based deep linking via `useHashSync`** | One page, nine anchors; a router buys nothing | `src/app/useHashSync.ts`; spec §6 |
| 20 | **Strict canonical SceneId union as the cross-cutting type** | `SceneId` is exported from `scenes.config.ts` and reused everywhere (analytics props, navigation, hash sync). Renaming a scene is a single-file edit caught by TS | `src/scenes/scenes.config.ts:1-10` |

### Process & infra

| # | Decision | Rationale | Where it lives |
|---|---|---|---|
| 21 | **One PR per milestone** | Each milestone = one PR + (often) one docs deliverable. Forced discipline: no half-finished branches, every shipped change traceable to a single review | git history; per-PR CHANGELOG entries |
| 22 | **Two-layer a11y testing**: vitest-axe per scene + Playwright/axe full nav | jsdom can't compute contrast; the E2E layer catches that. Per-scene unit tests catch landmark uniqueness and label issues fast | `tests/a11y/`, `e2e/a11y.spec.ts`; audit doc `docs/a11y/2026-06-01-audit.md` |
| 23 | **Color-contrast deferred to a brand follow-up**, not fixed in-flight | 9 violations are all "accent text < 4.5:1 vs `#16161f`." Lightening the 7 brand accents OR restricting accent text to ≥14pt bold are both real options — neither is an in-flight technical fix | `docs/a11y/2026-06-01-audit.md` "Deferred" section |
| 24 | **Umami Cloud over self-hosted analytics**, cookieless | One vendor, no consent banner needed (no cookies, no PII), free tier covers expected volume. Self-host promotion path documented for later | `src/analytics/`; PR #13 |
| 25 | **Cloudflare Pages free tier** | Static SPA + Vite preset + free unlimited bandwidth + GitHub auto-deploy + preview URLs per PR. Custom domain optional later. No `wrangler.toml` needed | PR #13 |

---

## 4. Analytics design

### Philosophy
**Instrument the smallest set that answers real questions; refuse to instrument everything.** Ceiling self-imposed at ≤15 named events. Currently at 10. Pageviews come for free from Umami.

### Event taxonomy (canonical — `src/analytics/events.ts`)

| Event | Trigger | Props | Why this event |
|---|---|---|---|
| (pageview) | auto | URL, referrer | Reach |
| `scene-reached` | first visit to a scene per session | `{ scene: SceneId, depth: 'surface' \| 'deep' }` | The single most important funnel: does Surface reach `output`? |
| `cta-start-explore` | landing-page primary CTA | — | Landing → app conversion |
| `cta-github` | landing or footer GitHub link | — | "I trust this enough to look at code" signal |
| `cta-scene-card` | landing-page scene-card click | `{ scene: SceneId }` | Which scenes do visitors enter via card vs CTA? |
| `cta-landing-preview-toggle` | landing Surface↔Deep demo | `{ to: 'surface' \| 'deep' }` | Does the landing demo of the disclosure pattern get used? |
| `cta-depth-toggle` | in-app Surface↔Deep | `{ to, scene? }` | The actual disclosure-use signal |
| `cta-scene-nav` | next/prev pill buttons | `{ direction: 'next' \| 'prev' }` | Linear vs backtracking behavior |
| `cta-rail-jump` | progress-rail click | `{ scene: SceneId }` | "I skipped ahead" signal — interesting if rail-jumpers correlate with depth-togglers |
| `cta-chip` | example-prompt chip selection | — | Are visitors trying the second prompt (`cat`)? |
| `cta-head-select` | Attention head selector | `{ head: 0 \| 1 \| 2 }` | Deep-reader engagement marker |

### Dedupe model
`scene-reached` deduplicates **per scene, per session**. Session = page-load; refresh re-emits. Implemented via `useRef<Set<SceneId>>` in `src/analytics/useTrackSceneReach.ts`. Re-emits when the scene-id genuinely changes, never when depth changes (depth changes already emit `cta-depth-toggle`).

### Instrumentation mechanism
- **Declarative** (`data-umami-event="…"`) for buttons. No JS required; Umami's vendor script reads the attribute on click.
- **Programmatic** (`track('scene-reached', …)`) for the once-per-session scene reach hook.
- Wrapper (`src/analytics/umami.ts`) no-ops safely when `window.umami` is undefined (ad-blocker, dev without env var) — never throws.

### What Umami CAN tell us
- Per-scene reach rates (the funnel: landing → prompt → tokenize → … → output)
- Depth-toggle rate per scene
- Rail-jump rate (linear vs skipping behavior)
- Landing CTA conversion (start-explore vs github vs scene-card)
- Geographic + device split
- Real-time visits

### What Umami CANNOT tell us
- Time spent reading (no scroll-depth/dwell instrumentation)
- Which deep panel content was actually read
- Whether the visitor understood anything
- Returning-visitor identity (cookieless = no cross-session linkage)

The instrumentation is honest about its own ceiling — the same epistemic discipline the explainer applies to model internals.

---

## 5. Success metrics

### Tier 1 — already measurable, gating ship quality
These are part of CI / repo state and are gates, not aspirational targets.

| Metric | Target | Current | Where checked |
|---|---|---|---|
| TypeScript strict typecheck | clean | clean | `npm run typecheck` (CI on every PR) |
| ESLint | 0 errors, 0 warnings | clean (PR #6 explicitly cleaned hygiene) | `npm run lint` |
| Unit tests | 100% pass | 194/194 pass per a11y audit | `npm test` |
| A11y unit (vitest-axe) | 100% pass | 10/10 pass | `npm run a11y` |
| A11y E2E (Playwright + axe) | 100% pass on non-deferred rules | 9/9 pass | `npm run a11y:e2e` |
| E2E happy paths | 100% pass | 8 specs (a11y, compare, decoding, happy, honesty, landing, mvp, scroll) | `npm run e2e` |
| Build size (gzip) | <250 KB | 146 KB (per a11y audit) | `npm run build` |
| Build size (raw) | <600 KB | 467 KB | same |
| Lighthouse Performance (mobile) | ≥90 | (set after CF Pages first run) | manual audit |
| No `console.log` in `src/` | 0 | 0 | repo grep + hooks |

### Tier 2 — product metrics watched in Umami

Read directionally, not as KPIs to optimize.

| Metric | Definition | Healthy band | Why it matters |
|---|---|---|---|
| **Surface-completion rate** | % of sessions where `scene-reached` for `output` fires AND `cta-depth-toggle` does NOT fire | ≥30%, target 40% | The Surface-path hypothesis (success criterion #2) |
| **Pipeline reach funnel** | reach % per scene in canonical order | each step ≥75% of previous | Detects where readers drop off |
| **Depth-toggle rate per scene** | sessions firing `cta-depth-toggle` for scene X / sessions reaching X | Predict/Decode should lead | Identifies which deep panels actually pull readers in |
| **Rail-jump rate** | sessions firing `cta-rail-jump` / total sessions | 15–30% | Healthy "I'm exploring, not reading linearly" signal; >50% suggests confusing linear flow |
| **Landing → app conversion** | sessions firing `cta-start-explore` OR `cta-scene-card` / sessions landing on `/` | ≥35% | Landing page is doing its job |
| **GitHub click rate** | `cta-github` fires / total sessions | 3–8% | "Craft signal received" proxy |
| **Chip-toggle rate** | sessions firing `cta-chip` / sessions reaching `tokenize` | 10–20% | Curated multi-prompt feature isn't wasted |
| **Head-select rate** | sessions firing `cta-head-select` / sessions reaching `attention` Deep | 30–60% of Deep-attention sessions | Deep reader engagement on the heaviest deep panel |

### Tier 3 — qualitative signals
- **GitHub stars / forks** — portfolio-craft proxy
- **Inbound questions or PRs** — interest signal
- **Comments from a technical reader** of the form "you didn't lie" — the primary success criterion realized

---

## 6. Risks & known gaps (carried forward)

| Risk / gap | Severity | Status | Plan |
|---|---|---|---|
| Color-contrast violations (9, all accent text < 4.5:1 vs `#16161f`) | Serious (a11y) | Deferred — brand-level fix | Plan TBD: restrict accent text to ≥14pt bold, OR lighten the 7 accent tokens, OR both. The a11y test infra is in place to catch regressions when the brand fix lands. |
| Tokenize Deep panel lacks the canonical CaveatNote component | Minor (consistency) | Open | Add CaveatNote on the "different models tokenize differently" line; ≤30 min task |
| TopBar running-example pill is static, not scene-aware | Minor (consistency) | Open | Make pill scene-aware OR mark "primary example" — design call needed |
| Manual VoiceOver / NVDA walkthrough | Moderate (a11y completeness) | Deferred — needs operator | Checklist drafted in `docs/a11y/2026-06-01-audit.md`; results append back to the audit doc when run |
| Umami CDN supply-chain risk (no SRI — would break on vendor updates) | Low | Accepted | Self-host Umami on CF Workers + D1 is Future Enhancement #1 in the analytics plan |
| Compare scene claim drift over time | Medium | Accepted | Each claim row carries `lastUpdated`; scene visibly tier-tags so readers know stability of each claim |
| Spec drift — v1.1 spec lists Compare as "Phase 2 architected" but it shipped in PR #5 | Doc-only | Open | Spec v1.2 should fold in the as-shipped Compare scene |
| `vite.config.ts` exposes sourcemaps on the deployed site | Trivial | Accepted | Educational site; sourcemaps help learners. Re-evaluate if posture tightens |
| Free-tier Umami event ceiling on viral share | Low | Mitigated by dedupe | Once-per-session `scene-reached` dedupe; promote to self-host if hit |
| Milestone-label cardinality is not 1:1 with PR numbers (one milestone occasionally bundled into two PRs) | Doc-only | Living | CHANGELOG cites PR numbers as canonical |

---

## 7. Future work — explicitly out of scope, prioritized

1. **Brand-level contrast fix** (closes the 9 deferred a11y violations).
2. **Spec v1.2** folding in Compare-as-shipped + Tokenize CaveatNote consistency + TopBar pill resolution.
3. **Self-host Umami on CF Workers + D1** if traffic or supply-chain posture demands it.
4. **Open Graph + Twitter Card meta tags** in `index.html` for social-share previews (no code, just `<meta>` tags).
5. **Custom domain** (~$12/yr at Cloudflare Registrar). No code change.
6. **Saved Umami funnel** (Prompt → Tokenize → … → Output) once enough sessions have accumulated.
7. **Additional prompt datasets** beyond `sky` and `cat` — but each one is a small ML-eng task (run GPT-2 small offline, extract token IDs, attention weights, logits, save JSON, validate against the Zod schema).
8. **VoiceOver + NVDA manual walkthrough** results captured into `docs/a11y/2026-06-01-audit.md`.
9. **Mobile polish pass** — current target is desktop 1440×1024; mobile works but isn't loved.
10. **Light mode** — explicitly NOT planned. Dark is the design.

---

## 8. Shipped releases (canonical via PR number)

See in-repo `CHANGELOG.md` for the full version-by-version log. Brief here:

| PR | Date (merged) | Theme |
|---|---|---|
| #1 | 2026-05-31 | Foundation + Reference Scene — tokens, primitives, ProgressRail, TopBar, DeepToggle, CaveatNote, Chip, DataBar, PredictScene end-to-end, AboutScene, hash sync, keyboard nav |
| #2 | 2026-05-31 | MVP scenes — PromptScene, TokenizeScene, DecodeScene, AssembleScene, ReplyBubble, DistributionPair, cross-scene MVP flow E2E |
| #3 | 2026-05-31 | Figma fidelity — desktop-responsive layout aligned to the Figma design system |
| #4 | 2026-05-31 | Honesty-critical scenes — EmbedScene (2D meaning-space) + AttentionScene (arcs, matrix, head selector); cat.json dataset |
| #5 | 2026-06-01 | Compare section — CompareScene with tier-tagged claims, ContextWindowBar, TokenizerCount, PhilosophyCard |
| #6 | 2026-06-01 | ESLint hygiene — globals package, `.vite` ignore, drop `disable-no-undef` |
| #7 | 2026-06-01 | A11y audit — vitest-axe + @axe-core/playwright; 10/10 unit + 9/9 E2E pass; unique landmark labels; color-contrast deferred |
| #8 | 2026-06-01 | Tailwind migration — five waves; all inline styles → utilities; CSS-var passthrough for dynamic values |
| #9 | 2026-06-01 | Canonical Tailwind classes — arbitrary-form → theme-class form where Tailwind v4 auto-generates utilities |
| #10 | 2026-06-01 | Bug fixes + landing design — decode-loop wiring, scroll-spy hook, nav-sync fixes, landing-page design direction + brand voice docs |
| #11 | 2026-06-01 | Landing page — six landing sections per design direction; build-time commit hash plumbing |
| #12 | 2026-06-02 | (hotfix) URL-hash deep-link fix on initial mount |
| #13 | 2026-06-02 | Analytics + Deploy — Umami wrapper, scene-reach hook, full CTA taxonomy, Cloudflare Pages spec |

---

## 9. Links

- **Live site:** `https://llm-visualization.pages.dev`
- **GitHub repo:** `https://github.com/thanhthuynh/llm-visualization`
- **Figma source of truth:** the project's private Figma file — "Inside an LLM — Design System + Scenes" (link kept in maintainer notes)
- **Umami dashboard:** `https://cloud.umami.is/share/...` *(set after deploy if public share is enabled)*
- **Spec v1.1:** external engineering + visual spec (source of truth)
- **Spec v1.0 (historical):** external engineering + visual spec (pre-Figma brief)
- **A11y audit:** `docs/a11y/2026-06-01-audit.md` (repo)
- **Landing brand voice:** `docs/landing-page-brand-voice.md` (repo)
- **Landing design direction:** `docs/landing-page-design-direction.md` (repo)
- **Tailwind migration cheat sheet:** `docs/tailwind-migration/cheat-sheet.md` (repo)

---

## 10. Open questions for v2

1. Is the static TopBar pill confusing enough to readers that it warrants the scene-aware refactor, or does the visual stage carrying the right example absorb the cognitive load?
2. Does Surface-completion rate (Tier-2 metric #1) actually reach 30%+ in the wild, or do most visitors open a deep toggle out of curiosity even when the Surface text is sufficient?
3. Is the Compare scene's tier-tagging legible — do readers notice (a)(b)(c) and adjust trust accordingly — or does it read as decoration?
4. Does the landing chip-strip's 7.4s cycle hold attention through one full pass, or does the visitor scroll past during Frame 2 (embed bars)?
5. Should the next prompt-dataset be a *failure case* (e.g., a prompt where the top-1 prediction is wrong) to model intellectual honesty on the visualization itself, not just the framing?

---

*Document owner: Thanh. Last updated: 2026-06-02.*
