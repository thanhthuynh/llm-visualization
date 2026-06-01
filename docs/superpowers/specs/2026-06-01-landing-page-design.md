# Landing Page — Design Spec

**Date:** 2026-06-01
**Owner:** Thanh
**Status:** PENDING REVIEW
**Source brief:** `/ecc:plan` — "Create a landing page mockup for our project within our Figma and suggest any improvements/additions/modifications to make the website more presentable and user-friendly while still having a beautiful UI."

This spec synthesizes four subagent deliverables:

| Source | Role | Path |
|---|---|---|
| `code-explorer` | Inventory of reusable components, tokens, layout primitives, gaps | In-context (synthesized below) |
| `a11y-architect` | WCAG 2.2 AA checklist with contrast pre-computation | In-context (synthesized below) |
| `frontend-design-direction` | Visual language, hero mechanic, motion budget, anti-patterns | `docs/landing-page-design-direction.md` |
| `brand-voice` | Voice profile, signature moves, copy targets, banned moves | `docs/landing-page-brand-voice.md` |

The two on-disk docs are the long-form references. This spec is the **single source of truth** Figma generation and the implementer will work from.

---

## 1. Product Intent

**One line:** A quiet, technical landing page — closer to a scientific notebook than a SaaS marketing site — that lets the seven pipeline accents do the talking and treats the GPT-2-small provenance as a feature, not an apology.

**Audience:**
- *Surface reader:* curious technically-literate person who wants a one-page gist of how an LLM works.
- *Deep reader:* engineer or student who wants to see real numbers from a real model, with provenance.

**Success criterion (qualitative):** A visitor leaves the landing page with (a) a correct one-sentence model of what the explainer shows, (b) understanding that the numbers are GPT-2 small not Claude/ChatGPT, and (c) one clear next action — "Start with the prompt."

---

## 2. Information Architecture (LOCKED — already approved)

```
1. Hero
2. What you'll see — 7 scene cards
3. Provenance honesty — "Where the numbers come from"
4. Two paths — Surface ⟷ Deep
5. Built with — tech stack
6. Footer — CTA + GitHub link
```

DOM order matches reading order. No accordions, no above-the-fold mystery.

---

## 3. Design Tokens (REUSE FROM EXISTING CODE)

All tokens already live in `src/index.css` (`@theme` block) and `src/scenes/scenes.config.ts` (`ACCENT_HEX`). The landing page imports these — it does NOT define new ones.

**Colors:**
- Background: `#0a0a12` (bg-base)
- Surfaces: `#16161f` (card), `#0e0e18` (deep)
- Border: `#2a2a38`
- Text: `#f5f5f7` (primary) / `#9a9ab0` (muted)
- 7 pipeline accents: prompt `#FFC857` · tokenize `#6BF178` · embed `#4CC9F0` · attention `#F72585` · predict `#9D4EDD` · decode `#FF7B00` · output `#2EE6D6`
- Caveat: `#FBBF24`

**Typography:**
- Display: Space Grotesk (H1 4.5rem desktop / 2.75rem mobile, H2 2.25rem)
- Body: Inter (lede 1.25rem, body 1.0625rem / 1.6875rem)
- Mono: Space Mono (eyebrows, chips, version stamps)

**Rhythm:**
- Vertical sections: 8rem desktop / 4.5rem mobile cadence
- Max width: 76rem (1216px); provenance narrows to 52rem
- Card grid: 4-up ≥1024px, 2-up tablet, 1-up mobile

---

## 4. Accessibility Constraints (NON-NEGOTIABLE)

Distilled from the a11y-architect contrast computation against `#0a0a12`.

### 4.1 Color rules

| Accent | Hex | Contrast vs bg | Verdict | Landing-page use |
|---|---|---|---|---|
| prompt | `#FFC857` | ~13.8:1 | PASS small + large | Any text use OK |
| tokenize | `#6BF178` | ~9.5:1 | PASS small + large | Any text use OK |
| embed | `#4CC9F0` | ~9.1:1 | PASS small + large | Any text use OK |
| attention | `#F72585` | ~3.8:1 | **FAIL small text** / PASS large | Large display only; NOT for body or buttons |
| predict | `#9D4EDD` | ~2.5:1 | **FAIL both** | Decorative shape fills only; **never as text color**, never as sole indicator |
| decode | `#FF7B00` | ~5.7:1 | PASS small + large | Any text use OK |
| output | `#2EE6D6` | ~8.9:1 | PASS small + large | Any text use OK |

**Direct consequences for the design:**
- Primary CTA fill = `#2EE6D6` (output) with dark text — confirmed safe and on-brand (pipeline destination color).
- The word in the H1 we highlight ("happens") uses `#4CC9F0` (embed) — passes 4.5:1 cleanly.
- Predict-colored scene card (#5 of 7) shows accent only as the 3px top stripe, scene number in mono (decorative), and 24% alpha hairline — **never** as a text color.
- Attention-colored elements (#4 of 7, plus the Surface/Deep toggle thumb) use the color only for thumb fill / divider hairline / large display — **never** for body labels.
- Muted text `#9a9ab0` is ~4.2:1 against `#0a0a12` — borderline. Restrict to labels ≥18px regular or ≥14px bold. For provenance body copy, use `#f5f5f7` at 92% effective alpha, not `#9a9ab0`.

### 4.2 Structural rules

- One `<h1>`: "Inside an LLM"; six `<h2>` (one per section).
- Landmarks: `<header>`, `<main id="main-content">`, `<section aria-labelledby="…">` per section, `<footer>`. Skip link first focusable element.
- Tab order: skip link → header logo (if linked) → hero CTA → secondary CTA → scene cards in DOM order → provenance section → footer links.
- Scene cards each individually focusable; 2px focus ring at 1.5px offset using the card's accent (predict card swapped to white for 3:1 ring requirement).
- All pipeline-color indicators carry BOTH color and visible text label.
- Provenance section reachable within one scroll-page of the hero, not buried after the 7 cards.

### 4.3 Motion rules

- All animations gated on `prefers-reduced-motion: reduce` (existing `useReducedMotionPref` hook is source of truth).
- Hero chip-strip loop pauses under reduced motion → static Frame 6 with label "One pass through the pipeline."
- No parallax. Ever.
- No autoplay video, no Lottie brain, no ambient particles.
- Section reveals: opacity + 8px translateY, 360ms once; reduced-motion → instant.

---

## 5. Section-by-Section Spec

### 5.1 Hero

**Goal:** establish what the site is in one viewport.

**Layout (desktop):** two-column 1fr 1fr, 4rem gap. Stacks on tablet.

**Left column:**
- Eyebrow: `INTERACTIVE EXPLAINER · v0.x` (mono, muted, uppercase, tracked).
- H1: **`Inside an LLM`** — Space Grotesk 4.5rem, tracking −0.02em. (≤6 words.)
- Lede: `Watch a prompt become an answer, one token at a time. Seven stages, two reading paths — gist on the surface, receipts underneath.` Inter 1.25rem.
- Provenance microline under lede, mono 0.875rem, contrast-safe muted: `Numbers from GPT-2 small, run offline. Illustrative, not Claude or ChatGPT internals.` — satisfies the a11y "reachable provenance" risk AND the brand-voice requirement that the GPT-2/illustrative phrasing appears verbatim.
- CTA row: primary `[ Start with the prompt → ]` (fill `#2EE6D6` output, dark text) + secondary `[ View on GitHub ]` (ghost).

**Right column — animated chip-strip preview:**
- Single horizontal lane, ~360px tall, showing one pass of the pipeline for `"The sky is"`.
- 7-frame loop, 7.4s total. Each frame uses one accent (yellow → green → cyan → magenta → purple → orange → teal).
- Frames:
  - **F0 (0.0–0.8s)** `"The sky is"` yellow prompt chip.
  - **F1 (0.8–1.8s)** splits into `The` / ` sky` / ` is`, green tokenize.
  - **F2 (1.8–3.0s)** each token sprouts 5 cyan embed bars; caption "→ 768d vector".
  - **F3 (3.0–4.2s)** magenta attention arcs from ` is` back to ` sky` and `The`.
  - **F4 (4.2–5.4s)** purple predict distribution: `blue` 47% · `clear` 18% · `falling` 9% · `the` 6% · `a` 4%.
  - **F5 (5.4–6.4s)** orange decode selects `blue`; chip slides up.
  - **F6 (6.4–7.4s)** `"The sky is blue"` teal output chip, 600ms hold, loop.
- Reduced motion: static F6.

### 5.2 What You'll See — 7 scene cards

**Heading:** `What you'll see` (H2). Eyebrow: `SEVEN SCENES, ONE PIPELINE`.

**Layout:** 4-up grid desktop (≥1024px) / 2-up tablet / 1-up mobile. 7 cards + 1 monogram "full pipeline" cap card to balance the 4-col grid.

**Card anatomy (160×200px min):**
- 3px top accent stripe.
- Eyebrow: scene number `01`–`07` in mono, accent-colored.
- Label: scene title (Space Grotesk 500, 1.25rem). Primary text color always — never accent for predict/attention.
- Teaser (brand-voice approved, ≤12 words each):
  - **01 Prompt** — *Everything starts with a string of characters. Nothing more.*
  - **02 Tokenize** — *The text is sliced into the model's chosen pieces.*
  - **03 Embed** — *Each token becomes a coordinate the network can do math on.*
  - **04 Attention** — *Tokens look at the tokens that matter, weighted by relevance.*
  - **05 Predict** — *A probability for every possible next token, ranked.*
  - **06 Decode** — *Sample one token, append it, run the loop again.*
  - **07 Output** — *Tokens stream out until the end-of-sequence signal fires.*
- Hover/focus: 1px hairline brightens to accent at 64% alpha; top stripe lifts to 4px; card translates −2px Y over 160ms.

**No icons.** The accent stripe is the icon.

### 5.3 Provenance — `Where the numbers come from`

**Layout:** single column, 52rem max width, centered, 8rem top + bottom whitespace.

**Eyebrow:** `METHODS · PROVENANCE`.
**H2:** `Where the numbers come from`.
**Left rule:** 2px `#FBBF24` (caveat-amber) running full height of body.

**Body (brand-voice-locked):**

> Every number, embedding, attention weight, and probability on this site comes from GPT-2 small, run offline — illustrative, not live frontier internals. Claude and ChatGPT don't expose token-level state for arbitrary input, so this site doesn't pretend to visualize theirs.

(`GPT-2 small` + `illustrative` + explicit naming of frontier providers are non-negotiable per brand-voice.)

**Definition list** (mono left, body right):
- `model` — `gpt2-small`
- `source` — `huggingface.co/openai-community/gpt2`
- `refresh` — `commit a1b2c3…` *(implementer fills with real commit ID)*

**No CTA here.** The reader leaves on the honest beat.

### 5.4 Two paths — Surface ⟷ Deep

**Heading:** `Two ways to read it.` (H2). Eyebrow: `PROGRESSIVE DISCLOSURE`.

**Mechanic:** single live preview panel with a segmented toggle above it — `Surface ◀▶ Deep`. The Predict scene's published Surface and Deep copy cross-fade over 240ms; stage on the left stays fixed.

- Toggle active thumb: `#F72585` attention (large display only — contrast OK).
- Toggle inactive lane: `#16161f` surface-card.
- Footnote (mono, muted): `Same scene. Different depth. You choose per-scene in the explainer.`

### 5.5 Built with

**Heading:** `Built with` (H2, optional — can drop to eyebrow only).
**Body:** one mono line, contrast-safe muted:

> `vite · react 19 · typescript 5.7 · tailwind v4 · motion · d3-scale · zod`

Neutral. No icons. No logos.

### 5.6 Footer

- 4rem tall, neutral surface, top hairline `--color-border`.
- **Left:** horizontal seven-dot strip (one dot per accent, 8px circles, 12px gaps) — pipeline as wordmark. Each dot has aria-label naming its stage.
- **Center:** `Launch the explainer →` (Space Grotesk 1.25rem, primary text). Links to `#prompt`. Hover recolor to `#2EE6D6`.
- **Right:** `GitHub` text link, `MIT` text link, Inter 0.875rem, contrast-safe muted, underline-on-hover only.
- Final mono microline, 0.75rem: `built with vite · react 19 · tailwind v4 · motion · d3-scale · zod`.

---

## 6. Motion Budget (TOTAL)

| Element | Trigger | Duration | Reduced-motion |
|---|---|---|---|
| Hero chip-strip loop | ambient | 7.4s cycle, 320ms eased frame transitions | static F6 |
| CTA hover | hover | 160ms ease-out background fade | no fade |
| Scene-card hover | hover | 160ms translateY + stripe grow | no movement |
| Surface↔Deep toggle | click | 240ms cross-fade | instant swap |
| Section reveal on scroll | scroll into view | 360ms opacity + 8px Y, once | instant |
| Footer pipeline dots | none | static | static |

The hero is the only ambient motion.

---

## 7. Component Reuse Map

| Need | Existing reuse | New work |
|---|---|---|
| Hero H1/lede/CTAs | — | `Hero` composition |
| Hero chip-strip preview | `Chip` (pill) | `HeroPipelinePreview` motion component |
| Section eyebrows | `EyebrowLabel` ✅ | — |
| Scene-card top stripe | `AccentRule` ✅ | `SceneCard` wrapper |
| Provenance amber rule + body | `CaveatNote` aesthetic | `ProvenanceBlock` |
| Surface ⟷ Deep panel | `DeepToggle` + existing PredictScene prose | `SurfaceDeepPreview` wrapper |
| Tech-stack mono row | mono utilities | trivial |
| Footer | — | `LandingFooter` |
| Pipeline-as-wordmark dots | `ProgressRail` dot styling | small composition |

---

## 8. What We Will NOT Do

- No gradient mesh hero, decorative blobs, glass-morphism, particles.
- No neutral-grayscale "minimal" pass that abandons the 7 accents.
- No oversized one-word hero.
- No AI-buzzword copy: never `unleash`, `supercharge`, `demystify`, `harness`, `AI-powered`, `next-gen`.
- No anthropomorphism: never `thinks`, `knows`, `understands`, `decides creatively`.
- No bait questions as headers.
- No card-in-card nesting.
- No autoplaying video, no Lottie brain, no neural-net line art.
- No testimonials, logo wall, or "trusted by" strip.
- No emoji in headings or CTAs.
- No claim that this visualizes Claude or ChatGPT internals.
- No light-mode variant in v1.
- **No `#9D4EDD` as text color anywhere.** **No `#F72585` for small text or button labels.**

---

## 9. ASCII Wireframe (desktop ~1440)

```
┌────────────────────────────────────────────────────────────────────────┐
│  INTERACTIVE EXPLAINER · v0.x                                          │
│                                                                        │
│  Inside an LLM                             ┌─────────────────────────┐ │
│                                            │  "The sky is"           │ │
│  Watch a prompt become an answer,          │     │                   │ │
│  one token at a time. Seven stages,        │   [The][ sky][ is]      │ │
│  two reading paths — gist on the           │     │  │  │             │ │
│  surface, receipts underneath.             │   ▮▮▮ ▮▮▮ ▮▮▮  →768d    │ │
│                                            │     ╲  │  ╱             │ │
│  Numbers from GPT-2 small, run offline.    │      predict ▰▱▱▱▱      │ │
│  Illustrative, not Claude/ChatGPT.         │      decode → blue      │ │
│                                            │   "The sky is blue"     │ │
│  [ Start with the prompt → ]  [ GitHub ]   └─────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│  SEVEN SCENES, ONE PIPELINE                                            │
│  What you'll see                                                       │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐                                               │
│  │▔01│ │▔02│ │▔03│ │▔04│   (yellow, green, cyan, magenta)              │
│  └───┘ └───┘ └───┘ └───┘                                               │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐                                               │
│  │▔05│ │▔06│ │▔07│ │ ● │   (purple, orange, teal, monogram)            │
│  └───┘ └───┘ └───┘ └───┘                                               │
├────────────────────────────────────────────────────────────────────────┤
│  METHODS · PROVENANCE                                                  │
│  ▎ Where the numbers come from                                         │
│  ▎ Every number, embedding, attention weight, and probability on this  │
│  ▎ site comes from GPT-2 small, run offline — illustrative, not live   │
│  ▎ frontier internals. Claude and ChatGPT don't expose token-level     │
│  ▎ state for arbitrary input, so this site doesn't pretend to.         │
│  ▎ model    gpt2-small                                                 │
│  ▎ source   huggingface.co/openai-community/gpt2                       │
│  ▎ refresh  commit a1b2c3…                                             │
├────────────────────────────────────────────────────────────────────────┤
│  PROGRESSIVE DISCLOSURE                                                │
│  Two ways to read it.                                                  │
│           ┌─ Surface ◀──▶ Deep ─┐                                      │
│  ┌─────────────────┐  ┌──────────────────────────────┐                 │
│  │  [predict       │  │  The model rates every word… │                 │
│  │   bar chart]    │  │  logits · temperature · top-k│                 │
│  └─────────────────┘  └──────────────────────────────┘                 │
├────────────────────────────────────────────────────────────────────────┤
│  BUILT WITH                                                            │
│  vite · react 19 · typescript 5.7 · tailwind v4 · motion · d3 · zod    │
├────────────────────────────────────────────────────────────────────────┤
│  ● ● ● ● ● ● ●     Launch the explainer →     GitHub  MIT              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Resolved Decisions

1. **Domain of the page.** ✅ **Landing page lives at `/`. The existing scroll-snap explainer app moves to `/explorer`.** The hero CTA navigates to `/explorer#prompt`. No `react-router-dom` dependency — pathname-based switch in `main.tsx` selects which root component renders.
2. **Provenance commit hash.** ✅ **Wired at build time.** `vite.config.ts` exposes `__BUILD_COMMIT__` (short SHA from `git rev-parse HEAD`) via `define`; `ProvenanceBlock.tsx` reads it. This means the visible `refresh — commit XXXXXXX` row always reflects the commit the visitor's bundle was built from.
3. **GitHub link target.** ✅ Confirmed: `https://github.com/thanhthuynh/llm-visualization`.

---

## 11. Acceptance Criteria

- [ ] All copy strings match the brand-voice profile verbatim where quoted.
- [ ] All 7 accents used per §4.1 contrast rules (no #9D4EDD as text; no #F72585 small text).
- [ ] H1 is "Inside an LLM"; provenance disclosure within one scroll of the hero.
- [ ] One `<h1>`, six `<h2>`, landmarks per §4.2.
- [ ] Skip link first focusable; tab order matches §4.2.
- [ ] All motion gated on `prefers-reduced-motion` per §4.3 + §6.
- [ ] No banned patterns from §8 present.
- [ ] Mockup is dark-mode only; no light variant.

---

## 12. Next Step

If approved: produce a Figma mockup via the Figma MCP using `/figma-generate-design`. The Figma file consumes this spec as the brief and produces multi-frame artwork (Hero, Cards, Provenance, Two paths, Footer) at desktop + mobile breakpoints.
