# LLM Explainer — Plan 6: Full A11y Audit + axe-core Integration

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish automated WCAG 2.1 AA regression coverage via axe-core in both unit and E2E test layers, plus document findings from a manual VoiceOver + NVDA walkthrough of every scene. Fix all critical/serious violations.

**Architecture:** Three layers of accessibility coverage:
1. **Unit (vitest-axe):** One a11y smoke test per scene asserting `expect(html).toHaveNoViolations()`.
2. **E2E (`@axe-core/playwright`):** One `AxeBuilder.analyze()` per scene in a new `e2e/a11y.spec.ts`, with rail-driven navigation through all 9 scenes.
3. **Manual (screen-reader audit):** A scripted walkthrough recorded in `docs/a11y/2026-06-01-audit.md` covering reading order, focus traps, label clarity, and dynamic-content announcements.

**Tech Stack:** `vitest-axe` (~60 KB), `@axe-core/playwright` (dev-only, ~250 KB), no production deps.

**Blast radius:** Test-only additions + remediation patches to `src/` for any violations found.

**Pre-requisite:** Plan 5 (ESLint hygiene) merged. Clean lint baseline makes regression noise easier to spot.

---

## Patterns to Mirror

| Category | Source | Pattern |
|---|---|---|
| Test file naming | `tests/unit/CompareScene.test.tsx` | One test file per scene; `describe` block named after component. |
| Setup file extension | `tests/setup.ts:2` | `import '@testing-library/jest-dom/vitest'` already extends `expect`. New `expect.extend(toHaveNoViolations)` goes here. |
| Render helper | `tests/unit/PromptScene.test.tsx` (any scene test) | `render(<Component />)` from `@testing-library/react`, then assert on `container.innerHTML` or query selectors. |
| E2E layout | `e2e/mvp-flow.spec.ts`, `e2e/compare-section.spec.ts` | `test.describe` + `test()`; uses `page.goto('/')`, `page.locator('[data-scene-id="..."]')`. |
| Audit doc location | (new) `docs/a11y/` | Mirror `docs/superpowers/plans/` — date-stamped markdown. |
| Existing a11y primitives | `src/index.css:70-80`, `src/App.tsx:66`, `src/App.tsx:72` | Skip link is already present; `aria-label` on `<main className="stations">`. Don't break these. |

---

## Files to Change

| File | Action | Why |
|---|---|---|
| `package.json` | UPDATE | Add `vitest-axe`, `@axe-core/playwright` to devDeps + add `a11y` + `a11y:e2e` scripts |
| `tests/setup.ts` | UPDATE | Register `toHaveNoViolations` matcher |
| `tests/a11y/PromptScene.a11y.test.tsx` | CREATE | Per-scene unit-level axe smoke test |
| `tests/a11y/TokenizeScene.a11y.test.tsx` | CREATE | (same) |
| `tests/a11y/EmbedScene.a11y.test.tsx` | CREATE | (same) |
| `tests/a11y/AttentionScene.a11y.test.tsx` | CREATE | (same) |
| `tests/a11y/PredictScene.a11y.test.tsx` | CREATE | (same) |
| `tests/a11y/DecodeScene.a11y.test.tsx` | CREATE | (same) |
| `tests/a11y/AssembleScene.a11y.test.tsx` | CREATE | (same) |
| `tests/a11y/CompareScene.a11y.test.tsx` | CREATE | (same) |
| `tests/a11y/AboutScene.a11y.test.tsx` | CREATE | (same) |
| `tests/a11y/App.a11y.test.tsx` | CREATE | Whole-app shell axe test |
| `e2e/a11y.spec.ts` | CREATE | E2E axe scan walking through all 9 scenes |
| `docs/a11y/2026-06-01-audit.md` | CREATE | Screen-reader walkthrough findings doc |
| `src/**` (TBD per audit) | UPDATE | Remediation patches for any axe violations |

---

## Validation

```bash
npm test                              # vitest run — all unit + a11y unit tests must pass
npm run a11y                          # new script: vitest run tests/a11y/
npx playwright test e2e/a11y.spec.ts  # E2E axe scan
npm run lint                          # must remain green
npm run typecheck                     # must remain green
```

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| `vitest-axe` may not be fully compatible with React 19 | Med | Pin to the latest version; if it fails, fall back to `axe-core` + a hand-rolled matcher (the matcher is ~10 lines). |
| Existing components have many violations → migration scope explodes | High | Triage: fix all `serious`/`critical`; document `moderate`/`minor` as follow-ups. Don't gate the plan on minors. |
| jsdom rendering misses some violations | Med | E2E layer (real browser) catches what jsdom misses; the two layers complement each other. |
| Color-contrast checks fail in jsdom (no computed CSS) | High (known limitation) | Disable `color-contrast` rule in unit tests; rely on E2E + manual for contrast. |
| Manual screen-reader walkthrough is time-consuming | Med | Scripted checklist in audit doc keeps it bounded to ~30 min per scene. |
| Fixing keyboard-trap issues touches keyboard-nav code | Low | Existing `useKeyboardNav` hook handles arrow keys; tab order should be DOM order. Audit before refactoring. |

---

## Acceptance

- [ ] All 10 unit a11y tests pass (1 per scene + 1 app shell)
- [ ] E2E axe smoke test passes for all 9 scenes
- [ ] Audit doc (`docs/a11y/2026-06-01-audit.md`) created with VoiceOver findings (+ NVDA if accessible)
- [ ] All `serious`/`critical` axe violations fixed
- [ ] All `moderate` violations either fixed or logged in audit doc as follow-up
- [ ] `npm run a11y` + `npm run a11y:e2e` scripts available
- [ ] No regressions in existing tests
- [ ] Skip link still works (verified in audit doc)
- [ ] Reduced-motion preference still respected (existing `prefers-reduced-motion` CSS)

---

## Tasks

### Task 1: Install a11y test dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install both packages**

Run:

```bash
npm install --save-dev vitest-axe @axe-core/playwright
```

Expected: both appear in devDependencies.

- [ ] **Step 2: Verify React 19 compatibility**

Run:

```bash
npm ls vitest-axe @axe-core/playwright react
```

Expected: no peer-dependency warnings. If `vitest-axe` errors on React 19, fall back to importing `axe` from `axe-core` directly and write a 10-line matcher in `tests/setup.ts`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(a11y): add vitest-axe + @axe-core/playwright devDeps"
```

---

### Task 2: Extend test setup with `toHaveNoViolations` matcher

**Files:**
- Modify: `tests/setup.ts`

- [ ] **Step 1: Update `tests/setup.ts`**

The final `tests/setup.ts` should look like:

```ts
import '@testing-library/jest-dom/vitest'
import { afterEach, expect } from 'vitest'
import { cleanup } from '@testing-library/react'
import { toHaveNoViolations } from 'vitest-axe/matchers'
import 'vitest-axe/extend-expect'

afterEach(() => cleanup())

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
})

Element.prototype.scrollIntoView = function () {}

expect.extend({ toHaveNoViolations })
```

(Note: the `/* eslint-disable no-undef */` directive should already be gone after Plan 5 Task 6.)

- [ ] **Step 2: Verify existing tests still pass**

Run:

```bash
npm test
```

Expected: PASS. The matcher registration shouldn't break any existing assertions.

- [ ] **Step 3: Commit**

```bash
git add tests/setup.ts
git commit -m "test(a11y): register toHaveNoViolations matcher in setup"
```

---

### Task 3: Write the first a11y test (PromptScene)

**Files:**
- Create: `tests/a11y/PromptScene.a11y.test.tsx`

- [ ] **Step 1: Create the test directory + file**

```bash
mkdir -p tests/a11y
```

Create `tests/a11y/PromptScene.a11y.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { PromptScene } from '@/scenes/PromptScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

describe('PromptScene a11y', () => {
  it('has no axe violations (serious/critical)', async () => {
    const { container } = render(
      <RunningExampleProvider>
        <DepthProvider>
          <PromptScene />
        </DepthProvider>
      </RunningExampleProvider>,
    )

    const results = await axe(container, {
      rules: {
        // jsdom can't compute real CSS — defer color-contrast to E2E
        'color-contrast': { enabled: false },
      },
    })

    expect(results).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run the test to see baseline**

Run:

```bash
npx vitest run tests/a11y/PromptScene.a11y.test.tsx
```

Expected: either PASS (no violations) or FAIL with a list of axe violations to fix.

- [ ] **Step 3: Triage any violations**

If the test fails, create `docs/a11y/2026-06-01-audit.md` (create the dir + file). For each violation row:
- Impact = `critical` or `serious` → must fix before plan ships
- Impact = `moderate` or `minor` → log as follow-up

Initial audit doc structure:

```markdown
# Accessibility Audit — LLM Explainer (2026-06-01)

**Tools:** axe-core 4.x (unit + E2E), VoiceOver 10 (macOS)
**Coverage:** WCAG 2.1 AA
**Scope:** 9 pipeline scenes + app shell

## Findings by scene

### PromptScene

| Rule | Impact | Element | Fix |
|---|---|---|---|
| {rule-id} | {impact} | {selector} | {fix} |
```

- [ ] **Step 4: Commit (test, even if currently failing — failures drive fixes)**

```bash
git add tests/a11y/PromptScene.a11y.test.tsx docs/a11y/2026-06-01-audit.md
git commit -m "test(a11y): add axe smoke test for PromptScene"
```

---

### Task 4: Add a11y tests for the remaining 8 scenes

**Files:** (8 new test files)

- [ ] **Step 1: Create one test per scene using this template**

For each scene in {Tokenize, Embed, Attention, Predict, Decode, Assemble, Compare, About}, create `tests/a11y/{Scene}Scene.a11y.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { {Scene}Scene } from '@/scenes/{Scene}Scene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

describe('{Scene}Scene a11y', () => {
  it('has no axe violations (serious/critical)', async () => {
    const { container } = render(
      <RunningExampleProvider>
        <DepthProvider>
          <{Scene}Scene />
        </DepthProvider>
      </RunningExampleProvider>,
    )

    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: false } },
    })

    expect(results).toHaveNoViolations()
  })
})
```

Substitute `{Scene}` with each name. Create all 8 files.

- [ ] **Step 2: Run all a11y tests**

Run:

```bash
npx vitest run tests/a11y/
```

Expected: 9 tests run. Some may FAIL — each failure becomes a remediation task.

- [ ] **Step 3: Append all violations to the audit doc**

For each failing test, append a section to `docs/a11y/2026-06-01-audit.md` using the format from Task 3.

- [ ] **Step 4: Commit the test files (even with failures)**

```bash
git add tests/a11y/ docs/a11y/2026-06-01-audit.md
git commit -m "test(a11y): add axe smoke tests for remaining 8 scenes"
```

---

### Task 5: Add app-shell a11y test

**Files:**
- Create: `tests/a11y/App.a11y.test.tsx`

- [ ] **Step 1: Create the test**

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { App } from '@/App'

describe('App shell a11y', () => {
  it('has no axe violations (serious/critical)', async () => {
    const { container } = render(<App />)

    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: false } },
    })

    expect(results).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run**

```bash
npx vitest run tests/a11y/App.a11y.test.tsx
```

Expected: PASS or surface shell-level issues (landmarks, heading hierarchy, focus indicator).

- [ ] **Step 3: Commit**

```bash
git add tests/a11y/App.a11y.test.tsx
git commit -m "test(a11y): add app-shell axe smoke test"
```

---

### Task 6: Fix all `serious` and `critical` violations from the unit suite

**Files:**
- Modify: `src/**` (varies per violation)
- Modify: `docs/a11y/2026-06-01-audit.md`

- [ ] **Step 1: Read the audit doc; list all serious/critical**

Read `docs/a11y/2026-06-01-audit.md`. For each row with impact = `critical` or `serious`:
- Identify the target file and element
- Apply the minimal fix. Common fixes:
  - **`button-name`** → add visible text or `aria-label`
  - **`label`** → wrap inputs in `<label>` or use `aria-label`
  - **`heading-order`** → ensure h1 → h2 → h3 progression; use `<h2 className="sr-only">` or restructure
  - **`landmark-one-main`** → already covered by `<main aria-label="LLM pipeline scenes">` in App.tsx
  - **`region`** → wrap each scene's content in a `<section aria-labelledby="...">` (likely already done via SceneStation; verify)
  - **`color-contrast`** (E2E only) → adjust token in `src/index.css`

- [ ] **Step 2: Re-run a11y suite after each fix**

Run after each file edit:

```bash
npx vitest run tests/a11y/
```

Expected: progressively fewer failures.

- [ ] **Step 3: Verify all other tests still pass**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 4: Update audit doc — mark each fix as resolved**

In `docs/a11y/2026-06-01-audit.md`, append a "Resolved" column or strike-through resolved rows.

- [ ] **Step 5: Commit (one commit per scene fixed, to keep history scannable)**

For each scene where fixes were applied:

```bash
git add src/scenes/{Scene}.tsx src/components/{any-touched}.tsx docs/a11y/2026-06-01-audit.md
git commit -m "fix(a11y): resolve axe violations in {Scene}"
```

---

### Task 7: Add E2E axe scan covering all scenes

**Files:**
- Create: `e2e/a11y.spec.ts`

- [ ] **Step 1: Create the E2E spec**

```ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const SCENE_IDS = [
  'prompt',
  'tokenize',
  'embed',
  'attention',
  'predict',
  'decode',
  'output',
  'compare',
  'about',
] as const

test.describe('a11y — full pipeline', () => {
  for (const id of SCENE_IDS) {
    test(`${id} scene has no critical/serious axe violations`, async ({ page }) => {
      await page.goto(`/#${id}`)
      await page.waitForLoadState('networkidle')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      const blocking = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      )

      if (blocking.length > 0) {
        console.error(`Violations in ${id}:`, JSON.stringify(blocking, null, 2))
      }

      expect(blocking).toEqual([])
    })
  }
})
```

- [ ] **Step 2: Run the E2E spec**

```bash
npx playwright test e2e/a11y.spec.ts
```

Expected: 9 tests run. Each scene scanned in a real browser. Failures dump violations to console.

- [ ] **Step 3: Triage any E2E-only violations (typically color-contrast)**

Append findings to `docs/a11y/2026-06-01-audit.md` under a new "E2E findings" section. Fix critical/serious in same iterative loop as Task 6.

- [ ] **Step 4: Re-run until green**

```bash
npx playwright test e2e/a11y.spec.ts
```

Expected: PASS for all 9 scenes.

- [ ] **Step 5: Commit**

```bash
git add e2e/a11y.spec.ts docs/a11y/2026-06-01-audit.md
git commit -m "test(a11y): add E2E axe scan across all 9 scenes"
```

---

### Task 8: Manual VoiceOver walkthrough → audit doc

**Files:**
- Modify: `docs/a11y/2026-06-01-audit.md`

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Note the URL (typically `http://localhost:5173`).

- [ ] **Step 2: VoiceOver walkthrough (macOS)**

Enable VoiceOver (Cmd+F5). For each of the 9 scenes, capture in the audit doc:

```markdown
## {Scene} — VoiceOver findings

- **Reading order:** {observation}
- **Headings:** {observation — can H key jump cleanly?}
- **Interactive elements:** {observation — buttons/links labeled?}
- **Dynamic content:** {observation — state changes announced?}
- **Skip link:** {does it work?}
- **Issues to fix:** {list}
```

Walk through:
- Reading order (logical?)
- Landmarks (main, navigation announced?)
- Heading jumps (H key)
- Interactive elements (buttons, links labeled meaningfully?)
- Dynamic content (state changes announced?)
- Skip link

- [ ] **Step 3: NVDA walkthrough (Windows or VM) — optional**

If access to a Windows machine or VM is available, repeat Step 2 with NVDA. Otherwise, note in the audit doc: "NVDA walkthrough deferred — VoiceOver coverage applied as proxy."

- [ ] **Step 4: Compile prioritized fix list**

Append to audit doc:

```markdown
## Manual audit — prioritized fixes

| Severity | Issue | Scene | Proposed fix |
|---|---|---|---|
| {high/med/low} | {description} | {scene} | {fix} |
```

- [ ] **Step 5: Apply high-severity fixes**

For each "high" row, edit the relevant source file. Common manual-audit fixes:
- Missing `aria-live="polite"` for dynamic regions (e.g. predicted-next-token display)
- Wrong `aria-pressed` semantics on toggle buttons
- Missing `aria-current="step"` on the active rail dot
- Decorative SVGs missing `aria-hidden="true"`

After each fix:

```bash
npm test && npm run a11y
```

- [ ] **Step 6: Commit**

```bash
git add src/ docs/a11y/2026-06-01-audit.md
git commit -m "fix(a11y): resolve high-severity findings from VoiceOver walkthrough"
```

---

### Task 9: Add `npm run a11y` scripts + final verification

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add the scripts**

Edit `package.json` — add to the `"scripts"` block:

```json
"a11y": "vitest run tests/a11y/",
"a11y:e2e": "playwright test e2e/a11y.spec.ts"
```

The full scripts section should look approximately like:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "preview": "vite preview",
  "typecheck": "tsc --noEmit && tsc --noEmit -p tsconfig.node.json",
  "lint": "eslint .",
  "format": "prettier --write \"src/**/*.{ts,tsx,css,json,md}\"",
  "test": "vitest run --passWithNoTests",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage --passWithNoTests",
  "e2e": "playwright test",
  "a11y": "vitest run tests/a11y/",
  "a11y:e2e": "playwright test e2e/a11y.spec.ts"
}
```

- [ ] **Step 2: Run the new scripts**

```bash
npm run a11y
npm run a11y:e2e
```

Expected: both PASS.

- [ ] **Step 3: Full validation pipeline**

```bash
npm run lint && npm run typecheck && npm test && npm run a11y && npm run build
```

Expected: all five PASS.

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "chore(a11y): add npm run a11y + a11y:e2e scripts"
```

---

### Task 10: Final audit-doc polish + plan close

**Files:**
- Modify: `docs/a11y/2026-06-01-audit.md`

- [ ] **Step 1: Add a top-level summary section to the audit doc**

Prepend to the file:

```markdown
# Accessibility Audit — LLM Explainer (2026-06-01)

**Tools:** axe-core 4.x (unit + E2E), VoiceOver 10 (macOS), NVDA (Windows — if applicable)
**Coverage:** WCAG 2.1 AA
**Scope:** 9 pipeline scenes + app shell

## Summary

| Severity | Found | Fixed | Deferred |
|---|---|---|---|
| Critical | {n} | {n} | 0 |
| Serious | {n} | {n} | 0 |
| Moderate | {n} | {n} | {n} |
| Minor | {n} | {n} | {n} |

**Status:** All critical/serious resolved. Moderate/minor items logged in "Deferred" section.

## Deferred follow-ups

- [ ] {issue} ({scene}) — owner: TBD

---
```

Fill in the actual counts from axe runs.

- [ ] **Step 2: Final commit**

```bash
git add docs/a11y/2026-06-01-audit.md
git commit -m "docs(a11y): finalize audit summary + deferred follow-ups"
```

---

## Self-Review Checklist

- [x] axe-core integrated at both unit and E2E layers
- [x] Per-scene + app-shell coverage (10 unit tests + 9 E2E tests)
- [x] Manual screen-reader walkthrough documented
- [x] Audit doc captures every finding with severity + fix status
- [x] `npm run a11y` script exposes the new suite
- [x] No placeholders — every task has concrete steps + expected output
- [x] Each task ends with a commit
- [x] Color-contrast deferred to E2E (jsdom limitation explicitly noted)
