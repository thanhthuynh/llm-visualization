# Interactive LLM Explainer — Plan 2: MVP Scenes

> **Subagent workers:** Use `superpowers:subagent-driven-development` to execute task-by-task with the spec + code-quality two-stage review pattern established in Plan 1.

**Source spec:** `/Users/thanh/workspace/obsidian-primary-vault/llm-explainer-spec-v1.1.md`
**Builds on:** `2026-05-30-llm-explainer-foundation.md` (Plan 1, branch `feat/llm-explainer-foundation`).
**Goal:** Add the four "narrative" scenes that complete the MVP path — Prompt → Tokenize → Decode → Assemble — and a small foundation cleanup that makes new scenes auto-wire into keyboard / hash / rail nav.
**Architecture:** Same SceneStation pattern as Plan 1. New: Motion finally consumed (text-to-chips reflow in Tokenize, streamed reply in Assemble), a `SceneConfig.implemented` flag drives nav.
**What's deferred to Plan 3:** Embeddings and Attention (the two honesty-critical scenes). Compare and full a11y polish ship in Plan 4.

---

## Pre-Plan-2 foundation cleanup (Task 1)

Plan 1's final review flagged that `App.tsx` hardcodes `MOUNTED_IDS = ['predict','about']`. Plan 2 adds four scenes; without a config-driven approach, every later plan has to remember to update that literal. **Task 1 fixes this once.** After that, flipping `implemented: true` in `scenes.config.ts` auto-wires the rail, keyboard, hash sync, and main column.

Other final-review items (Tailwind migration, focus-escape on stage frame, eslint config hygiene) defer to Plan 4 polish — they don't block Plan 2's scope.

---

## File Structure (Plan 2 additions)

| Path | Responsibility |
|---|---|
| `src/scenes/PromptScene.tsx` | Scene 0 — eyebrow + prompt field + 2 example chips. Deep: raw-input panel + char count. |
| `src/scenes/TokenizeScene.tsx` | Scene 1 — sentence → 3 token chips via Motion `layout`. Deep: token IDs + CaveatNote (closes spec §0 gap #8). |
| `src/scenes/DecodeScene.tsx` | Scene 5 — loop animation, temperature slider, **2 side-by-side distributions** (T=0.2 vs T=1.4), top-k/p/eos panel, CaveatNote on randomness ≠ creativity. |
| `src/scenes/AssembleScene.tsx` | Scene 6 — streaming reply bubble, detokenize chain in Deep, as-text/as-tokens toggle, CaveatNote. |
| `src/components/PromptField.tsx` | Read-only `"The sky is"` display with blinking caret (Scene 0 stage). |
| `src/components/ReplyBubble.tsx` | Assistant-avatar reply bubble that streams tokens. |
| `src/components/DistributionPair.tsx` | Two stacked DataBar groups + a "raise T →" arrow between them (Decode deep). |
| `tests/unit/*.test.tsx` for each new component + scene | Unit tests. |
| `e2e/mvp-flow.spec.ts` | Cross-scene happy path keyboard nav Prompt → ... → Output. |

**Modified:**
- `src/scenes/scenes.config.ts` — add `implemented?: boolean` field, set on Predict/About + Prompt/Tokenize/Decode/Output as they ship.
- `src/components/ProgressRail.tsx` — drive segment `disabled` from `scene.implemented`.
- `src/App.tsx` — derive `MOUNTED_IDS` from `SCENES.filter(s => s.implemented).map(s => s.id)`.

---

## Validation commands (same as Plan 1)

```bash
npm run typecheck && npm run lint && npm test && npm run e2e && npm run build
```

Plan-2 completion criteria:
- All Plan-1 tests still pass (no regressions).
- 4 new scenes mounted + rail-clickable + keyboard-navigable.
- Cross-scene E2E flow passes.
- Bundle under 200 KB gz (Motion incremental ~10-15 KB gz once used).

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Motion `layout` reflow visual artifacts | Use it only on Tokenize text→chips. Other entrances stay declarative. |
| Streamed reply in jsdom (no animation frames) | Use `useEffect` + `setTimeout`; tests assert final state, E2E asserts visual progression. |
| Decode's two distributions could conflict with Predict's slider | They're independent components reading from different local state. |
| Sky dataset doesn't have a per-token ID for ' blue' (it's a *next-token*, not a token) | AssembleScene's detokenize chain hard-codes `318 → 62 6c 75 65 → blue` per the mockup. `dataset.bytes[' blue']` reads the existing field. |

---

## Tasks

### Task 1: Foundation cleanup — `implemented` flag + nav-from-config

**Files:** Modify `src/scenes/scenes.config.ts`, `src/components/ProgressRail.tsx`, `src/App.tsx`, and their tests.

- [ ] **Step 1:** In `scenes.config.ts`, add `implemented?: boolean` to `SceneConfig`. Set `implemented: true` on `predict` and `about` (Plan 1's mounted set). Other six remain falsy.

- [ ] **Step 2:** Add to `tests/unit/scenes.config.test.ts`:

```ts
it('marks only the currently-implemented scenes', () => {
  expect(getSceneById('predict').implemented).toBe(true)
  expect(getSceneById('about').implemented).toBe(true)
  expect(getSceneById('prompt').implemented).toBeFalsy()
})
```

- [ ] **Step 3:** In `App.tsx`, replace the hardcoded literal:

```ts
import { SCENES } from '@/scenes/scenes.config'
const MOUNTED_IDS: readonly SceneId[] = SCENES
  .filter((s) => s.implemented)
  .map((s) => s.id)
```

`App.test.tsx` queries don't depend on the literal, so the existing tests keep passing.

- [ ] **Step 4:** In `ProgressRail.tsx`, for pipeline scenes that aren't `implemented`, render as `disabled` with opacity 0.45 and `cursor: not-allowed`:

```ts
const isImplemented = !!scene.implemented
// in the button:
disabled={!isImplemented}
style={{
  // ...existing styles
  opacity: isImplemented ? 1 : 0.45,
  cursor: isImplemented ? 'pointer' : 'not-allowed',
}}
```

Add a test:

```ts
it('disables non-implemented scenes', () => {
  render(<ProgressRail activeId="predict" onJump={() => {}} />)
  expect(screen.getByRole('button', { name: /prompt/i })).toBeDisabled()
  expect(screen.getByRole('button', { name: /predict/i })).not.toBeDisabled()
})
```

- [ ] **Step 5:** Run `npm run typecheck && npm run lint && npm test && npm run build`. Commit: `refactor: derive MOUNTED_IDS from SceneConfig.implemented flag`.

---

### Task 2: `PromptField` component

**Files:** Create `src/components/PromptField.tsx`, `tests/unit/PromptField.test.tsx`.

Display the running prompt in a bordered card with a blinking caret. Props: `{ text: string }`.

**Test (4 cases):** renders the text; uses mono font; shows a `data-testid="caret"` element; respects reduced motion (caret animation disabled).

**Impl sketch:**
```tsx
import { useReducedMotionPref } from '@/app/useReducedMotionPref'

interface PromptFieldProps { text: string }

export function PromptField({ text }: PromptFieldProps) {
  const reduce = useReducedMotionPref()
  return (
    <div style={{ /* card bg, border, padding 16 */ }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18 }}>{text}</span>
      <span
        data-testid="caret"
        style={{
          display: 'inline-block', width: 2, height: 18, marginLeft: 2,
          background: 'var(--color-text-primary)',
          animation: reduce ? 'none' : 'blink-caret 1s steps(2) infinite',
        }}
      />
    </div>
  )
}
```

Add to `src/index.css`:

```css
@keyframes blink-caret {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

Commit: `feat: add PromptField with blinking caret`.

---

### Task 3: `PromptScene`

**Files:** Create `src/scenes/PromptScene.tsx`, `tests/unit/PromptScene.test.tsx`.

Yellow accent (`#FFC857`).

**Stage:**
- Eyebrow "YOUR PROMPT" + `<PromptField text={dataset.prompt} />`
- Eyebrow "TRY AN EXAMPLE" + two `Chip variant="example"` (text: "The sky is" and "The cat sat down because it was tired"). `onClick` is a no-op in Plan 2 (Plan 3 wires `setPromptId`).

**Surface:** "Everything starts with a prompt — a string of characters. The model will receive exactly the text below."

**Deep:** A row showing the literal `"The sky is"` followed by a `10 chars` tag (computed from the prompt's length). Body: "Before the model sees this, it has to be turned into pieces the network can understand. That's the next step."

**Tests (6):** eyebrow YOUR PROMPT, prompt field renders, both example chips visible by name, surface paragraph visible, deep reveals literal string + "10 chars", accent rule is yellow.

Flip `implemented: true` for `prompt` in `scenes.config.ts`.

Commit: `feat: build PromptScene`.

---

### Task 4: `TokenizeScene`

**Files:** Create `src/scenes/TokenizeScene.tsx`, `tests/unit/TokenizeScene.test.tsx`.

Green accent (`#6BF178`). First Motion consumer.

**Stage:**
- Eyebrow "FROM TEXT TO TOKENS"
- The full sentence "The sky is" rendered above three `<Chip variant="token">` chips for `The`, ` sky`, ` is` — wrapped in `<motion.div layout data-testid="tokens-group">` from `motion/react`
- Caption: "Each token is a piece of the input. The · marks the whitespace that belongs to each token."

**Surface:** "The model doesn't see characters — it sees tokens, learned subword pieces from the model's vocabulary."

**Deep:**
- Token IDs shown under each chip (`464`, `6766`, `318`) using `dataset.tokens[i].id`
- A "WHEN A WORD IS RARE, IT SPLITS" row showing `tokenization` → `[ token | ization ]` (illustrative, hardcoded since the sky dataset doesn't have rare-word data)
- CaveatNote: "Different models tokenize the same text differently. Claude and ChatGPT each have their own tokenizer — same sentence, different counts."

**Tests (7):** three token chips visible, IDs hidden in surface, IDs revealed in deep, CaveatNote text matches `/different models|tokenize/i`, mid-word split row visible in deep, motion group has `data-testid="tokens-group"`, accent rule is green.

Flip `implemented: true` for `tokenize`.

Commit: `feat: build TokenizeScene with motion layout reflow + CaveatNote`.

---

### Task 5: `DistributionPair` component

**Files:** Create `src/components/DistributionPair.tsx`, `tests/unit/DistributionPair.test.tsx`.

Renders two labelled probability distributions side by side, with an arrow + caption between.

**Props:**
```ts
interface DistributionPairProps {
  left: { label: string; bars: Array<{ token: string; p: number }> }
  right: { label: string; bars: Array<{ token: string; p: number }> }
  accent: AccentToken
  arrowCaption?: string
}
```

**Impl sketch:** A 3-column flex/grid (left bars | arrow | right bars). Each side renders a small `EyebrowLabel` with its label, then a stack of `<DataBar>` with `dominant={index === 0}` and `accent` passed through.

**Tests (5):** both labels render, both bar sets render correct counts, arrow caption "raise T →" visible (default text if no `arrowCaption`), accent passed through (first bar in each set has accent color), value strings formatted as `{Math.round(p*100)}%`.

Commit: `feat: add DistributionPair for Decode deep view`.

---

### Task 6: `DecodeScene`

**Files:** Create `src/scenes/DecodeScene.tsx`, `tests/unit/DecodeScene.test.tsx`.

Orange accent (`#FF7B00`).

**Stage:**
- Eyebrow "ONE TOKEN AT A TIME"
- A row of token chips `The` `sky` `is` + a `＋` glyph + a fresh `blue` chip (with mono "↑ just chosen" caption)
- A "the model / predict next token" box with the predict accent
- An "Updated: 'The sky is blue'" chip
- "feeds back in →" arrow
- Loop indicator and a Play/Pause button (button toggles a local `playing` state; in Plan 2 the button's effect can be a no-op — Plan 4 polishes the animation)

**Surface:** "The model writes one token at a time. It chooses, appends, and runs the network again to pick the next token. Repeat until done."

**Deep:**
- Eyebrow "TEMPERATURE RESHAPES THE ODDS"
- A `<input type="range" min="0.1" max="2" step="0.1" defaultValue="1">` slider with `aria-label="Temperature"` and min/max captions "sharp & predictable" / "flat & random"
- `<DistributionPair>` showing:
  - left: `T = 0.2 (PEAKED)` — `[{ blue, 0.90 }, { not, 0.05 }, { the, 0.03 }, { a, 0.02 }]`
  - right: `T = 1.4 (FLATTER)` — `[{ blue, 0.34 }, { not, 0.22 }, { the, 0.18 }, { a, 0.14 }, { very, 0.12 }]`
- "More sampling controls" panel: `top-k = 40` ("only the 40 likeliest tokens are eligible"), `top-p = 0.9` ("keep the smallest set covering 90 % of probability"), `<eos>` ("when the model emits this end-of-sequence token, the loop stops")
- CaveatNote: "Temperature is a randomness dial, not a creativity or intelligence dial."

**Tests (8):** chips visible, loop UI rendered, surface paragraph, temperature slider has min=0.1 max=2, both distribution labels (`PEAKED`, `FLATTER`) visible in deep, top-k 40 + top-p 0.9 + eos labels visible, CaveatNote `/randomness|creativity/i`, accent rule orange.

Flip `implemented: true` for `decode`.

Commit: `feat: build DecodeScene with temperature slider + side-by-side distributions`.

---

### Task 7: `ReplyBubble` component

**Files:** Create `src/components/ReplyBubble.tsx`, `tests/unit/ReplyBubble.test.tsx`.

Small "A" avatar circle + rounded card with streaming text.

**Props:** `{ text: string, streaming?: boolean }`.

**Impl sketch:**
```tsx
import { useEffect, useState } from 'react'
import { useReducedMotionPref } from '@/app/useReducedMotionPref'

export function ReplyBubble({ text, streaming = false }: ReplyBubbleProps) {
  const reduce = useReducedMotionPref()
  const [shown, setShown] = useState(streaming && !reduce ? '' : text)
  useEffect(() => {
    if (!streaming || reduce) { setShown(text); return }
    setShown('')
    let i = 0
    const id = window.setInterval(() => {
      i++
      setShown(text.slice(0, i))
      if (i >= text.length) window.clearInterval(id)
    }, 40)
    return () => window.clearInterval(id)
  }, [text, streaming, reduce])
  const isStreaming = streaming && !reduce && shown.length < text.length
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div aria-hidden="true" style={{ /* avatar circle */ }}>A</div>
      <div style={{ /* bubble card */ }}>
        {shown}
        {isStreaming && <span data-testid="reply-caret">|</span>}
      </div>
    </div>
  )
}
```

**Tests (5):** renders full text when `streaming={false}`; streams incrementally with `vi.useFakeTimers()` + `vi.advanceTimersByTime`; respects reduced motion (full text on first render); avatar present; caret visible while streaming, gone when done.

Commit: `feat: add ReplyBubble with streaming + reduced-motion support`.

---

### Task 8: `AssembleScene`

**Files:** Create `src/scenes/AssembleScene.tsx`, `tests/unit/AssembleScene.test.tsx`.

Teal accent (`#2EE6D6`).

**Stage:**
- Eyebrow "STREAMING THE REPLY"
- Row of output token chips: `The`, ` sky`, ` is`, ` blue` (Chip variant="token")
- "detokenize ↓" caption with arrow
- `<ReplyBubble text="The sky is blue" streaming />`

**Surface:** "Each token becomes characters and joins the reply — you see it appear word by word."

**Deep:**
- A view toggle: `as text` / `as tokens` (a small two-button group, `aria-pressed` on the active one). When `as tokens`, replace the bubble content with the token chips with IDs visible.
- A detokenize chain row: `318 (TOKEN ID) → 62 6c 75 65 (BYTES) → blue (TEXT)` — bytes read from `dataset.bytes[' blue']`.
- Body: "Tokens are sent as they're generated, so text appears live. They can also be returned all at once when complete."
- CaveatNote: "The model commits one token at a time. It isn't reading from a stored outline — the next token is always a fresh decision based on everything written so far."

**Tests (8):** output chips visible, reply bubble eventually shows "The sky is blue" (use fake timers or `await waitFor`), detokenize chain shows `318`, `62 6c 75 65`, `blue`, as-text / as-tokens toggle clickable and `aria-pressed` flips, switching to `as tokens` shows token IDs in the bubble area, CaveatNote `/stored outline|one token at a time/i`, accent rule teal.

Flip `implemented: true` for `output`.

Commit: `feat: build AssembleScene with streaming reply + detokenize chain`.

---

### Task 9: Mount the new scenes in `App.tsx`

**Files:** Modify `src/App.tsx`, `tests/unit/App.test.tsx`.

```tsx
<main className="stations" aria-label="LLM pipeline scenes">
  <PromptScene />
  <TokenizeScene />
  <PredictScene />
  <DecodeScene />
  <AssembleScene />
  <AboutScene />
</main>
```

Default `activeId` becomes `'prompt'` so the user lands at Scene 0.

Update `App.test.tsx`: expect 5 h2 headings (Prompt Input, Tokenization, Next-Token Prediction, Decoding Loop, Output Assembly) plus About. The TopBar pill should still show "The sky is" by default.

Commit: `feat: mount Prompt/Tokenize/Decode/Assemble scenes in App`.

---

### Task 10: Cross-scene E2E

**Files:** Create `e2e/mvp-flow.spec.ts`.

Three Playwright tests:

1. **Pipeline keyboard nav** — open, expect Prompt Input heading visible, press ArrowDown five times, expect "About this explainer" heading visible and `/#about$/` URL.
2. **Rail jump** — click the "TOKENIZE" rail button by accessible name, expect `/#tokenize$/` and Tokenization heading visible.
3. **Deep persistence across scenes** — open PromptScene's Go Deeper button, navigate to Tokenize via ArrowDown, expect Tokenize's deep panel also open (sticky DepthContext).

Commit: `test(e2e): add cross-scene MVP flow tests`.

---

### Task 11: Bundle budget + final verification

Same as Plan 1's Task 26. Run all four gates plus E2E. Verify bundle still under 200 KB gz.

Motion is finally consumed in TokenizeScene (`<motion.div layout>`) and ReplyBubble (`AnimatePresence` via stream effect). Expect ~10-15 KB gz increase from Plan 1's 82.8 KB → ~95-100 KB. Still well under budget.

If the bundle creeps above 150 KB gz, lazy-load DecodeScene + AssembleScene via `React.lazy` and `Suspense`.

Commit: `chore: verify Plan 2 bundle and full suite`.

---

## Self-review summary

**Spec coverage (Plan 2 scope):**

| Spec section | Implemented | Task |
|---|---|---|
| §3 Scene 0 (Prompt) | PromptScene + PromptField | 2, 3 |
| §3 Scene 1 (Tokenize) — chips + IDs + CaveatNote | TokenizeScene + Motion `layout` | 4 |
| §3 Scene 5 (Decode) — loop + temperature + two distributions + top-k/p/eos + CaveatNote | DecodeScene + DistributionPair | 5, 6 |
| §3 Scene 6 (Assemble) — chips + streaming + detokenize + as-text/as-tokens | AssembleScene + ReplyBubble | 7, 8 |
| §10 open decision #2 — Tokenization CaveatNote | Task 4 | 4 |
| §6 component architecture — auto-wired nav from config | implemented flag + derived MOUNTED_IDS | 1 |
| §9 cut order — Prompt + Tokenize + Decode + Assemble first | All Plan 2 tasks | All |

**Out of scope:** Embeddings (Plan 3), Attention (Plan 3), Compare section (Plan 4), inline-style → Tailwind migration (Plan 4), eslint config cleanup (Plan 4).

**Placeholder scan:** none. Every task has either a code skeleton or a clear test spec.
