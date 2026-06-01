# Landing Page Brand Voice — "Inside an LLM"

Derived from existing app copy (README, PromptScene, PredictScene, DecodeScene, AboutScene, CompareScene). Use this profile as the single source of truth for landing-page copy.

---

## 1. Voice Attributes

- **Plain-spoken but technically precise** — uses ordinary words ("a string of characters", "the model writes the reply token by token") next to exact technical terms ("logits", "softmax", "decoder-only autoregressive transformers"). No dumbing-down, no jargon flexing.
- **Honest about limits** — names what the visualization can and cannot show. Caveats are first-class UI, not footnotes.
- **Mechanism-first** — explains how a thing works before naming what it is. The verb leads, the label follows.
- **Calm and declarative** — short statements of fact. No exclamation, no hedging, no hype adjectives.
- **Two-tier respectful** — assumes a Surface reader who wants the gist and a Deep reader who wants receipts. Neither is condescended to.
- **Sharp on framing** — calls out the real story when conventional framing is wrong (e.g., convergence over "X is bigger", randomness dial over "creativity dial").

## 2. Anti-Attributes

- Not marketing hype ("revolutionary", "unleash", "supercharge", "next-gen")
- Not "AI changes everything" futurism
- Not condescending ("don't worry, it's simple!")
- Not vague ("powerful", "advanced", "intelligent")
- Not bait-y questions ("Ever wondered how AI works?")
- Not capability promises the visualization doesn't actually demonstrate
- Not anthropomorphic ("the model thinks", "the model understands")

## 3. Three Signature Moves

1. **The em-dash definition.** Lead with the plain phrase, then immediately tighten it with a dash. Examples from source: `"Everything starts with a prompt — a string of characters."` / `"a small open reference model — GPT-2 small, run offline."`
2. **The corrective reframe.** State the wrong mental model, then replace it. Example: `"Temperature is a randomness dial, not a creativity or intelligence dial."` Also: `"The honest story here is convergence, not 'X is bigger.'"`
3. **The mechanism sentence.** A flat, present-tense statement of what the model literally does, token-by-token. Example: `"The model writes the reply token by token. It chooses, appends, and runs the network again to pick the next token. Repeat until done."`

## 4. Microcopy Length Norms

- **Surface paragraphs:** 1–2 sentences, 15–35 words total.
- **Deep paragraphs:** 1–3 sentences, 25–55 words.
- **Eyebrow labels:** 2–5 words, sentence case, no terminal punctuation (e.g., "The starting point", "Next-token prediction", "The autoregressive loop").
- **Caveat notes:** 1–2 sentences, ≤45 words.
- **Sentence length:** mostly 8–18 words; occasional 4-word fragments for rhythm ("Repeat until done.").

## 5. Honesty Disclosures — PRESERVE EXACTLY

The provenance language is the brand-voice anchor. Keep the exact phrasing on the landing page:

> "Every number, embedding coordinate, attention weight, and probability shown in this site comes from a small open reference model — **GPT-2 small**, run offline. They are *illustrative*. Frontier providers (Claude, ChatGPT) do not expose token-level attention, embedding coordinates, or full next-token distributions for arbitrary input, so this site cannot honestly visualize their internals."

And the in-scene caveat pattern:

> "The probabilities are illustrative — taken from a small open reference model (GPT-2 small) run offline, not live Claude or ChatGPT internals."

Required landing-page disclosure: name GPT-2 small, use the word *illustrative*, and explicitly say frontier providers' internals are not exposed.

## 6. Landing-Page Copy Targets

- **Hero H1 (≤6 words):** `Inside an LLM`
- **Hero subhead (≤25 words):** `Watch a prompt become an answer, one token at a time. Seven stages, two reading paths — gist on the surface, receipts underneath.`
- **"What you'll see" H2:** `What you'll see`
- **Scene-card teasers (≤12 words each):**
  - **Prompt** — `Everything starts with a string of characters. Nothing more.`
  - **Tokenize** — `The text is sliced into the model's chosen pieces.`
  - **Embed** — `Each token becomes a coordinate the network can do math on.`
  - **Attention** — `Tokens look at the tokens that matter, weighted by relevance.`
  - **Predict** — `A probability for every possible next token, ranked.`
  - **Decode** — `Sample one token, append it, run the loop again.`
  - **Output** — `Tokens stream out until the end-of-sequence signal fires.`
- **Provenance H2:** `Where the numbers come from`
- **Provenance body (2 sentences):** `Every number, embedding, attention weight, and probability on this site comes from GPT-2 small, run offline — illustrative, not live frontier internals. Claude and ChatGPT don't expose token-level state for arbitrary input, so this site doesn't pretend to visualize theirs.`
- **Final CTA button label:** `Start with the prompt`

## 7. Five Copy Patterns to AVOID

1. **Hype verbs** — no "unleash", "supercharge", "demystify", "revolutionize", "unlock". This is an explainer, not a launch.
2. **Capability overclaim** — never imply the site shows Claude or ChatGPT internals. The provenance disclosure is non-negotiable.
3. **Anthropomorphism** — don't say the model "thinks", "knows", "understands", or "decides creatively". Use "predicts", "samples", "emits", "scores".
4. **Bait questions as headers** — no "Ever wondered…?", "What is an LLM, really?", "Curious how AI works?". State the thing instead.
5. **Vague capability adjectives** — no "powerful", "advanced", "cutting-edge", "smart". If a quality matters, name the mechanism that produces it.

---

## VOICE PROFILE (reusable block)

```text
VOICE PROFILE
=============
Author: Inside an LLM — interactive explainer
Goal: Landing-page copy that matches in-app scene voice
Confidence: High (anchored on 6 source files, including README provenance)

Source Set
- README.md (Provenance paragraph)
- src/scenes/PromptScene.tsx
- src/scenes/PredictScene.tsx
- src/scenes/DecodeScene.tsx
- src/scenes/AboutScene.tsx
- src/scenes/CompareScene.tsx

Rhythm
- Mostly 8–18 word sentences; occasional 4-word fragments for closure.
- Paragraphs 1–3 sentences. No walls of text.

Compression
- Compressed but explanatory. Mechanism first, label second.
- Dense technical nouns balanced by plain verbs.

Capitalization
- Conventional. Sentence case for eyebrows and headings.
- Lowercase technical terms in body (logits, softmax, top-k).

Parentheticals
- Used for narrowing or naming the artifact: "(GPT-2 small)", "(Claude, ChatGPT)".
- Not used for asides, jokes, or winks.

Question Use
- Effectively absent. The voice declares; it does not ask.

Claim Style
- Flat declarative. Strong claims are immediately qualified or sourced.
- Corrective reframes ("X is not Y, it is Z") are a signature move.

Preferred Moves
- Em-dash definitions ("a prompt — a string of characters")
- Corrective reframes ("randomness dial, not a creativity dial")
- Mechanism sentences in present tense ("chooses, appends, and runs the network again")
- Receipts: name the model, the file, the source

Banned Moves
- Hype verbs (unleash, supercharge, demystify)
- Capability overclaim about Claude/ChatGPT internals
- Anthropomorphism (thinks, understands, decides)
- Bait questions as hooks
- Vague capability adjectives (powerful, advanced, smart)

CTA Rules
- One CTA per page section, action-led, names the next concrete step.
- No "Get started" / "Learn more". Prefer "Start with the prompt".

Channel Notes
- Landing page: lead with the provenance honesty; keep hero short.
- In-app: Surface text ≤2 sentences; Deep text adds mechanism + caveat.
- Social/share copy: reuse the corrective-reframe move as the hook.
```
