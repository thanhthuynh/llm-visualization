# LLM Explainer — Plan 5: ESLint Config Hygiene

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace per-file `/* eslint-disable no-undef */` escape hatches with a proper Node globals config block, and add `.vite` to ignores. No production-code changes — purely tooling.

**Architecture:** Split the flat-config into two file-scoped blocks: (1) app/test sources use `globals.browser`, (2) build/test config files use `globals.node`. Source the globals from the `globals` npm package (the canonical ESLint v9 way). Add `.vite` (Vite cache dir) to the top-level ignore list.

**Tech Stack:** ESLint v9 flat config, `globals` npm package (~5 KB), zero runtime impact.

**Blast radius:** Tooling-only. No `src/` files touched. No tests added.

---

## Patterns to Mirror

| Category | Source | Pattern |
|---|---|---|
| Flat-config structure | `eslint.config.js:10-40` | Array of objects, each scoped by `files` + `ignores`; rules merged inline. |
| Ignore list location | `eslint.config.js:11` | First entry: `{ ignores: [...] }`. |
| Globals declaration | `eslint.config.js:18` | Inline `globals: { window: 'readonly', ... }`. We'll replace with `...globals.browser` / `...globals.node` spreads. |
| Disable directives to remove | `vite.config.ts:1`, `vitest.config.ts:1`, `playwright.config.ts:1`, `tests/setup.ts:1` | All four start with `/* eslint-disable no-undef */`. |

---

## Files to Change

| File | Action | Why |
|---|---|---|
| `package.json` | UPDATE | Add `globals` to devDependencies |
| `eslint.config.js` | UPDATE | Add `.vite` to ignores; add Node globals block; replace inline browser globals with `globals.browser` spread |
| `vite.config.ts` | UPDATE | Remove `/* eslint-disable no-undef */` |
| `vitest.config.ts` | UPDATE | Remove `/* eslint-disable no-undef */` |
| `playwright.config.ts` | UPDATE | Remove `/* eslint-disable no-undef */` (if present) |
| `tests/setup.ts` | UPDATE | Remove `/* eslint-disable no-undef */` |

---

## Validation

```bash
npm run lint        # eslint . — must pass with zero warnings/errors
npm run typecheck   # tsc --noEmit — must remain green
npm test            # vitest run — all existing tests must pass
npm run build       # vite build — must produce dist/ as before
```

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| `globals` package adds noise to `node_modules` | Low | It's ~5 KB and a stable, widely-used package; documented dependency. |
| Removing `eslint-disable no-undef` from `tests/setup.ts` surfaces real `window`/`Element` lint errors | Med | The new `**/*.{ts,tsx}` block grants `globals.browser` (window, document, Element, Object); verify lint after removal. |
| `playwright.config.ts` may use Node-only APIs (`process.env`, `__dirname`) | High | The `**/*.config.{ts,js}` block uses `globals.node` so Node globals resolve. |
| Adding `.vite` to ignores could mask a real cache-related lint issue | Low | `.vite` is a build cache and never contains hand-written code; safe to ignore. |

---

## Acceptance

- [ ] All four disable directives removed
- [ ] `npm run lint` passes with zero output
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes
- [ ] `npm run build` produces a valid bundle
- [ ] `.vite` listed in ignores
- [ ] `globals` package version pinned in `package.json`

---

## Tasks

### Task 1: Install the `globals` package

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install as devDependency**

Run:

```bash
npm install --save-dev globals
```

Expected: `globals` appears under `devDependencies` in `package.json` with a version like `^15.x.x` or `^16.x.x`.

- [ ] **Step 2: Verify package.json updated**

Run:

```bash
grep '"globals":' package.json
```

Expected: one match showing the new dependency line.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(eslint): add globals package for proper env globals"
```

---

### Task 2: Update `eslint.config.js` — add `.vite` to ignores, split into two file-scoped blocks

**Files:**
- Modify: `eslint.config.js`

- [ ] **Step 1: Confirm current config**

Run:

```bash
cat eslint.config.js
```

Expected: shows existing config with inline `globals: { window: 'readonly', ... }` and no `.vite` in ignores.

- [ ] **Step 2: Rewrite `eslint.config.js`**

Replace the entire file with:

```js
import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  { ignores: ['dist', 'node_modules', 'coverage', 'playwright-report', '.vite'] },
  js.configs.recommended,

  // App + test source: browser env
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['*.config.{ts,js,mjs}', '**/*.config.{ts,js,mjs}', 'eslint.config.js'],
    languageOptions: {
      parser: tsparser,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'react-refresh': reactRefresh,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Build / test config files: node env
  {
    files: ['*.config.{ts,js,mjs}', '**/*.config.{ts,js,mjs}', 'eslint.config.js'],
    languageOptions: {
      parser: tsparser,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      globals: { ...globals.node },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },

  prettier,
]
```

- [ ] **Step 3: Verify lint still passes (with disable directives still in place)**

Run:

```bash
npm run lint
```

Expected: PASS (zero errors). If new errors appear, they're real issues — fix before continuing.

- [ ] **Step 4: Commit**

```bash
git add eslint.config.js
git commit -m "chore(eslint): add .vite to ignores; split browser/node globals via globals pkg"
```

---

### Task 3: Remove `/* eslint-disable no-undef */` from `vite.config.ts`

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Remove the disable directive**

Edit `vite.config.ts` — delete line 1 (the `/* eslint-disable no-undef */` comment). The file should start directly with `import { defineConfig } from 'vite'`.

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint -- vite.config.ts
```

Expected: PASS. `__dirname` should resolve via `globals.node`.

- [ ] **Step 3: Verify typecheck**

Run:

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 4: Verify build still works**

Run:

```bash
npm run build
```

Expected: PASS. Bundle produced in `dist/`.

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts
git commit -m "chore(eslint): drop disable-no-undef in vite.config — node globals cover it"
```

---

### Task 4: Remove `/* eslint-disable no-undef */` from `vitest.config.ts`

**Files:**
- Modify: `vitest.config.ts`

- [ ] **Step 1: Remove the disable directive**

Edit `vitest.config.ts` — delete line 1.

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint -- vitest.config.ts
```

Expected: PASS.

- [ ] **Step 3: Run tests**

Run:

```bash
npm test
```

Expected: PASS — all unit tests pass.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts
git commit -m "chore(eslint): drop disable-no-undef in vitest.config"
```

---

### Task 5: Remove `/* eslint-disable no-undef */` from `playwright.config.ts`

**Files:**
- Modify: `playwright.config.ts`

- [ ] **Step 1: Read the file to verify the directive exists**

Run:

```bash
head -3 playwright.config.ts
```

Expected: first line is `/* eslint-disable no-undef */`. If it's not there, mark this task done and skip remaining steps.

- [ ] **Step 2: Remove the disable directive**

Edit `playwright.config.ts` — delete line 1.

- [ ] **Step 3: Run lint**

Run:

```bash
npm run lint -- playwright.config.ts
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts
git commit -m "chore(eslint): drop disable-no-undef in playwright.config"
```

---

### Task 6: Remove `/* eslint-disable no-undef */` from `tests/setup.ts`

**Files:**
- Modify: `tests/setup.ts`

- [ ] **Step 1: Inspect the setup file**

Read `tests/setup.ts`. Confirm line 1 is `/* eslint-disable no-undef */` and that the file uses `window`, `Element`, `Object` (browser globals).

- [ ] **Step 2: Remove the directive**

Edit `tests/setup.ts` — delete line 1. The file should now start with `import '@testing-library/jest-dom/vitest'`.

- [ ] **Step 3: Run lint**

Run:

```bash
npm run lint -- tests/setup.ts
```

Expected: PASS. `window`, `Element`, `Object` resolve via `globals.browser`.

- [ ] **Step 4: Run tests**

Run:

```bash
npm test
```

Expected: PASS — all tests still green.

- [ ] **Step 5: Commit**

```bash
git add tests/setup.ts
git commit -m "chore(eslint): drop disable-no-undef in tests/setup — browser globals cover it"
```

---

### Task 7: Final verification

**Files:** none

- [ ] **Step 1: Run all four validation commands in sequence**

Run:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

Expected: all four commands PASS in a single pipeline.

- [ ] **Step 2: Confirm no stray disable directives remain**

Run:

```bash
grep -rn "eslint-disable no-undef" . --include="*.ts" --include="*.tsx" --include="*.js" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.vite
```

Expected: zero matches.

- [ ] **Step 3: Confirm `.vite` is in ignores**

Run:

```bash
grep "'\.vite'" eslint.config.js
```

Expected: one match in the ignores list.

- [ ] **Step 4: Final commit (if there are any leftover changes)**

```bash
git status
# Should be clean. If not:
git add -A && git commit -m "chore(eslint): finalize hygiene cleanup"
```

---

## Self-Review Checklist

- [x] Every spec point addressed (`.vite` ignore: Task 2; `globals.node` instead of disable: Tasks 1, 2, 3, 4, 5, 6)
- [x] No "TBD" / "implement later" placeholders
- [x] Each task ends with a commit
- [x] Each step lists exact commands with expected output
- [x] Flat-config keys match ESLint v9 documented shape
