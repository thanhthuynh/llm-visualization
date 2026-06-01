# Landing Page — Design Direction

> Scope: a new marketing landing page for the "Inside an LLM" interactive explainer. Sits in front of the existing scroll-snap app; consumes the same design tokens. This doc is the brief Figma (and the implementer) will work from.

**Direction in one line:** A quiet, technical document — closer to a scientific notebook or a research-tool announcement than a SaaS landing page — that lets the seven pipeline accents do the talking and treats the GPT-2-small provenance as a feature, not an apology.

**Tone:** utilitarian, calm, editorial. The site explains a real thing; the landing page should feel built by the same hand.

**Memorable detail:** the seven-color pipeline spectrum (`prompt → output`) is the spine of the page. It appears as a chip strip in the hero, as section accent rules, and as the card grid. The visitor sees the spectrum three times before they click "Start the tour" — by then it reads as the product itself.

---

## A. Visual language

- **Typeface roles** (already in tokens):
  - `--font-display` (Space Grotesk) — H1, H2, eyebrow.
  - `--font-body` (Inter) — paragraphs, card teasers, CTAs.
  - `--font-mono` (Space Mono) — token fragments, chip text, the literal `"The sky is"` string, version stamps.
- **Type scale** (REM, paired with line-height):
  - H1: 4.5rem / 4.75rem, Space Grotesk 500, tracking −0.02em. Mobile: 2.75rem / 3rem.
  - H2 (section heads): 2.25rem / 2.5rem, Space Grotesk 500.
  - Eyebrow: 0.75rem / 1rem mono, uppercase, letter-spacing 0.14em, `text-text-muted`.
  - Lede paragraph: 1.25rem / 1.875rem Inter 400, `text-text-primary` at 92% opacity.
  - Body: 1.0625rem / 1.6875rem (the existing 17/27 from `index.css`).
- **Spacing rhythm:** vertical sections on an 8rem desktop / 4.5rem mobile cadence. Inside-section gaps step on 0.75 / 1.5 / 3 rem. No section is shorter than 100vh's "feel" but none locks to scroll-snap — landing is fluid; the app is snapped.
- **Max content width:** 76rem (1216px). The hero centers within it; sections 2–6 use the existing 12-col implicit rhythm with a 1.5rem gutter at the edges. The provenance section narrows to 52rem to slow the reader down.
- **Surface:** `--color-bg-base` (#0a0a12) edge-to-edge. Cards on `--color-surface-card` (#16161f) with a 1px `--color-border` hairline. No glow, no glass.

## B. Color usage

The seven ACCENT_HEX values are sacred — they map 1:1 to scenes and must not be retinted.

- **Hero** — background base. The chip strip cycles through all seven accents (see §C). Headline is `--color-text-primary`; the word **"happens"** (in "see what happens inside an LLM") sets in `--color-accent-embed` (#4CC9F0) — the calmest of the seven, doesn't compete with the strip.
- **Primary CTA — "Start the tour"** — solid fill `--color-accent-output` (#2EE6D6, teal). Reasoning: it's the destination color of the pipeline, it has the highest contrast against the near-black bg, and it's not already burned in as a single scene's accent in the user's eye until they reach the end.
- **Secondary link — "View on GitHub"** — ghost button, `--color-text-primary` on transparent, 1px `--color-border`, no accent.
- **Section 2 (scene cards)** — each card carries its own accent as a 3px top stripe (`--radius-accent-rule`) and a 1px tinted hairline (accent at 24% alpha). Card body stays neutral.
- **Section 3 (provenance)** — `--color-accent-caveat` (#FBBF24) for a single 2px left rule and a single inline term. The rest is neutral. Caveat amber is the only accent allowed here — the section earns trust by not flexing.
- **Section 4 (Surface ⟷ Deep)** — uses two neutrals (`--color-surface-card` vs `--color-surface-deep`) with `--color-accent-attention` (#F72585) as the toggle/divider hairline.
- **Section 5 (tech stack)** — fully neutral, mono type. No accents.
- **Footer** — neutral, with a final repeat of the seven-dot pipeline.

## C. Hero composition

Two-column ratio at desktop (1fr 1fr, with 4rem gap); stacks on tablet.

- Left: eyebrow `INTERACTIVE EXPLAINER · v0.x`, H1 "**See what *happens* inside an LLM.**", lede ("Seven scenes. Real numbers from a small open model. Two ways to read it."), CTA row.
- Right: the **animated chip-strip preview**.

**Chip-strip mechanic (concrete):** A single horizontal lane, ~360px tall, showing one pass of the pipeline for the seed prompt `"The sky is"`.

1. Frame 0 (0.0s–0.8s): the literal string appears as a yellow `prompt`-accented chip — Space Mono, pill radius.
2. Frame 1 (0.8s–1.8s): the string splits into 3 token chips — `The` / ` sky` / ` is` — each pill recolors to `tokenize` green. A faint `BPE` mono caption sits below.
3. Frame 2 (1.8s–3.0s): each token chip sprouts a short vertical bar (cyan `embed`) — five bars per chip, suggesting a vector. Caption: `→ 768d vector`.
4. Frame 3 (3.0s–4.2s): three thin magenta lines (`attention`) fan from ` is` back to ` sky` and `The`. Caption: ` is attends to · sky · The`.
5. Frame 4 (4.2s–5.4s): a purple `predict` distribution bar appears below — top 5 candidates: `blue` 47% · `clear` 18% · `falling` 9% · `the` 6% · `a` 4%. Mono numerals.
6. Frame 5 (5.4s–6.4s): `decode` orange chip selects `blue`; the chosen chip slides up and joins the prompt line.
7. Frame 6 (6.4s–7.4s): the new sequence `The sky is blue` materializes as a teal `output` chip. 600ms hold. Loop.

Total cycle: ~7.4s. Reduced motion: render Frame 6 statically and label it "One pass through the pipeline."

## D. Scene-card grid (Section 2)

Heading: "**What you'll see**" with eyebrow "SEVEN SCENES, ONE PIPELINE."

Layout: **4-up on desktop (≥1024px), 2-up on tablet, 1-up on mobile.** Seven cards (the canonical accent-token order: prompt, tokenize, embed, attention, predict, decode, output). The 8th slot in the desktop grid holds a small monogram card — "the full pipeline" — that serves as a visual cap, not an extra scene.

Card anatomy (160 × 200px min):
- 3px top accent stripe (the scene's accent).
- Eyebrow: scene number (`01–07`) in mono, accent-colored.
- Label: scene title (Space Grotesk 500, 1.25rem).
- Teaser: one line, ≤ 12 words. e.g. *Tokenize:* "Text becomes integers — but not the integers you'd expect."
- Hover/focus: 1px hairline brightens to the accent at 64% alpha; top stripe lifts to 4px; entire card translates −2px on Y over 160ms. Keyboard focus shows a 2px accent ring at 1.5px offset.

No icons. The accent stripe is the icon.

## E. Provenance section (Section 3)

This section is load-bearing — it is the project's epistemic honesty. It must read like the methods section of a paper, not a disclaimer.

- Layout: single column, 52rem max width, centered, generous vertical room (8rem above, 8rem below).
- Eyebrow: "**METHODS · PROVENANCE**".
- H2: "**Why GPT-2 small. Why illustrative.**"
- A 2px left rule in `--color-accent-caveat` runs the full height of the body copy.
- Body: two short paragraphs (≤ 70 words each), Inter 1.125rem, line-height 1.75. The first explains the choice (small, open, runnable offline). The second explains the honest negative space (frontier providers don't expose internals; this site cannot pretend to visualize them).
- A small inline definition list below — three rows, mono left / body right — answering: *Model · Source · Last refreshed*. e.g. `gpt2-small` · `huggingface.co/openai-community/gpt2` · `commit a1b2c3…`.
- No CTA in this section. The reader leaves on the honest beat.

## F. Two-paths section (Section 4)

Heading: "**Two ways to read it.**" Eyebrow: "PROGRESSIVE DISCLOSURE."

Mechanic: a **single live preview panel** with a segmented toggle above it — `Surface ◀▶ Deep`. The same scene (Predict, since it's already shipped) is rendered twice; the toggle cross-fades between the two card bodies over 240ms while the stage on the left stays fixed.

- Surface body shows the published Surface copy from `PredictScene` ("The model rates every word it knows…").
- Deep body shows the published Deep copy (logits, temperature, top-k).
- The toggle itself uses `--color-accent-attention` for the active thumb, neutral for the inactive lane.
- A small footnote under the panel: "Same scene. Different depth. You choose per-scene in the explainer." Mono, muted.

This avoids the cliche side-by-side and demonstrates the actual UX mechanism the app uses.

## G. Footer

- 4rem tall block, neutral surface, top hairline `--color-border`.
- Left: a horizontal seven-dot strip (one dot per accent, 8px circles, 12px gap) — the pipeline as a wordmark.
- Center: "**Launch the explainer →**" — Space Grotesk 500, 1.25rem, links to `#prompt` (the first scene anchor); CTA recolored to `--color-accent-output` on hover.
- Right: `GitHub` text link, `MIT` text link, both Inter 0.875rem, `text-text-muted`, underline-on-hover only.
- A final mono line, 0.75rem, muted: `built with vite · react 19 · tailwind v4 · motion · d3-scale · zod`.

## H. ASCII sketch (desktop, ~1440 wide)

```
┌────────────────────────────────────────────────────────────────────────┐
│  INTERACTIVE EXPLAINER · v0.x                                          │
│                                                                        │
│  See what happens                          ┌─────────────────────────┐ │
│  inside an LLM.                            │  "The sky is"           │ │
│                                            │     │                   │ │
│  Seven scenes. Real numbers from a         │   [The][ sky][ is]      │ │
│  small open model. Two ways to read it.    │     │  │  │             │ │
│                                            │   ▮▮▮ ▮▮▮ ▮▮▮  →768d    │ │
│  [ Start the tour → ]   [ View on GitHub ] │     ╲  │  ╱             │ │
│                                            │      predict ▰▱▱▱▱      │ │
│                                            │      decode → blue      │ │
│                                            │   "The sky is blue"     │ │
│                                            └─────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│  SEVEN SCENES, ONE PIPELINE                                            │
│  What you'll see                                                       │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐                                               │
│  │▔01│ │▔02│ │▔03│ │▔04│   (top stripes: yellow, green, cyan, magenta) │
│  │Pr.│ │Tk.│ │Em.│ │At.│                                               │
│  └───┘ └───┘ └───┘ └───┘                                               │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐                                               │
│  │▔05│ │▔06│ │▔07│ │ ● │   (purple, orange, teal, monogram)            │
│  │Pd.│ │Dc.│ │Ot.│ │···│                                               │
│  └───┘ └───┘ └───┘ └───┘                                               │
├────────────────────────────────────────────────────────────────────────┤
│  METHODS · PROVENANCE                                                  │
│  ▎ Why GPT-2 small. Why illustrative.                                  │
│  ▎ Every number on this site comes from a small open model run         │
│  ▎ offline. Frontier providers don't expose their internals —          │
│  ▎ so this site doesn't pretend to.                                    │
│  ▎ model    gpt2-small                                                 │
│  ▎ source   huggingface.co/openai-community/gpt2                       │
│  ▎ refresh  commit a1b2c3…                                             │
├────────────────────────────────────────────────────────────────────────┤
│  PROGRESSIVE DISCLOSURE                                                │
│  Two ways to read it.                                                  │
│           ┌─ Surface ◀──▶ Deep ─┐                                      │
│  ┌─────────────────┐  ┌──────────────────────────────┐                 │
│  │  [predict       │  │  The model rates every word… │                 │
│  │   stage:        │  │                              │                 │
│  │   bar chart]    │  │  logits · temperature · top-k│                 │
│  └─────────────────┘  └──────────────────────────────┘                 │
├────────────────────────────────────────────────────────────────────────┤
│  BUILT WITH                                                            │
│  vite · react 19 · typescript 5.7 · tailwind v4 · motion · d3 · zod    │
├────────────────────────────────────────────────────────────────────────┤
│  ● ● ● ● ● ● ●     Launch the explainer →     GitHub  MIT              │
└────────────────────────────────────────────────────────────────────────┘
```

## I. Motion budget

Motion is permitted only where it explains the product. Durations are wall-clock, not abstract.

- Hero chip-strip loop: **7.4s cycle**, eased frame transitions 320ms each. Pauses entirely on `prefers-reduced-motion`.
- CTA hover: background-color transition 160ms ease-out.
- Scene card hover: −2px translateY + stripe-grow 160ms ease-out.
- Surface↔Deep toggle: cross-fade 240ms ease-in-out; stage does not move.
- Section reveal on scroll: opacity 0→1 + 8px translateY, 360ms, once. Off under reduced motion.
- Footer pipeline dots: static. No twinkle.

Total budget: no element animates longer than 360ms outside the hero. The hero loop is the only ambient motion.

## J. What we will NOT do

- No purple gradient mesh hero, no decorative blobs, no atmospheric particles, no glass-morphism.
- No neutral-grayscale "minimal" pass that abandons the seven accents — the accents are the brand.
- No oversized one-word hero ("**INTELLIGENCE.**"). The H1 is a sentence, not a poster.
- No AI-buzzword copy: no "unleash", "supercharge", "harness", "demystify the magic", "AI-powered", "next-gen", "intelligence at your fingertips". The site is a notebook, not a pitch deck.
- No card-in-card nesting. The card grid is one level deep.
- No autoplaying video, no Lottie of a brain, no abstract neural-net line art.
- No testimonials, no logo wall, no "trusted by" strip — this is a free explainer with no customers to launder.
- No emoji in headings or CTAs.
- No claim that this visualizes Claude or ChatGPT internals; the provenance section is the entire reason that line is held.
- No light-mode variant in v1 — the existing app is dark; the landing matches.
