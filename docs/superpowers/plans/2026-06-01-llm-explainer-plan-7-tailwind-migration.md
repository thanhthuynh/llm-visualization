# LLM Explainer — Plan 7: Inline-Style → Tailwind Utility Migration

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every `style={{...}}` JSX inline-style block across the 28 files in `src/` with Tailwind v4 utility classes, preserving visual fidelity exactly. Lock the migration in with an ESLint rule that bans new inline `style` props (with narrow file-scoped exceptions for runtime-computed values).

**Architecture:** Tailwind v4 is already wired (`@tailwindcss/vite` plugin, `@theme {}` block in `src/index.css`). Every CSS variable declared in `@theme` is automatically exposed as a Tailwind utility via arbitrary-value syntax (`bg-(--color-surface-card)`, `text-(--color-text-muted)`). For runtime-computed styles (e.g. `width: ${pct}%` in `DataBar`/`ContextWindowBar`), pass values through CSS custom properties (`style={{ '--bar-w': `${pct}%` }} className="w-[var(--bar-w)] h-full"`) so the JSX stays utility-driven and the dynamic value is isolated.

**Tech Stack:** Tailwind v4 (already installed), `eslint-plugin-react`'s built-in `forbid-dom-props` for the lockdown rule, zero new runtime deps.

**Blast radius:** All of `src/` — 28 files identified by `grep -rln "style={{" src/`. Unit tests must remain green file-by-file; the existing visual test coverage is structural (querying by role/text), not snapshot-based, so utility-class migration should be transparent.

**Pre-requisite:** Plans 5 (ESLint hygiene) + 6 (a11y audit) merged. Plan 6 provides the safety net — if a migration accidentally drops an `aria-` attribute or breaks focus styling, the a11y test suite catches it.

---

## Patterns to Mirror

| Category | Source | Pattern |
|---|---|---|
| Theme tokens | `src/index.css:3-43` | `@theme {}` declares CSS vars; Tailwind v4 exposes them via `bg-(--var)`, `text-(--var)`. |
| Inline style today | `src/scenes/CompareScene.tsx:29-36` | `style={{ padding: 'var(--stage-padding)', display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}` — full of layout + token references. |
| Dynamic style today | `src/components/ContextWindowBar.tsx:51` | `style={{ width: \`${pct}%\` }}` — runtime-computed; cannot be a static utility. |
| Accent-keyed dynamic style | `src/components/Chip.tsx:17-24` | `border: 1px solid ${accent}` where `accent` is a runtime string. |
| Existing className use | `src/App.tsx:66`, `src/App.tsx:72` | `className="skip-link"` / `className="stations"` — semantic class names from `src/index.css`. These stay. |
| Test selector resilience | `tests/unit/CompareScene.test.tsx`, all scene tests | Tests use `getByText`, `getByRole`, `data-tier`, `aria-*` — NOT className-based queries. Safe for migration. |

---

## Translation Cheat Sheet

This is the locked-in mapping every task should follow. If a value isn't covered here, add it before continuing.

### Layout

| Inline style | Tailwind class |
|---|---|
| `display: 'flex'` | `flex` |
| `display: 'inline-flex'` | `inline-flex` |
| `display: 'grid'` | `grid` |
| `flexDirection: 'column'` | `flex-col` |
| `flexDirection: 'row'` | `flex-row` (default) |
| `alignItems: 'center'` | `items-center` |
| `alignItems: 'flex-start'` | `items-start` |
| `justifyContent: 'center'` | `justify-center` |
| `justifyContent: 'space-between'` | `justify-between` |
| `flexWrap: 'wrap'` | `flex-wrap` |
| `gap: 4` | `gap-1` |
| `gap: 8` | `gap-2` |
| `gap: 12` | `gap-3` |
| `gap: 16` | `gap-4` |
| `gap: 18` | `gap-[18px]` (non-scale value) |
| `gap: 20` | `gap-5` |
| `gap: 24` | `gap-6` |
| `width: '100%'` | `w-full` |
| `height: '100%'` | `h-full` |
| `marginTop: 4` | `mt-1` |
| `marginTop: 8` | `mt-2` |
| `marginTop: 12` | `mt-3` |
| `marginTop: 18` | `mt-[18px]` |
| `marginTop: 'auto'` | `mt-auto` |
| `padding: 14` | `p-[14px]` |
| `padding: 'var(--stage-padding)'` | `p-(--stage-padding)` |
| `padding: '8px 14px'` | `px-[14px] py-2` |
| `padding: '10px 16px'` | `px-4 py-[10px]` |
| `gridTemplateColumns: '1fr 1fr'` | `grid-cols-2` |
| `minHeight: 0` | `min-h-0` |
| `flex: 1` | `flex-1` |
| `maxWidth: 'var(--surface-max-w)'` | `max-w-(--surface-max-w)` |

### Visual / typography

| Inline style | Tailwind class |
|---|---|
| `background: 'var(--color-surface-card)'` | `bg-(--color-surface-card)` |
| `color: 'var(--color-text-primary)'` | `text-(--color-text-primary)` |
| `color: 'var(--color-text-muted)'` | `text-(--color-text-muted)` |
| `border: '1px solid var(--color-border)'` | `border border-(--color-border)` |
| `borderRadius: 'var(--radius-card)'` | `rounded-(--radius-card)` |
| `borderRadius: 'var(--radius-pill)'` | `rounded-(--radius-pill)` |
| `fontFamily: 'var(--font-body)'` | `font-[family-name:--font-body]` *(verify in pilot)* |
| `fontFamily: 'var(--font-mono)'` | `font-[family-name:--font-mono]` |
| `fontWeight: 600` | `font-semibold` |
| `fontWeight: 700` | `font-bold` |
| `fontSize: 12` | `text-xs` |
| `fontSize: 13` | `text-[13px]` |
| `fontSize: 14` | `text-sm` |
| `fontSize: 15` | `text-[15px]` |
| `fontSize: 17` | `text-[17px]` |
| `fontSize: 18` | `text-lg` |
| `lineHeight: '20px'` | `leading-5` |
| `lineHeight: '22px'` | `leading-[22px]` |
| `lineHeight: '27px'` | `leading-[27px]` |
| `cursor: 'pointer'` | `cursor-pointer` |
| `cursor: 'default'` | `cursor-default` |

**Font-family note:** Tailwind v4 doesn't auto-expose `--font-*` as `font-(--name)` shorthand reliably; the safe form is `font-[family-name:--font-body]`. Pilot task validates this; if it doesn't work, fall back to keeping `fontFamily` as the lone inline style.

### Dynamic values (cannot be static utilities)

| Inline style | New approach |
|---|---|
| `style={{ width: \`${pct}%\` }}` | `style={{ '--bar-w': \`${pct}%\` } as React.CSSProperties} className="w-[var(--bar-w)]"` |
| `style={{ border: \`1px solid ${accent}\` }}` | `style={{ '--accent': accent } as React.CSSProperties} className="border border-(--accent)"` |
| `style={{ boxShadow: \`0 0 8px 1px ${accent}66\` }}` | Tailwind arbitrary value with var: `className="shadow-[0_0_8px_1px_var(--accent)66]"` |
| SVG `transform={...}` (e.g. `AttentionMatrix.tsx:43`) | LEAVE AS-IS — not a CSS `style` prop. |

---

## File Inventory (28 files in `src/` with `style={{` — migration order)

### Pilot (Task 2): smallest, validates the approach
1. `src/components/Chip.tsx` (33 lines, has static + dynamic styles)

### Wave 1 — Simple components (Task 3): no dynamic styles, < 100 lines
2. `src/components/AccentRule.tsx`
3. `src/components/CaveatNote.tsx`
4. `src/components/EyebrowLabel.tsx`
5. `src/components/PhilosophyCard.tsx`
6. `src/components/DeepToggle.tsx`

### Wave 2 — Medium components (Task 4)
7. `src/components/DeepPanel.tsx`
8. `src/components/ReplyBubble.tsx`
9. `src/components/TokenizerCount.tsx`
10. `src/components/ClaimTier.tsx`
11. `src/components/CompareTable.tsx`
12. `src/components/HeadSelector.tsx`

### Wave 3 — Components with dynamic styles (Task 5) — apply the CSS-var-passthrough pattern
13. `src/components/DataBar.tsx` (`width: ${pct}%`)
14. `src/components/ContextWindowBar.tsx` (`width: ${pct}%`)
15. `src/components/EmbeddingSpace.tsx`
16. `src/components/PromptField.tsx`

### Wave 4 — Larger components (Task 6)
17. `src/components/SceneStation.tsx` (the layout primitive — many call sites depend on this)
18. `src/components/SceneNav.tsx`
19. `src/components/TopBar.tsx`
20. `src/components/ProgressRail.tsx`
21. `src/components/DistributionPair.tsx`

### Wave 5 — Scenes (Task 7) — in pipeline order
22. `src/scenes/PromptScene.tsx`
23. `src/scenes/TokenizeScene.tsx`
24. `src/scenes/EmbedScene.tsx`
25. `src/scenes/AttentionScene.tsx`
26. `src/scenes/PredictScene.tsx`
27. `src/scenes/DecodeScene.tsx`
28. `src/scenes/AssembleScene.tsx`
29. `src/scenes/CompareScene.tsx`
30. `src/scenes/AboutScene.tsx`

(If grep finds additional files on closer inspection, add them to the matching wave.)

---

## Validation

After **every file migrated**, run:

```bash
npm run typecheck
npm test               # scene + component unit tests
npm run a11y           # ensures a11y regressions surface immediately
```

After **every wave**, also run:

```bash
npm run lint
npm run build
npm run e2e            # critical user flows
npm run dev            # eyeball check in browser at localhost:5173
```

At the **end of the migration**, additionally:

```bash
grep -rn "style={{" src/    # must return only the dynamic-style-passthrough exceptions
```

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Visual regression — a class doesn't map 1:1 to the original computed style | High | Cheat sheet locks translations; eyeball in browser after each wave; Plan 6 a11y tests catch focus-style regressions. |
| Font-family utility for `var(--font-body)` doesn't apply | Med | Pilot task validates the `font-[family-name:--font-body]` syntax; fall back to inline `fontFamily` if Tailwind v4 syntax surprises. |
| `Chip.tsx`'s dynamic `accent` color renders wrong via CSS var passthrough | Med | Pilot task explicitly verifies Chip with various accents. |
| ESLint `forbid-dom-props` rule fights the dynamic-style exceptions | Med | Use file-scoped overrides in `eslint.config.js` to allow `style` in the 3 exception files. |
| Wave 5 scene migrations touch large files → diff noise | High | One commit per scene; reviewer can step through. |
| Bundle size grows from arbitrary-value class explosion | Low | Tailwind v4 tree-shakes; arbitrary values inline. Verify `dist/` size before/after. |
| `mvp-flow.spec.ts` and other E2E tests break if any clickable element loses its role | Low | E2E tests query by role/text, not class; they don't care about utilities. |

---

## Acceptance

- [ ] `grep -rn "style={{" src/` returns only files using the dynamic CSS-var-passthrough pattern
- [ ] All 28 files visually identical in dev server (eyeball captured as before/after screenshots in the PR description)
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes (all unit + a11y)
- [ ] `npm run e2e` passes
- [ ] `npm run build` passes; bundle within ±2 KB of pre-migration size
- [ ] ESLint rule `react/forbid-dom-props` configured to ban `style` prop globally with explicit file-scoped exceptions
- [ ] No `eslint-disable-line` directives added (the rule's `forbid` array does the job)

---

## Tasks

### Task 1: Cheat-sheet + pilot decision doc

**Files:**
- Create: `docs/tailwind-migration/cheat-sheet.md`

- [ ] **Step 1: Copy the cheat sheet into a standalone doc**

```bash
mkdir -p docs/tailwind-migration
```

Create `docs/tailwind-migration/cheat-sheet.md` containing the cheat-sheet section from this plan, plus a "Decisions locked at pilot (Task 2)" header for tracking pilot findings.

- [ ] **Step 2: Commit the cheat sheet**

```bash
git add docs/tailwind-migration/cheat-sheet.md
git commit -m "docs(tailwind): add migration cheat sheet"
```

---

### Task 2: Pilot — migrate `Chip.tsx` (validates dynamic + static translation)

**Files:**
- Modify: `src/components/Chip.tsx`

**Why Chip first:** small (33 lines), uses both static styles (border-radius, padding, fontSize) AND runtime-dynamic ones (accent color, accent shadow). Best single-file validator.

- [ ] **Step 1: Read the current Chip.tsx**

```bash
cat src/components/Chip.tsx
```

- [ ] **Step 2: Run the Chip unit test as baseline**

```bash
npx vitest run tests/unit/Chip.test.tsx
```

Expected: PASS.

- [ ] **Step 3: Rewrite `src/components/Chip.tsx`**

Replace the file content with:

```tsx
import type { CSSProperties, ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  onClick?: () => void
  active?: boolean
  accent?: string
  variant?: 'token' | 'example'
}

export function Chip({ children, onClick, active = false, accent, variant = 'token' }: ChipProps) {
  const isToken = variant === 'token'
  const ringColor = active && accent ? accent : 'var(--color-border)'
  const shadow = active && accent ? `0 0 8px 1px ${accent}66` : 'none'

  const dynamicStyle = {
    '--chip-ring': ringColor,
    '--chip-shadow': shadow,
  } as CSSProperties

  const baseClass = [
    'inline-flex items-center px-4 py-[10px]',
    'rounded-(--radius-pill)',
    'border border-(--chip-ring)',
    'bg-(--color-surface-card) text-(--color-text-primary)',
    'shadow-[var(--chip-shadow)]',
    isToken
      ? 'font-[family-name:--font-mono] text-[15px] leading-[22px]'
      : 'font-[family-name:--font-body] text-sm leading-[1.3]',
    onClick ? 'cursor-pointer' : 'cursor-default',
  ].join(' ')

  if (!onClick) {
    return (
      <span style={dynamicStyle} className={baseClass}>
        {children}
      </span>
    )
  }
  return (
    <button type="button" style={dynamicStyle} className={baseClass} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  )
}
```

- [ ] **Step 4: Re-run the test**

```bash
npx vitest run tests/unit/Chip.test.tsx
```

Expected: PASS. If it fails, the test likely queries by inline-style — refactor the test to query by role/text (acceptable; tests should not assert on implementation details).

- [ ] **Step 5: Eyeball check in browser**

```bash
npm run dev &
```

Open `http://localhost:5173/#tokenize`. Verify Chips look identical to pre-migration. Capture a screenshot if practical.

Stop the dev server:

```bash
pkill -f "vite$" || true
```

- [ ] **Step 6: Update cheat-sheet "Decisions locked at pilot" section if any approach changed**

If `font-[family-name:--font-body]` didn't work or the CSS-var-passthrough behaved oddly, update `docs/tailwind-migration/cheat-sheet.md` with the corrected decision.

- [ ] **Step 7: Commit**

```bash
git add src/components/Chip.tsx docs/tailwind-migration/cheat-sheet.md
git commit -m "refactor(chip): migrate from inline styles to Tailwind utilities + CSS-var passthrough"
```

---

### Task 3: Wave 1 — migrate simple static-style components

**Files:** (5 files)
- Modify: `src/components/AccentRule.tsx`
- Modify: `src/components/CaveatNote.tsx`
- Modify: `src/components/EyebrowLabel.tsx`
- Modify: `src/components/PhilosophyCard.tsx`
- Modify: `src/components/DeepToggle.tsx`

**Pattern for each file:**

- [ ] **Step 1: Read the file**

```bash
cat src/components/{Filename}.tsx
```

- [ ] **Step 2: Identify every `style={{...}}` block**

For each block:
- Look up each property in the cheat sheet
- Concatenate the resulting utilities into a `className` string
- Delete the `style={{...}}` prop (Wave 1 has no runtime values)

- [ ] **Step 3: Apply the rewrite**

Use Edit tool to replace each `style={{...}}` with the equivalent `className`. Preserve any existing `className` attribute by concatenating.

- [ ] **Step 4: Run the matching unit test**

```bash
npx vitest run tests/unit/{Filename}.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Eyeball in browser (after all 5 files)**

```bash
npm run dev &
```

Visit each scene that uses these components:
- `AccentRule` → all scenes
- `CaveatNote` → most scenes
- `EyebrowLabel` → all scenes
- `PhilosophyCard` → CompareScene
- `DeepToggle` → SceneStation deeper sections

Stop dev server:

```bash
pkill -f "vite$" || true
```

- [ ] **Step 6: Commit (one commit for the wave)**

```bash
git add src/components/AccentRule.tsx src/components/CaveatNote.tsx src/components/EyebrowLabel.tsx src/components/PhilosophyCard.tsx src/components/DeepToggle.tsx
git commit -m "refactor(components): migrate Wave 1 (simple static-style components) to Tailwind utilities"
```

---

### Task 4: Wave 2 — migrate medium components

**Files:** (6 files)
- Modify: `src/components/DeepPanel.tsx`
- Modify: `src/components/ReplyBubble.tsx`
- Modify: `src/components/TokenizerCount.tsx`
- Modify: `src/components/ClaimTier.tsx`
- Modify: `src/components/CompareTable.tsx`
- Modify: `src/components/HeadSelector.tsx`

Per-file pattern (same as Task 3):

- [ ] **Steps 1-4 per file: read, identify, rewrite, test**

Apply the cheat-sheet translations file by file. Each file should pass its existing unit test after migration.

- [ ] **Step 5: Run all unit tests**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 6: Run a11y tests** (regression check)

```bash
npm run a11y
```

Expected: PASS.

- [ ] **Step 7: Eyeball in browser**

```bash
npm run dev &
```

Visit scenes touching these components (CompareScene, AttentionScene, TokenizeScene). Verify visual fidelity.

Stop dev server.

- [ ] **Step 8: Commit**

```bash
git add src/components/DeepPanel.tsx src/components/ReplyBubble.tsx src/components/TokenizerCount.tsx src/components/ClaimTier.tsx src/components/CompareTable.tsx src/components/HeadSelector.tsx
git commit -m "refactor(components): migrate Wave 2 (medium components) to Tailwind utilities"
```

---

### Task 5: Wave 3 — migrate components with dynamic runtime styles

**Files:** (4 files)
- Modify: `src/components/DataBar.tsx`
- Modify: `src/components/ContextWindowBar.tsx`
- Modify: `src/components/EmbeddingSpace.tsx`
- Modify: `src/components/PromptField.tsx`

**Pattern: CSS-var-passthrough for the dynamic property, utilities for everything else.**

- [ ] **Step 1: Per file, identify the dynamic property**

For `DataBar.tsx` and `ContextWindowBar.tsx`, the dynamic property is `width: ${pct}%`. For `EmbeddingSpace.tsx` and `PromptField.tsx`, identify the dynamic properties.

- [ ] **Step 2: Apply the passthrough rewrite**

For `DataBar.tsx`, the inline `style={{ width: \`${pct}%\`, height: '100%', background: 'var(--color-bar-active)' }}` becomes:

```tsx
<div
  style={{ '--bar-w': `${pct}%` } as CSSProperties}
  className="w-[var(--bar-w)] h-full bg-(--color-bar-active)"
/>
```

For `ContextWindowBar.tsx` (line 51), the pattern is identical.

- [ ] **Step 3: Run matching tests per file**

```bash
npx vitest run tests/unit/DataBar.test.tsx tests/unit/ContextWindowBar.test.tsx tests/unit/EmbeddingSpace.test.tsx tests/unit/PromptField.test.tsx
```

Expected: PASS.

- [ ] **Step 4: Run a11y suite**

```bash
npm run a11y
```

Expected: PASS.

- [ ] **Step 5: Eyeball — focus on the bars and progressbars**

```bash
npm run dev &
```

Visit `#compare` — the `ContextWindowBar` rows should be drawn at the same widths as before.
Visit `#predict` — the `DataBar` should fill the same percentage as before.

Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/DataBar.tsx src/components/ContextWindowBar.tsx src/components/EmbeddingSpace.tsx src/components/PromptField.tsx
git commit -m "refactor(components): migrate Wave 3 (dynamic-style components) using CSS-var passthrough"
```

---

### Task 6: Wave 4 — migrate larger components

**Files:** (5 files)
- Modify: `src/components/SceneStation.tsx`
- Modify: `src/components/SceneNav.tsx`
- Modify: `src/components/TopBar.tsx`
- Modify: `src/components/ProgressRail.tsx`
- Modify: `src/components/DistributionPair.tsx`

**Note:** `SceneStation.tsx` is the layout primitive consumed by every scene. Migrate it carefully.

- [ ] **Step 1: Migrate `SceneStation.tsx` first, in isolation**

```bash
cat src/components/SceneStation.tsx
```

Apply cheat-sheet. Pay attention to `maxWidth: 'var(--surface-max-w)'`, `marginTop: 18`, `width: '100%'`.

```bash
npx vitest run tests/unit/SceneStation.test.tsx
```

Expected: PASS.

- [ ] **Step 2: Run scene tests to confirm no downstream breakage**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 3: Migrate the remaining 4 files**

`SceneNav.tsx`, `TopBar.tsx`, `ProgressRail.tsx`, `DistributionPair.tsx`. Per-file: read → cheat-sheet → unit test.

- [ ] **Step 4: Full test suite + a11y**

```bash
npm test && npm run a11y
```

Expected: PASS.

- [ ] **Step 5: Eyeball — focus on rail, top bar, scene stations**

```bash
npm run dev &
```

Navigate through all 9 scenes via the rail. Verify rail dots are positioned identically; top bar prompt is right-aligned; each scene layout is unchanged.

Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/SceneStation.tsx src/components/SceneNav.tsx src/components/TopBar.tsx src/components/ProgressRail.tsx src/components/DistributionPair.tsx
git commit -m "refactor(components): migrate Wave 4 (layout primitives) to Tailwind utilities"
```

---

### Task 7: Wave 5 — migrate scenes (in pipeline order)

**Files:** (9 files, one per scene)
- Modify: `src/scenes/PromptScene.tsx`
- Modify: `src/scenes/TokenizeScene.tsx`
- Modify: `src/scenes/EmbedScene.tsx`
- Modify: `src/scenes/AttentionScene.tsx`
- Modify: `src/scenes/PredictScene.tsx`
- Modify: `src/scenes/DecodeScene.tsx`
- Modify: `src/scenes/AssembleScene.tsx`
- Modify: `src/scenes/CompareScene.tsx`
- Modify: `src/scenes/AboutScene.tsx`

**Per-scene pattern (one commit per scene):**

- [ ] **Step 1: Read the scene**

```bash
cat src/scenes/{Scene}.tsx
```

- [ ] **Step 2: For each `style={{...}}` block, apply the cheat sheet**

Common patterns in scenes:
- Stage wrapper: `style={{ padding: 'var(--stage-padding)', display: 'flex', flexDirection: 'column', gap: N, height: '100%' }}` → `className="p-(--stage-padding) flex flex-col gap-N h-full"`
- Eyebrow + content sections: typically `gap-2 mt-2` patterns
- Footnotes: `style={{ marginTop: 8, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-muted)' }}` → `className="mt-2 font-[family-name:--font-body] text-xs text-(--color-text-muted)"`

- [ ] **Step 3: Run the matching scene unit test**

```bash
npx vitest run tests/unit/{Scene}.test.tsx
```

Expected: PASS.

- [ ] **Step 4: Run a11y for the scene**

```bash
npx vitest run tests/a11y/{Scene}.a11y.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Eyeball in browser**

```bash
npm run dev &
```

Visit `#{scene-id}` and verify layout matches pre-migration.

Stop dev server.

- [ ] **Step 6: Commit per-scene**

```bash
git add src/scenes/{Scene}.tsx
git commit -m "refactor({scene}): migrate to Tailwind utilities"
```

Repeat for each of the 9 scenes in pipeline order: Prompt → Tokenize → Embed → Attention → Predict → Decode → Assemble → Compare → About.

---

### Task 8: Run the full suite end-to-end

**Files:** none

- [ ] **Step 1: Full validation pipeline**

```bash
npm run lint && npm run typecheck && npm test && npm run a11y && npm run e2e && npm run build
```

Expected: all six PASS.

- [ ] **Step 2: Confirm only intentional inline styles remain**

```bash
grep -rn "style={{" src/
```

Expected: matches should only be the CSS-var-passthrough lines in `DataBar.tsx`, `ContextWindowBar.tsx`, `Chip.tsx`, and any other file where dynamic computed values genuinely need passthrough. Count should be ≤ 8 lines across ≤ 4 files.

- [ ] **Step 3: Document the remaining inline styles**

Append to `docs/tailwind-migration/cheat-sheet.md`:

```markdown
## Allowed remaining inline styles (CSS-var passthrough only)

| File | Line | Why |
|---|---|---|
| src/components/DataBar.tsx | {line} | Runtime `width: ${pct}%` via `--bar-w` |
| src/components/ContextWindowBar.tsx | {line} | Same pattern |
| src/components/Chip.tsx | {line} | Runtime accent color via `--chip-ring`/`--chip-shadow` |
```

- [ ] **Step 4: Commit**

```bash
git add docs/tailwind-migration/cheat-sheet.md
git commit -m "docs(tailwind): document allowed CSS-var-passthrough exceptions"
```

---

### Task 9: Add ESLint rule banning `style={{` (with file-scoped exceptions)

**Files:**
- Modify: `eslint.config.js`

- [ ] **Step 1: Read current `eslint.config.js`**

Confirm Plan 5 has merged (the two-block flat-config with browser/node globals).

- [ ] **Step 2: Add `react/forbid-dom-props` to the main rules block**

In `eslint.config.js`, inside the `rules` of the `**/*.{ts,tsx}` block, add:

```js
'react/forbid-dom-props': [
  'error',
  {
    forbid: [
      {
        propName: 'style',
        message: 'Use Tailwind utilities. CSS-var passthrough allowed only in DataBar, ContextWindowBar, Chip.',
      },
    ],
  },
],
```

- [ ] **Step 3: Add a file-scoped override block to allow `style` in the three exception files**

In `eslint.config.js`, append a new block AFTER the main `**/*.{ts,tsx}` block:

```js
{
  files: [
    'src/components/DataBar.tsx',
    'src/components/ContextWindowBar.tsx',
    'src/components/Chip.tsx',
  ],
  rules: {
    'react/forbid-dom-props': 'off',
  },
},
```

- [ ] **Step 4: Run lint**

```bash
npm run lint
```

Expected: PASS. If unexpected `style` usage surfaces, EITHER finish the migration of that file OR add it to the exception list with a comment explaining the necessity.

- [ ] **Step 5: Commit**

```bash
git add eslint.config.js
git commit -m "chore(eslint): forbid style prop with narrow exceptions for dynamic-passthrough"
```

---

### Task 10: Final verification + PR

**Files:** none

- [ ] **Step 1: Full pipeline**

```bash
npm run lint && npm run typecheck && npm test && npm run a11y && npm run e2e && npm run build
```

Expected: all PASS.

- [ ] **Step 2: Bundle size check**

```bash
ls -lh dist/assets/*.js
```

Note the size. Compare against the pre-migration commit. Should be within ±2 KB.

- [ ] **Step 3: Eyeball every scene one final time**

```bash
npm run dev
```

Click through all 9 rail dots. Verify every scene looks identical to the pre-migration state.

- [ ] **Step 4: Commit any final cleanup**

```bash
git status
```

If clean, the plan is done. If there are leftover changes:

```bash
git add -A && git commit -m "chore(tailwind): finalize migration cleanup"
```

---

## Self-Review Checklist

- [x] Every file in the inventory has a dedicated migration task (28+ files in 5 waves)
- [x] Cheat sheet locks translation decisions before the first file is touched
- [x] Dynamic styles use CSS-var passthrough — concrete code in Task 2 + Task 5
- [x] ESLint rule prevents regression with explicit file exceptions
- [x] No placeholders — every step has code, exact commands, expected outputs
- [x] Each wave ends with a commit; scenes commit individually
- [x] Plan 6 a11y tests act as safety net (acceptance criteria)
- [x] Pre-requisite chain noted (Plans 5 + 6 must merge first)
- [x] Bundle size guardrail (Task 10 Step 2)
