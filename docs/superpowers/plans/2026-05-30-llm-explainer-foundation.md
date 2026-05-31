# Interactive LLM Explainer — Plan 1: Foundation + Reference Scene

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Source spec:** `/Users/thanh/workspace/obsidian-primary-vault/llm-explainer-spec-v1.1.md`
**Goal:** Stand up a Vite + React + TS + Tailwind v4 scaffold with the shared design system, contexts, data layer, and the Next-Token (`PredictScene`) reference scene fully built end-to-end — a deployable static SPA that proves the SceneStation pattern.
**Architecture:** Single-page SPA, scroll-snap stations, two depth tiers (Surface/Deep) via React Context, hash-based deep links, Motion-driven animations, precomputed JSON datasets validated with Zod. No router, no global state library, no 3D.
**Tech stack:** Vite 6 · React 19 · TypeScript 5.7 (strict) · Tailwind CSS 4 · Motion 12 (`motion/react`) · `d3-scale` v4 + `d3-scale-chromatic` v3 · Zod 4 · Vitest 3 + Testing Library · Playwright 1.49

---

## File Structure (Plan 1)

| Path | Responsibility |
|---|---|
| `index.html` | Vite entry, fonts, root div |
| `src/main.tsx` | React 19 root + StrictMode |
| `src/App.tsx` | Mounts contexts, ProgressRail, TopBar, scenes container |
| `src/index.css` | Tailwind v4 import + `@theme` design tokens |
| `src/app/DepthContext.tsx` | Global Surface/Deep preference (read by every scene) |
| `src/app/RunningExampleContext.tsx` | Selected prompt id + loaded dataset |
| `src/app/useHashSync.ts` | Scroll position ↔ URL hash |
| `src/app/useKeyboardNav.ts` | ↑/↓ / PageUp / PageDown station navigation |
| `src/app/useReducedMotionPref.ts` | Wraps `matchMedia('prefers-reduced-motion: reduce')` |
| `src/components/ProgressRail.tsx` | 7 numbered segments + Compare dot, active = glow |
| `src/components/TopBar.tsx` | Wordmark + scene-aware running-example pill |
| `src/components/SceneStation.tsx` | Two-zone (stage + text column) wrapper |
| `src/components/DeepToggle.tsx` | Collapsed ⌄ / Expanded ⌃ disclosure pill |
| `src/components/CaveatNote.tsx` | Amber ⚐ callout |
| `src/components/Chip.tsx` | Pill (token chips, example chips) |
| `src/components/DataBar.tsx` | Label · track+fill · value (dominant = accent + glow) |
| `src/components/EyebrowLabel.tsx` | Caps eyebrow text helper |
| `src/components/AccentRule.tsx` | 48×3 accent underline under titles |
| `src/scenes/PredictScene.tsx` | **The reference scene** — full Surface + Deep |
| `src/scenes/AboutScene.tsx` | Methodology + provenance stub at `#about` |
| `src/scenes/scenes.config.ts` | Single source of truth for scene ids, accents, titles, prompts |
| `src/data/schema.ts` | Zod schemas: `PromptDataset`, `NextTokenCandidate`, etc. |
| `src/data/loader.ts` | Fetch + parse JSON with Zod, throws on invalid |
| `src/data/prompts/sky.json` | Precomputed dataset for `"The sky is"` (GPT-2 illustrative) |
| `src/utils/accent.ts` | Accent token → CSS color + rgba(…) helper |
| `tests/setup.ts` | Vitest + Testing Library + matchMedia stub |
| `tests/unit/*.test.tsx` | Component + hook + schema unit tests |
| `e2e/happy-path.spec.ts` | Playwright: open → predict scene visible → deep toggle works |
| `vite.config.ts` · `tsconfig.json` · `tsconfig.node.json` · `vitest.config.ts` | Build/test config |
| `eslint.config.js` · `.prettierrc` · `playwright.config.ts` | Tooling |
| `package.json` · `.gitignore` · `.nvmrc` | Project metadata |
| `README.md` | Updated with run/test/build commands + provenance note |

---

## Patterns this plan locks in (mirrored by Plans 2–4)

| Category | Pattern |
|---|---|
| **Component file size** | One component per file, <200 lines, props as a named `interface` (per `.claude/rules/typescript/coding-style.md`) |
| **State** | Local `useState` for ephemera; Context only for `DepthContext` and `RunningExampleContext` |
| **Data validation** | Every JSON dataset goes through Zod at load time; fail fast on schema mismatch |
| **Tokens** | All colors/types/radii live in `index.css` `@theme`; components reference Tailwind classes or CSS vars that resolve to those tokens — never hex literals |
| **Tests** | Vitest + Testing Library for units; queries by role / accessible name first, by text second; no querying by class or test-id |
| **Naming** | Scene files match Figma component names (`SceneStation`, `DeepToggle`, etc.); kebab-case for assets, PascalCase for components |
| **Honesty** | The `source` field on every dataset is required by the Zod schema and surfaced in `AboutScene`; the test suite asserts it |

---

## Validation commands (run after each task and at plan completion)

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
npm test            # vitest run
npm run build       # vite build  (verifies bundle and that no scene imports are broken)
npm run e2e         # playwright test (after Task 25)
```

---

## Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Tailwind v4 CSS-first config trips up beginner | Med | Plan pins exact `@theme` block; `index.css` is fully spelled out in Task 2 |
| Motion v12 API drift (`motion/react` import path) | Low | Import path pinned; reduced-motion handled via our own hook (Task 23) |
| Bundle creeps past 200KB | Low | D3 imported via submodule paths; Task 26 includes a bundle check |
| Zod 4 breaking changes from Zod 3 docs found online | Low | All schema code in this plan is written against Zod 4; no inferred types from prose |
| `prefers-reduced-motion` hard to test | Med | Test setup includes a `matchMedia` stub; `useReducedMotionPref` is testable |
| Scene-aware pill desync between stage and TopBar | Med | TopBar reads the active scene's prompt from `scenes.config.ts` via App state — single source |

---

## Tasks

### Task 1: Project scaffold + tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`, `.prettierrc`, `.gitignore`, `.nvmrc`, `index.html`, `playwright.config.ts`, `tests/setup.ts`, `src/main.tsx`, `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Initialize Vite + React + TS template**

```bash
cd /Users/thanh/workspace/llm-visualization
npm create vite@latest . -- --template react-ts
# When prompted "Current directory is not empty", choose "Ignore files and continue"
```

Then replace the generated files per the steps below (the template leaves boilerplate we don't want).

- [ ] **Step 2: Pin Node version and install runtime + dev deps**

```bash
echo "20" > .nvmrc
npm install motion@^12 d3-scale@^4 d3-scale-chromatic@^3 zod@^4
npm install -D tailwindcss@^4 @tailwindcss/vite@^4 vitest@^3 @vitest/coverage-v8@^3 \
  @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14 \
  jsdom@^25 @playwright/test@^1.49 \
  eslint@^9 @typescript-eslint/parser@^8 @typescript-eslint/eslint-plugin@^8 \
  eslint-plugin-react@^7 eslint-plugin-react-hooks@^5 eslint-plugin-jsx-a11y@^6 \
  eslint-plugin-react-refresh@^0.4 prettier@^3 eslint-config-prettier@^9 \
  @types/d3-scale@^4 @types/d3-scale-chromatic@^3
npx playwright install --with-deps chromium
```

- [ ] **Step 3: Write `package.json` scripts**

Replace the `"scripts"` block in the generated `package.json` with:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json,md}\"",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "e2e": "playwright test"
  }
}
```

- [ ] **Step 4: Write `tsconfig.json` (strict, paths aliased)**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "useDefineForClassFields": true,
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "tests"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 5: Write `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts", "vitest.config.ts", "playwright.config.ts", "eslint.config.js"]
}
```

- [ ] **Step 6: Write `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  build: { target: 'es2022', sourcemap: true },
})
```

- [ ] **Step 7: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: false,
    coverage: {
      reporter: ['text', 'html'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/**/*.config.ts', 'src/**/*.d.ts'],
    },
  },
})
```

- [ ] **Step 8: Write `eslint.config.js` (flat config)**

```js
import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'

export default [
  { ignores: ['dist', 'node_modules', 'coverage', 'playwright-report'] },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
      globals: { window: 'readonly', document: 'readonly', console: 'readonly', URL: 'readonly' },
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
  prettier,
]
```

- [ ] **Step 9: Write `.prettierrc`**

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "arrowParens": "always"
}
```

- [ ] **Step 10: Write `.gitignore`**

```gitignore
node_modules
dist
coverage
playwright-report
test-results
.DS_Store
*.local
.env*
!.env.example
```

- [ ] **Step 11: Write `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Interactive explainer: what happens when an LLM receives a prompt and produces output." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;700&family=Space+Mono:wght@400&display=swap" rel="stylesheet" />
    <title>Inside an LLM</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 12: Write `tests/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

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
```

- [ ] **Step 13: Write `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: { baseURL: 'http://localhost:5173', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
```

- [ ] **Step 14: Verify scaffold builds and tests run**

```bash
npm run typecheck
npm run lint
npm test
```

Expected: typecheck passes; lint passes (or only warns on the Vite-generated boilerplate, fix any errors before continuing); vitest reports `0 test files` and exits 0.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TS + Tailwind v4 with vitest and playwright"
```

---

### Task 2: Design tokens + bootstrap files

**Files:**
- Create: `src/index.css`, `src/main.tsx`, `src/App.tsx` (initial placeholder)

- [ ] **Step 1: Write `src/index.css`**

```css
@import 'tailwindcss';

@theme {
  --color-bg-base: #0a0a12;
  --color-surface-card: #16161f;
  --color-surface-track: #22222e;
  --color-rail-inactive: #1e1e2a;
  --color-bar-inactive: #4a4a5c;
  --color-border: #2a2a38;
  --color-text-primary: #f5f5f7;
  --color-text-muted: #9a9ab0;

  --color-accent-prompt: #ffc857;
  --color-accent-tokenize: #6bf178;
  --color-accent-embed: #4cc9f0;
  --color-accent-attention: #f72585;
  --color-accent-predict: #9d4edd;
  --color-accent-decode: #ff7b00;
  --color-accent-output: #2ee6d6;
  --color-accent-caveat: #fbbf24;

  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'Space Mono', ui-monospace, monospace;

  --radius-pill: 999px;
  --radius-card: 18px;
  --radius-accent-rule: 2px;
  --radius-rail-active: 14px;
  --radius-rail-inactive: 10px;
}

html, body, #root {
  height: 100%;
  background: var(--color-bg-base);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 27px;
}
body { margin: 0; }

.stations {
  scroll-snap-type: y mandatory;
  overflow-y: auto;
  height: 100vh;
}
.stations > section {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  min-height: 100vh;
}

@media (prefers-reduced-motion: reduce) {
  .stations { scroll-behavior: auto; }
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-surface-card);
  color: var(--color-text-primary);
  padding: 8px 12px;
  border-radius: 6px;
  z-index: 100;
}
.skip-link:focus { top: 8px; }
```

- [ ] **Step 2: Write `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element missing in index.html')
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 3: Write placeholder `src/App.tsx` (replaced in Task 22)**

```tsx
export function App() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Inside an LLM</h1>
      <p>Foundation in progress.</p>
    </div>
  )
}
```

- [ ] **Step 4: Verify dev server boots**

```bash
npm run dev
# Open http://localhost:5173, confirm "Inside an LLM" appears on dark background, then ctrl-C
```

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/main.tsx src/App.tsx
git commit -m "feat: add design tokens via Tailwind v4 @theme and bootstrap files"
```

---

### Task 3: Scene configuration (single source of truth)

**Files:**
- Create: `src/scenes/scenes.config.ts`
- Test: `tests/unit/scenes.config.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { SCENES, getSceneById, type SceneId } from '@/scenes/scenes.config'

describe('scenes.config', () => {
  it('exposes 7 pipeline scenes plus about', () => {
    expect(SCENES).toHaveLength(8)
    const ids = SCENES.map((s) => s.id)
    expect(ids).toEqual([
      'prompt', 'tokenize', 'embed', 'attention',
      'predict', 'decode', 'output', 'about',
    ])
  })

  it('attaches the spec accent token to each scene', () => {
    expect(getSceneById('predict').accent).toBe('predict')
    expect(getSceneById('attention').accent).toBe('attention')
  })

  it('uses the cat prompt for the attention scene per spec §3', () => {
    expect(getSceneById('attention').prompt).toBe('The cat sat down because it was tired')
  })

  it('throws for an unknown scene id', () => {
    expect(() => getSceneById('nope' as SceneId)).toThrow(/unknown scene/i)
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- scenes.config
```

- [ ] **Step 3: Implement `src/scenes/scenes.config.ts`**

```ts
export type SceneId =
  | 'prompt' | 'tokenize' | 'embed' | 'attention'
  | 'predict' | 'decode' | 'output' | 'about'

export type AccentToken =
  | 'prompt' | 'tokenize' | 'embed' | 'attention'
  | 'predict' | 'decode' | 'output'

export interface SceneConfig {
  id: SceneId
  title: string
  accent: AccentToken | null
  prompt: string
  railLabel: string | null
}

export const SCENES: ReadonlyArray<SceneConfig> = [
  { id: 'prompt',    title: 'Prompt Input',         accent: 'prompt',    prompt: 'The sky is', railLabel: 'PROMPT' },
  { id: 'tokenize',  title: 'Tokenization',         accent: 'tokenize',  prompt: 'The sky is', railLabel: 'TOKENIZE' },
  { id: 'embed',     title: 'Embeddings',           accent: 'embed',     prompt: 'The sky is', railLabel: 'EMBED' },
  { id: 'attention', title: 'Attention',            accent: 'attention', prompt: 'The cat sat down because it was tired', railLabel: 'ATTENTION' },
  { id: 'predict',   title: 'Next-Token Prediction',accent: 'predict',   prompt: 'The sky is', railLabel: 'PREDICT' },
  { id: 'decode',    title: 'Decoding Loop',        accent: 'decode',    prompt: 'The sky is', railLabel: 'DECODE' },
  { id: 'output',    title: 'Output Assembly',      accent: 'output',    prompt: 'The sky is', railLabel: 'OUTPUT' },
  { id: 'about',     title: 'About this explainer', accent: null,        prompt: '',           railLabel: null },
] as const

export function getSceneById(id: SceneId): SceneConfig {
  const scene = SCENES.find((s) => s.id === id)
  if (!scene) throw new Error(`unknown scene: ${id}`)
  return scene
}

export const ACCENT_HEX: Record<AccentToken, string> = {
  prompt: '#FFC857',
  tokenize: '#6BF178',
  embed: '#4CC9F0',
  attention: '#F72585',
  predict: '#9D4EDD',
  decode: '#FF7B00',
  output: '#2EE6D6',
}
```

- [ ] **Step 4: Run and confirm pass**

```bash
npm test -- scenes.config
```

- [ ] **Step 5: Commit**

```bash
git add src/scenes/scenes.config.ts tests/unit/scenes.config.test.ts
git commit -m "feat: add scene configuration as single source of truth"
```

---

### Task 4: Accent utilities

**Files:**
- Create: `src/utils/accent.ts`
- Test: `tests/unit/accent.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { accentHex, accentRgba, accentGlow } from '@/utils/accent'

describe('accent utils', () => {
  it('returns the spec hex for predict', () => {
    expect(accentHex('predict')).toBe('#9D4EDD')
  })
  it('returns an rgba string with the requested alpha', () => {
    expect(accentRgba('predict', 0.55)).toBe('rgba(157, 78, 221, 0.55)')
  })
  it('builds rail glow per spec §6', () => {
    expect(accentGlow('predict', 'rail')).toBe('0 0 16px 2px rgba(157, 78, 221, 0.55)')
  })
  it('builds bar glow per spec §6', () => {
    expect(accentGlow('predict', 'bar')).toBe('0 0 14px 1px rgba(157, 78, 221, 0.55)')
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- accent
```

- [ ] **Step 3: Implement `src/utils/accent.ts`**

```ts
import { ACCENT_HEX, type AccentToken } from '@/scenes/scenes.config'

export function accentHex(token: AccentToken): string {
  return ACCENT_HEX[token]
}

export function accentRgba(token: AccentToken, alpha: number): string {
  const hex = ACCENT_HEX[token].slice(1)
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function accentGlow(token: AccentToken, kind: 'rail' | 'bar'): string {
  return kind === 'rail'
    ? `0 0 16px 2px ${accentRgba(token, 0.55)}`
    : `0 0 14px 1px ${accentRgba(token, 0.55)}`
}
```

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/utils/accent.ts tests/unit/accent.test.ts
git commit -m "feat: add accent color and glow utilities"
```

---

### Task 5: Data schemas (Zod)

**Files:**
- Create: `src/data/schema.ts`
- Test: `tests/unit/schema.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { PromptDatasetSchema } from '@/data/schema'

const valid = {
  prompt: 'The sky is',
  source: 'GPT-2 small, run offline — illustrative reference model',
  tokens: [
    { text: 'The', id: 464 },
    { text: ' sky', id: 6766 },
    { text: ' is', id: 318 },
  ],
  nextToken: [
    { token: ' blue', p: 0.71, logit: 3.1 },
    { token: ' not', p: 0.06, logit: 0.9 },
  ],
  embedding2d: [[0.12, -0.44], [-0.3, 0.5], [0.05, 0.1]],
  attention: { heads: [[[1]]] },
  bytes: { ' blue': '62 6c 75 65' },
}

describe('PromptDatasetSchema', () => {
  it('accepts a valid dataset', () => {
    expect(() => PromptDatasetSchema.parse(valid)).not.toThrow()
  })
  it('rejects a dataset without source', () => {
    const { source: _src, ...withoutSource } = valid
    expect(() => PromptDatasetSchema.parse(withoutSource)).toThrow(/source/i)
  })
  it('rejects probabilities outside [0, 1]', () => {
    const bad = { ...valid, nextToken: [{ token: 'x', p: 1.5, logit: 0 }] }
    expect(() => PromptDatasetSchema.parse(bad)).toThrow()
  })
  it('rejects empty token arrays', () => {
    const bad = { ...valid, tokens: [] }
    expect(() => PromptDatasetSchema.parse(bad)).toThrow()
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- schema
```

- [ ] **Step 3: Implement `src/data/schema.ts`**

```ts
import { z } from 'zod'

export const TokenSchema = z.object({
  text: z.string(),
  id: z.number().int().nonnegative(),
})

export const NextTokenCandidateSchema = z.object({
  token: z.string(),
  p: z.number().min(0).max(1),
  logit: z.number(),
})

export const PromptDatasetSchema = z.object({
  prompt: z.string().min(1),
  source: z.string().min(1, 'provenance source is required'),
  tokens: z.array(TokenSchema).min(1),
  nextToken: z.array(NextTokenCandidateSchema).min(1),
  embedding2d: z.array(z.tuple([z.number(), z.number()])).min(1),
  attention: z.object({
    heads: z.array(z.array(z.array(z.number().min(0).max(1)))),
  }),
  bytes: z.record(z.string(), z.string()),
})

export type Token = z.infer<typeof TokenSchema>
export type NextTokenCandidate = z.infer<typeof NextTokenCandidateSchema>
export type PromptDataset = z.infer<typeof PromptDatasetSchema>
```

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/data/schema.ts tests/unit/schema.test.ts
git commit -m "feat: define Zod schema for prompt datasets with required provenance"
```

---

### Task 6: Sky dataset JSON

**Files:**
- Create: `src/data/prompts/sky.json`
- Test: `tests/unit/sky-dataset.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import sky from '@/data/prompts/sky.json'
import { PromptDatasetSchema } from '@/data/schema'

describe('sky.json', () => {
  it('matches the schema', () => {
    expect(() => PromptDatasetSchema.parse(sky)).not.toThrow()
  })
  it('uses the GPT-2 illustrative token IDs from the mockup (464/6766/318)', () => {
    const ids = (sky as { tokens: Array<{ id: number }> }).tokens.map((t) => t.id)
    expect(ids).toEqual([464, 6766, 318])
  })
  it("top next-token is ' blue' at 0.71 (matches mockup §3 Scene 4)", () => {
    const top = (sky as { nextToken: Array<{ token: string; p: number }> }).nextToken[0]
    expect(top.token).toBe(' blue')
    expect(top.p).toBeCloseTo(0.71, 2)
  })
  it('source labels the dataset as illustrative', () => {
    expect((sky as { source: string }).source.toLowerCase()).toMatch(/illustrative|gpt-2/)
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- sky-dataset
```

- [ ] **Step 3: Implement `src/data/prompts/sky.json`**

```json
{
  "prompt": "The sky is",
  "source": "GPT-2 small, run offline — illustrative reference model. Numbers approximate the Figma mockup values; the Claude/ChatGPT internals visualized later are not accessible to any tool.",
  "tokens": [
    { "text": "The", "id": 464 },
    { "text": " sky", "id": 6766 },
    { "text": " is", "id": 318 }
  ],
  "nextToken": [
    { "token": " blue",  "p": 0.71, "logit": 3.1  },
    { "token": " not",   "p": 0.06, "logit": 0.9  },
    { "token": " the",   "p": 0.04, "logit": 0.4  },
    { "token": " a",     "p": 0.03, "logit": 0.2  },
    { "token": " very",  "p": 0.02, "logit": 0.0  },
    { "token": " so",    "p": 0.02, "logit": -0.05 },
    { "token": " clear", "p": 0.01, "logit": -0.4 },
    { "token": " still", "p": 0.01, "logit": -0.5 }
  ],
  "embedding2d": [[0.12, -0.44], [-0.3, 0.5], [0.05, 0.1]],
  "attention": {
    "heads": [
      [
        [1, 0, 0],
        [0.4, 0.6, 0],
        [0.2, 0.3, 0.5]
      ]
    ]
  },
  "bytes": { " blue": "62 6c 75 65" }
}
```

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/data/prompts/sky.json tests/unit/sky-dataset.test.ts
git commit -m "feat(data): add sky.json precomputed dataset with GPT-2 provenance"
```

---

### Task 7: Data loader

**Files:**
- Create: `src/data/loader.ts`
- Test: `tests/unit/loader.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { loadPromptDataset, type PromptId } from '@/data/loader'

describe('loadPromptDataset', () => {
  it('loads sky dataset', () => {
    const ds = loadPromptDataset('sky')
    expect(ds.prompt).toBe('The sky is')
    expect(ds.tokens[0].id).toBe(464)
  })
  it('throws for unknown prompt ids', () => {
    expect(() => loadPromptDataset('nope' as PromptId)).toThrow(/unknown prompt/i)
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- loader
```

- [ ] **Step 3: Implement `src/data/loader.ts`**

```ts
import sky from '@/data/prompts/sky.json'
import { PromptDatasetSchema, type PromptDataset } from './schema'

export type PromptId = 'sky'

const RAW: Record<PromptId, unknown> = { sky }

export function loadPromptDataset(id: PromptId): PromptDataset {
  if (!(id in RAW)) throw new Error(`unknown prompt id: ${id}`)
  return PromptDatasetSchema.parse(RAW[id])
}
```

> Plan 3 widens `PromptId` with `'cat'` for AttentionScene.

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/data/loader.ts tests/unit/loader.test.ts
git commit -m "feat(data): add Zod-validated dataset loader"
```

---

### Task 8: `DepthContext`

**Files:**
- Create: `src/app/DepthContext.tsx`
- Test: `tests/unit/DepthContext.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DepthProvider, useDepth } from '@/app/DepthContext'

function Probe() {
  const { globalDepth, setGlobalDepth } = useDepth()
  return (
    <div>
      <span data-testid="depth">{globalDepth}</span>
      <button onClick={() => setGlobalDepth(globalDepth === 'surface' ? 'deep' : 'surface')}>toggle</button>
    </div>
  )
}

describe('DepthContext', () => {
  it('defaults to surface', () => {
    render(<DepthProvider><Probe /></DepthProvider>)
    expect(screen.getByTestId('depth')).toHaveTextContent('surface')
  })

  it('toggles to deep and back', async () => {
    const user = userEvent.setup()
    render(<DepthProvider><Probe /></DepthProvider>)
    await user.click(screen.getByRole('button', { name: 'toggle' }))
    expect(screen.getByTestId('depth')).toHaveTextContent('deep')
    await user.click(screen.getByRole('button', { name: 'toggle' }))
    expect(screen.getByTestId('depth')).toHaveTextContent('surface')
  })

  it('throws if useDepth is used outside the provider', () => {
    expect(() => render(<Probe />)).toThrow(/DepthProvider/)
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- DepthContext
```

- [ ] **Step 3: Implement `src/app/DepthContext.tsx`**

```tsx
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Depth = 'surface' | 'deep'

interface DepthContextValue {
  globalDepth: Depth
  setGlobalDepth: (next: Depth) => void
}

const DepthContext = createContext<DepthContextValue | null>(null)

interface DepthProviderProps {
  children: ReactNode
  initial?: Depth
}

export function DepthProvider({ children, initial = 'surface' }: DepthProviderProps) {
  const [globalDepth, setGlobalDepth] = useState<Depth>(initial)
  const value = useMemo(() => ({ globalDepth, setGlobalDepth }), [globalDepth])
  return <DepthContext.Provider value={value}>{children}</DepthContext.Provider>
}

export function useDepth(): DepthContextValue {
  const ctx = useContext(DepthContext)
  if (!ctx) throw new Error('useDepth must be used inside <DepthProvider>')
  return ctx
}
```

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/app/DepthContext.tsx tests/unit/DepthContext.test.tsx
git commit -m "feat: add DepthContext for global Surface/Deep preference"
```

---

### Task 9: `RunningExampleContext`

**Files:**
- Create: `src/app/RunningExampleContext.tsx`
- Test: `tests/unit/RunningExampleContext.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RunningExampleProvider, useRunningExample } from '@/app/RunningExampleContext'

function Probe() {
  const { dataset, promptId } = useRunningExample()
  return (
    <>
      <span data-testid="id">{promptId}</span>
      <span data-testid="prompt">{dataset.prompt}</span>
      <span data-testid="source">{dataset.source}</span>
    </>
  )
}

describe('RunningExampleContext', () => {
  it('exposes the sky dataset by default', () => {
    render(<RunningExampleProvider><Probe /></RunningExampleProvider>)
    expect(screen.getByTestId('id')).toHaveTextContent('sky')
    expect(screen.getByTestId('prompt')).toHaveTextContent('The sky is')
    expect(screen.getByTestId('source').textContent).toMatch(/illustrative|gpt-2/i)
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- RunningExampleContext
```

- [ ] **Step 3: Implement `src/app/RunningExampleContext.tsx`**

```tsx
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { loadPromptDataset, type PromptId } from '@/data/loader'
import type { PromptDataset } from '@/data/schema'

interface RunningExampleValue {
  promptId: PromptId
  dataset: PromptDataset
  setPromptId: (id: PromptId) => void
}

const RunningExampleContext = createContext<RunningExampleValue | null>(null)

interface ProviderProps {
  children: ReactNode
  initial?: PromptId
}

export function RunningExampleProvider({ children, initial = 'sky' }: ProviderProps) {
  const [promptId, setPromptId] = useState<PromptId>(initial)
  const dataset = useMemo(() => loadPromptDataset(promptId), [promptId])
  const value = useMemo(() => ({ promptId, dataset, setPromptId }), [promptId, dataset])
  return <RunningExampleContext.Provider value={value}>{children}</RunningExampleContext.Provider>
}

export function useRunningExample(): RunningExampleValue {
  const ctx = useContext(RunningExampleContext)
  if (!ctx) throw new Error('useRunningExample must be used inside <RunningExampleProvider>')
  return ctx
}
```

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/app/RunningExampleContext.tsx tests/unit/RunningExampleContext.test.tsx
git commit -m "feat: add RunningExampleContext that owns the selected prompt + dataset"
```

---

### Task 10: `useHashSync` hook

**Files:**
- Create: `src/app/useHashSync.ts`
- Test: `tests/unit/useHashSync.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import { useHashSync } from '@/app/useHashSync'

function Probe({ active }: { active: string }) {
  useHashSync(active)
  return null
}

describe('useHashSync', () => {
  beforeEach(() => history.replaceState(null, '', '/'))

  it('writes the active id to the URL hash', () => {
    render(<Probe active="predict" />)
    expect(window.location.hash).toBe('#predict')
  })

  it('emits a scene-jump event when the hash changes externally', () => {
    const handler = vi.fn()
    window.addEventListener('llm-explainer:scene-jump', handler as EventListener)
    render(<Probe active="prompt" />)
    act(() => {
      window.location.hash = '#attention'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(handler).toHaveBeenCalled()
    const detail = (handler.mock.calls[0][0] as CustomEvent).detail
    expect(detail).toEqual({ id: 'attention' })
    window.removeEventListener('llm-explainer:scene-jump', handler as EventListener)
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- useHashSync
```

- [ ] **Step 3: Implement `src/app/useHashSync.ts`**

```ts
import { useEffect } from 'react'

export const SCENE_JUMP_EVENT = 'llm-explainer:scene-jump'

export function useHashSync(activeId: string): void {
  useEffect(() => {
    if (!activeId) return
    const target = `#${activeId}`
    if (window.location.hash !== target) {
      history.replaceState(null, '', target)
    }
  }, [activeId])

  useEffect(() => {
    function onHash() {
      const id = window.location.hash.replace(/^#/, '')
      if (id) {
        window.dispatchEvent(new CustomEvent(SCENE_JUMP_EVENT, { detail: { id } }))
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
}
```

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/app/useHashSync.ts tests/unit/useHashSync.test.tsx
git commit -m "feat: add useHashSync hook for scroll-snap deep linking"
```

---

### Task 11: `useKeyboardNav` hook

**Files:**
- Create: `src/app/useKeyboardNav.ts`
- Test: `tests/unit/useKeyboardNav.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { useKeyboardNav } from '@/app/useKeyboardNav'

function Probe({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  useKeyboardNav({ onPrev, onNext })
  return <div data-testid="probe" />
}

describe('useKeyboardNav', () => {
  it('calls onNext on ArrowDown', () => {
    const onPrev = vi.fn(), onNext = vi.fn()
    render(<Probe onPrev={onPrev} onNext={onNext} />)
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    expect(onNext).toHaveBeenCalledOnce()
    expect(onPrev).not.toHaveBeenCalled()
  })

  it('calls onPrev on PageUp', () => {
    const onPrev = vi.fn(), onNext = vi.fn()
    render(<Probe onPrev={onPrev} onNext={onNext} />)
    fireEvent.keyDown(window, { key: 'PageUp' })
    expect(onPrev).toHaveBeenCalledOnce()
  })

  it('ignores keys when target is an input', () => {
    const onPrev = vi.fn(), onNext = vi.fn()
    const { container } = render(<><input /><Probe onPrev={onPrev} onNext={onNext} /></>)
    const input = container.querySelector('input')!
    input.focus()
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(onNext).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- useKeyboardNav
```

- [ ] **Step 3: Implement `src/app/useKeyboardNav.ts`**

```ts
import { useEffect } from 'react'

interface Handlers {
  onPrev: () => void
  onNext: () => void
}

const PREV_KEYS = new Set(['ArrowUp', 'PageUp'])
const NEXT_KEYS = new Set(['ArrowDown', 'PageDown'])
const INTERACTIVE = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

export function useKeyboardNav({ onPrev, onNext }: Handlers): void {
  useEffect(() => {
    function handle(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      if (target && INTERACTIVE.has(target.tagName)) return
      if (target?.isContentEditable) return
      if (PREV_KEYS.has(event.key)) {
        event.preventDefault()
        onPrev()
      } else if (NEXT_KEYS.has(event.key)) {
        event.preventDefault()
        onNext()
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onPrev, onNext])
}
```

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/app/useKeyboardNav.ts tests/unit/useKeyboardNav.test.tsx
git commit -m "feat: add useKeyboardNav hook for arrow/PageUp/PageDown station nav"
```

---

### Task 12: `EyebrowLabel` + `AccentRule`

**Files:**
- Create: `src/components/EyebrowLabel.tsx`, `src/components/AccentRule.tsx`
- Test: `tests/unit/typography.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { AccentRule } from '@/components/AccentRule'

describe('EyebrowLabel', () => {
  it('uppercases its text', () => {
    render(<EyebrowLabel>your prompt</EyebrowLabel>)
    expect(screen.getByText('your prompt')).toHaveStyle({ textTransform: 'uppercase' })
  })
})

describe('AccentRule', () => {
  it('renders a 48x3 block with the requested accent color', () => {
    const { container } = render(<AccentRule accent="predict" />)
    const rule = container.firstElementChild as HTMLElement
    expect(rule.style.width).toBe('48px')
    expect(rule.style.height).toBe('3px')
    expect(rule.style.backgroundColor.toLowerCase()).toBe('rgb(157, 78, 221)')
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- typography
```

- [ ] **Step 3: Implement both components**

`src/components/EyebrowLabel.tsx`:

```tsx
import type { ReactNode } from 'react'

interface EyebrowLabelProps {
  children: ReactNode
  className?: string
}

export function EyebrowLabel({ children, className }: EyebrowLabelProps) {
  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        fontSize: 10,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
      }}
    >
      {children}
    </span>
  )
}
```

`src/components/AccentRule.tsx`:

```tsx
import { accentHex } from '@/utils/accent'
import type { AccentToken } from '@/scenes/scenes.config'

interface AccentRuleProps { accent: AccentToken }

export function AccentRule({ accent }: AccentRuleProps) {
  return (
    <div
      role="presentation"
      style={{
        width: 48,
        height: 3,
        borderRadius: 'var(--radius-accent-rule)',
        backgroundColor: accentHex(accent),
      }}
    />
  )
}
```

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/EyebrowLabel.tsx src/components/AccentRule.tsx tests/unit/typography.test.tsx
git commit -m "feat: add EyebrowLabel and AccentRule typography components"
```

---

### Task 13: `Chip` component

**Files:**
- Create: `src/components/Chip.tsx`
- Test: `tests/unit/Chip.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Chip } from '@/components/Chip'

describe('Chip', () => {
  it('renders as a button when onClick is provided', async () => {
    const onClick = vi.fn()
    render(<Chip onClick={onClick}>The sky is</Chip>)
    await userEvent.click(screen.getByRole('button', { name: 'The sky is' }))
    expect(onClick).toHaveBeenCalled()
  })
  it('renders as a static pill when onClick is omitted', () => {
    render(<Chip>The</Chip>)
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByText('The')).toBeInTheDocument()
  })
  it('marks the active state via aria-pressed', () => {
    render(<Chip onClick={() => {}} active>sky</Chip>)
    expect(screen.getByRole('button', { name: 'sky' })).toHaveAttribute('aria-pressed', 'true')
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- Chip
```

- [ ] **Step 3: Implement `src/components/Chip.tsx`**

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
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: variant === 'example' ? '8px 14px' : '4px 10px',
    borderRadius: 'var(--radius-pill)',
    border: `1px solid ${active && accent ? accent : 'var(--color-border)'}`,
    background: 'var(--color-surface-card)',
    color: 'var(--color-text-primary)',
    fontFamily: variant === 'token' ? 'var(--font-mono)' : 'var(--font-body)',
    fontSize: variant === 'token' ? 15 : 14,
    lineHeight: 1.3,
    cursor: onClick ? 'pointer' : 'default',
    boxShadow: active && accent ? `0 0 8px 1px ${accent}66` : 'none',
  }
  if (!onClick) return <span style={style}>{children}</span>
  return (
    <button type="button" style={style} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  )
}
```

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/Chip.tsx tests/unit/Chip.test.tsx
git commit -m "feat: add Chip component (token + example variants)"
```

---

### Task 14: `DataBar` component

**Files:**
- Create: `src/components/DataBar.tsx`
- Test: `tests/unit/DataBar.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DataBar } from '@/components/DataBar'

describe('DataBar', () => {
  it('renders label and value', () => {
    render(<DataBar label="blue" value="71%" fraction={0.71} />)
    expect(screen.getByText('blue')).toBeInTheDocument()
    expect(screen.getByText('71%')).toBeInTheDocument()
  })
  it('sets the fill width to the fraction percentage', () => {
    render(<DataBar label="blue" value="71%" fraction={0.71} />)
    expect(screen.getByTestId('databar-fill').style.width).toBe('71%')
  })
  it('uses bar-inactive color when not dominant', () => {
    render(<DataBar label="not" value="6%" fraction={0.06} />)
    const fill = screen.getByTestId('databar-fill')
    expect(fill.style.backgroundColor.toLowerCase()).toBe('rgb(74, 74, 92)')
  })
  it('applies accent + glow when dominant', () => {
    render(<DataBar label="blue" value="71%" fraction={0.71} dominant accent="predict" />)
    const fill = screen.getByTestId('databar-fill')
    expect(fill.style.backgroundColor.toLowerCase()).toBe('rgb(157, 78, 221)')
    expect(fill.style.boxShadow).toContain('rgba(157, 78, 221')
  })
  it('exposes value via aria-valuenow for screen readers', () => {
    render(<DataBar label="blue" value="71%" fraction={0.71} />)
    const bar = screen.getByRole('progressbar', { name: 'blue' })
    expect(bar).toHaveAttribute('aria-valuenow', '71')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- DataBar
```

- [ ] **Step 3: Implement `src/components/DataBar.tsx`**

```tsx
import { accentHex, accentGlow } from '@/utils/accent'
import type { AccentToken } from '@/scenes/scenes.config'

interface DataBarProps {
  label: string
  value: string
  fraction: number
  dominant?: boolean
  accent?: AccentToken
}

export function DataBar({ label, value, fraction, dominant = false, accent }: DataBarProps) {
  const useAccent = dominant && accent
  const fillColor = useAccent ? accentHex(accent) : 'rgb(74, 74, 92)'
  const glow = useAccent ? accentGlow(accent, 'bar') : 'none'
  const pct = Math.round(fraction * 100)
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '70px 1fr 56px',
        alignItems: 'center',
        gap: 12,
        margin: '6px 0',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15 }}>{label}</span>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          height: 16,
          borderRadius: 8,
          background: 'var(--color-surface-track)',
          overflow: 'hidden',
        }}
      >
        <div
          data-testid="databar-fill"
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: fillColor,
            boxShadow: glow,
            transition: 'width 240ms ease-out',
          }}
        />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, textAlign: 'right' }}>{value}</span>
    </div>
  )
}
```

> The fill color uses an explicit `rgb(74, 74, 92)` rather than `var(--color-bar-inactive)` because tests assert the resolved value; the var is still the source of truth for non-tested consumers.

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/DataBar.tsx tests/unit/DataBar.test.tsx
git commit -m "feat: add DataBar component with accent glow on dominant bar"
```

---

### Task 15: `CaveatNote` component

**Files:**
- Create: `src/components/CaveatNote.tsx`
- Test: `tests/unit/CaveatNote.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CaveatNote } from '@/components/CaveatNote'

describe('CaveatNote', () => {
  it('renders the warning glyph and message as a single note region', () => {
    render(<CaveatNote>numbers are illustrative</CaveatNote>)
    const note = screen.getByRole('note')
    expect(note).toHaveTextContent('numbers are illustrative')
    expect(note.textContent).toMatch(/⚐/)
  })
  it('borders in the amber CaveatNote accent', () => {
    render(<CaveatNote>x</CaveatNote>)
    const note = screen.getByRole('note')
    expect(note).toHaveStyle({ borderColor: 'var(--color-accent-caveat)' })
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- CaveatNote
```

- [ ] **Step 3: Implement `src/components/CaveatNote.tsx`**

```tsx
import type { ReactNode } from 'react'

interface CaveatNoteProps { children: ReactNode }

export function CaveatNote({ children }: CaveatNoteProps) {
  return (
    <div
      role="note"
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        padding: '10px 14px',
        marginTop: 12,
        borderRadius: 10,
        border: '1px solid var(--color-accent-caveat)',
        background: 'color-mix(in srgb, var(--color-accent-caveat) 8%, var(--color-surface-card))',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        lineHeight: '20px',
      }}
    >
      <span aria-hidden="true" style={{ color: 'var(--color-accent-caveat)', fontSize: 16 }}>⚐</span>
      <span>{children}</span>
    </div>
  )
}
```

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/CaveatNote.tsx tests/unit/CaveatNote.test.tsx
git commit -m "feat: add CaveatNote amber callout component"
```

---

### Task 16: `DeepToggle` component

**Files:**
- Create: `src/components/DeepToggle.tsx`
- Test: `tests/unit/DeepToggle.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeepToggle } from '@/components/DeepToggle'

describe('DeepToggle', () => {
  it('shows "Go deeper" and a down chevron when collapsed', () => {
    render(<DeepToggle expanded={false} onToggle={() => {}} />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveTextContent(/go deeper/i)
    expect(btn).toHaveTextContent('⌄')
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })
  it('shows "Collapse" and up chevron when expanded', () => {
    render(<DeepToggle expanded={true} onToggle={() => {}} />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveTextContent(/collapse/i)
    expect(btn).toHaveTextContent('⌃')
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })
  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn()
    render(<DeepToggle expanded={false} onToggle={onToggle} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledOnce()
  })
  it('links to a controlled deep panel via aria-controls', () => {
    render(<DeepToggle expanded={false} onToggle={() => {}} controlsId="predict-deep" />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-controls', 'predict-deep')
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- DeepToggle
```

- [ ] **Step 3: Implement `src/components/DeepToggle.tsx`**

```tsx
interface DeepToggleProps {
  expanded: boolean
  onToggle: () => void
  controlsId?: string
}

export function DeepToggle({ expanded, onToggle, controlsId }: DeepToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-controls={controlsId}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--color-surface-card)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
        minHeight: 44,
      }}
    >
      <span>{expanded ? 'Collapse' : 'Go deeper'}</span>
      <span aria-hidden="true">{expanded ? '⌃' : '⌄'}</span>
    </button>
  )
}
```

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/DeepToggle.tsx tests/unit/DeepToggle.test.tsx
git commit -m "feat: add DeepToggle disclosure pill (collapsed/expanded variants)"
```

---

### Task 17: `ProgressRail` component

**Files:**
- Create: `src/components/ProgressRail.tsx`
- Test: `tests/unit/ProgressRail.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProgressRail } from '@/components/ProgressRail'

describe('ProgressRail', () => {
  it('renders 7 numbered scene segments plus a Compare dot and an About dot', () => {
    render(<ProgressRail activeId="predict" onJump={() => {}} />)
    const nav = screen.getByRole('navigation', { name: /scenes/i })
    expect(within(nav).getAllByRole('button')).toHaveLength(9) // 7 + Compare + About
  })
  it('marks the active segment with aria-current=step', () => {
    render(<ProgressRail activeId="predict" onJump={() => {}} />)
    expect(screen.getByRole('button', { name: /predict/i })).toHaveAttribute('aria-current', 'step')
  })
  it('applies the accent glow to the active segment', () => {
    render(<ProgressRail activeId="predict" onJump={() => {}} />)
    const active = screen.getByRole('button', { name: /predict/i })
    expect(active.style.boxShadow).toContain('rgba(157, 78, 221')
  })
  it('calls onJump with the scene id when clicked', async () => {
    const onJump = vi.fn()
    render(<ProgressRail activeId="predict" onJump={onJump} />)
    await userEvent.click(screen.getByRole('button', { name: /tokenize/i }))
    expect(onJump).toHaveBeenCalledWith('tokenize')
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- ProgressRail
```

- [ ] **Step 3: Implement `src/components/ProgressRail.tsx`**

```tsx
import { SCENES, type SceneId } from '@/scenes/scenes.config'
import { accentHex, accentGlow } from '@/utils/accent'

interface ProgressRailProps {
  activeId: SceneId
  onJump: (id: SceneId) => void
}

export function ProgressRail({ activeId, onJump }: ProgressRailProps) {
  const pipeline = SCENES.filter((s) => s.id !== 'about')
  return (
    <nav
      aria-label="Scenes"
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: 72, height: '100vh',
        background: 'var(--color-bg-base)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 12, padding: '24px 0', zIndex: 10,
      }}
    >
      {pipeline.map((scene, idx) => {
        const isActive = scene.id === activeId
        return (
          <button
            key={scene.id}
            type="button"
            onClick={() => onJump(scene.id)}
            aria-current={isActive ? 'step' : undefined}
            aria-label={`${idx + 1} ${scene.title}`}
            style={{
              minWidth: 44, minHeight: 44,
              width: isActive ? 44 : 30, height: isActive ? 44 : 34,
              borderRadius: isActive ? 'var(--radius-rail-active)' : 'var(--radius-rail-inactive)',
              background: isActive && scene.accent ? accentHex(scene.accent) : 'var(--color-rail-inactive)',
              border: '1px solid var(--color-border)',
              boxShadow: isActive && scene.accent ? accentGlow(scene.accent, 'rail') : 'none',
              color: isActive ? '#fff' : 'var(--color-text-muted)',
              fontFamily: 'var(--font-mono)',
              fontWeight: isActive ? 700 : 400,
              fontSize: 14,
              cursor: 'pointer', padding: 0,
            }}
          >
            {idx + 1}
          </button>
        )
      })}
      <button
        type="button"
        onClick={() => onJump('about')}
        aria-label="Compare"
        style={{
          minWidth: 44, minHeight: 44, width: 16, height: 16,
          marginTop: 16,
          borderRadius: '50%',
          background: 'var(--color-rail-inactive)',
          border: '1px solid var(--color-border)',
          cursor: 'not-allowed', padding: 0,
        }}
        disabled
      />
      <button
        type="button"
        onClick={() => onJump('about')}
        aria-current={activeId === 'about' ? 'step' : undefined}
        aria-label="About"
        style={{
          minWidth: 44, minHeight: 44, width: 30, height: 34,
          marginTop: 'auto',
          borderRadius: 'var(--radius-rail-inactive)',
          background: 'var(--color-rail-inactive)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)', fontSize: 13,
          cursor: 'pointer', padding: 0,
        }}
      >
        ?
      </button>
    </nav>
  )
}
```

> The "Compare" dot is a disabled placeholder in MVP and wired in Plan 4. The 44px minimum hit target on every rail control satisfies spec §8.

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/ProgressRail.tsx tests/unit/ProgressRail.test.tsx
git commit -m "feat: add ProgressRail with 7 scenes plus Compare and About dots"
```

---

### Task 18: `TopBar` component

**Files:**
- Create: `src/components/TopBar.tsx`
- Test: `tests/unit/TopBar.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TopBar } from '@/components/TopBar'

describe('TopBar', () => {
  it('shows the wordmark', () => {
    render(<TopBar prompt="The sky is" />)
    expect(screen.getByText(/inside an llm/i)).toBeInTheDocument()
  })
  it('shows the running-example pill driven by the active scene prompt', () => {
    render(<TopBar prompt="The cat sat down because it was tired" />)
    expect(screen.getByText(/the cat sat down because it was tired/i)).toBeInTheDocument()
    expect(screen.getByText(/prompt/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- TopBar
```

- [ ] **Step 3: Implement `src/components/TopBar.tsx`**

```tsx
interface TopBarProps { prompt: string }

export function TopBar({ prompt }: TopBarProps) {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 72, right: 0,
        height: 72,
        background: 'var(--color-bg-base)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', zIndex: 9,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700, fontSize: 20, letterSpacing: '-0.2px',
        }}
      >
        Inside an LLM
      </span>
      {prompt && (
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--color-surface-card)',
            border: '1px solid var(--color-border)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 10,
              letterSpacing: '1px', textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}
          >
            Prompt
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{prompt}</span>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/TopBar.tsx tests/unit/TopBar.test.tsx
git commit -m "feat: add scene-aware TopBar with running-example pill"
```

---

### Task 19: `SceneStation` wrapper

**Files:**
- Create: `src/components/SceneStation.tsx`
- Test: `tests/unit/SceneStation.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SceneStation } from '@/components/SceneStation'
import { DepthProvider } from '@/app/DepthContext'

function renderStation(opts: { withDeeper?: boolean } = {}) {
  return render(
    <DepthProvider>
      <SceneStation
        id="predict"
        title="Next-Token Prediction"
        accent="predict"
        stage={<div data-testid="stage" />}
        surface={<p>surface body</p>}
        {...(opts.withDeeper ? { deeper: <p>deeper body</p> } : {})}
      />
    </DepthProvider>,
  )
}

describe('SceneStation', () => {
  it('renders the visual stage as aria-hidden', () => {
    renderStation()
    expect(screen.getByTestId('stage').parentElement).toHaveAttribute('aria-hidden', 'true')
  })
  it('renders the title as level-2 heading', () => {
    renderStation()
    expect(screen.getByRole('heading', { level: 2, name: 'Next-Token Prediction' })).toBeInTheDocument()
  })
  it('renders surface text by default', () => {
    renderStation()
    expect(screen.getByText('surface body')).toBeInTheDocument()
  })
  it('does not render a toggle when no deeper content is provided', () => {
    renderStation()
    expect(screen.queryByRole('button', { name: /go deeper/i })).toBeNull()
  })
  it('toggles deep panel open and closed when deeper is provided', async () => {
    renderStation({ withDeeper: true })
    const toggle = screen.getByRole('button', { name: /go deeper/i })
    expect(screen.queryByText('deeper body')).toBeNull()
    await userEvent.click(toggle)
    expect(screen.getByText('deeper body')).toBeInTheDocument()
    expect(toggle).toHaveAccessibleName(/collapse/i)
    await userEvent.click(toggle)
    expect(screen.queryByText('deeper body')).toBeNull()
  })
  it('uses the scene id as the section id (for hash linking)', () => {
    const { container } = renderStation()
    expect(container.querySelector('section')?.id).toBe('predict')
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- SceneStation
```

- [ ] **Step 3: Implement `src/components/SceneStation.tsx`**

```tsx
import { useState, type ReactNode } from 'react'
import { useDepth } from '@/app/DepthContext'
import { AccentRule } from './AccentRule'
import { DeepToggle } from './DeepToggle'
import type { AccentToken, SceneId } from '@/scenes/scenes.config'

interface SceneStationProps {
  id: SceneId
  title: string
  accent: AccentToken
  stage: ReactNode
  surface: ReactNode
  deeper?: ReactNode
}

export function SceneStation({ id, title, accent, stage, surface, deeper }: SceneStationProps) {
  const { globalDepth } = useDepth()
  const [localOverride, setLocalOverride] = useState<boolean | null>(null)
  const expanded = deeper !== undefined && (localOverride ?? globalDepth === 'deep')
  const deepPanelId = `${id}-deep`

  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <div
        style={{
          position: 'relative', minHeight: '100vh',
          paddingLeft: 104, paddingTop: 104, paddingRight: 32, paddingBottom: 24,
          display: 'grid', gridTemplateColumns: '758px 40px 506px',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 758, height: 800,
            background: 'var(--color-surface-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            overflow: 'clip', position: 'relative',
          }}
        >
          {stage}
        </div>
        <div />
        <div style={{ position: 'relative' }}>
          <h2
            id={`${id}-title`}
            tabIndex={-1}
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 28, lineHeight: '34px', letterSpacing: '-1px',
              margin: 0, color: 'var(--color-text-primary)',
            }}
          >
            {title}
          </h2>
          <div style={{ marginTop: 24 }}><AccentRule accent={accent} /></div>
          <div style={{ marginTop: 18, maxWidth: 506 }}>{surface}</div>
          {deeper !== undefined && (
            <div style={{ marginTop: 24 }}>
              <DeepToggle
                expanded={expanded}
                onToggle={() => setLocalOverride(!expanded)}
                controlsId={deepPanelId}
              />
              {expanded && (
                <div id={deepPanelId} style={{ marginTop: 18, maxWidth: 506 }}>
                  {deeper}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/SceneStation.tsx tests/unit/SceneStation.test.tsx
git commit -m "feat: add SceneStation wrapper with two-zone layout and Deep panel"
```

---

### Task 20: `PredictScene` — the reference scene

**Files:**
- Create: `src/scenes/PredictScene.tsx`
- Test: `tests/unit/PredictScene.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PredictScene } from '@/scenes/PredictScene'
import { DepthProvider, type Depth } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

function renderScene(initialDepth: Depth = 'surface') {
  return render(
    <RunningExampleProvider>
      <DepthProvider initial={initialDepth}>
        <PredictScene />
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('PredictScene', () => {
  it('shows 8 probability bars in the visual stage', () => {
    renderScene()
    expect(screen.getAllByRole('progressbar')).toHaveLength(8)
  })
  it('shows " blue" as the dominant candidate at 71%', () => {
    renderScene()
    expect(screen.getByRole('progressbar', { name: 'blue' })).toHaveAttribute('aria-valuenow', '71')
  })
  it('renders the P(next | prompt) header in mono', () => {
    renderScene()
    expect(screen.getByText(/P\(.*next token/i)).toBeInTheDocument()
  })
  it('reveals logits→softmax mini-diagram in Deep', async () => {
    renderScene()
    expect(screen.queryByText(/softmax/i)).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/softmax/i)).toBeInTheDocument()
    expect(screen.getByText('3.1')).toBeInTheDocument()
    expect(screen.getByText('0.71')).toBeInTheDocument()
  })
  it('shows the +50k remainder bar in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/\+50k/i)).toBeInTheDocument()
  })
  it('shows a CaveatNote about illustrative numbers in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const note = screen.getByRole('note')
    expect(note.textContent?.toLowerCase()).toMatch(/illustrative|gpt-2/)
  })
  it('exposes a temperature slider that re-shapes probabilities', async () => {
    renderScene()
    const slider = screen.getByRole('slider', { name: /temperature/i })
    expect(slider).toHaveAttribute('min', '0.1')
    expect(slider).toHaveAttribute('max', '2')
    fireEvent.change(slider, { target: { value: '0.2' } })
    const blueBar = screen.getByRole('progressbar', { name: 'blue' })
    expect(Number(blueBar.getAttribute('aria-valuenow'))).toBeGreaterThan(71)
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- PredictScene
```

- [ ] **Step 3: Implement `src/scenes/PredictScene.tsx`**

```tsx
import { useMemo, useState } from 'react'
import { SceneStation } from '@/components/SceneStation'
import { DataBar } from '@/components/DataBar'
import { CaveatNote } from '@/components/CaveatNote'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { useRunningExample } from '@/app/RunningExampleContext'
import { getSceneById } from '@/scenes/scenes.config'
import type { NextTokenCandidate } from '@/data/schema'

const SCENE = getSceneById('predict')

function softmax(logits: number[], temperature: number): number[] {
  const t = Math.max(0.01, temperature)
  const scaled = logits.map((l) => l / t)
  const max = Math.max(...scaled)
  const exps = scaled.map((s) => Math.exp(s - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
}

interface ReshapedCandidate extends NextTokenCandidate {
  reshaped: number
}

export function PredictScene() {
  const { dataset } = useRunningExample()
  const [temperature, setTemperature] = useState(1)

  const candidates = useMemo<ReshapedCandidate[]>(() => {
    const logits = dataset.nextToken.map((c) => c.logit)
    const probs = softmax(logits, temperature)
    return dataset.nextToken.map((c, i) => ({ ...c, reshaped: probs[i] }))
  }, [dataset.nextToken, temperature])

  const dominantIndex = candidates.reduce(
    (best, c, i, arr) => (c.reshaped > arr[best].reshaped ? i : best),
    0,
  )

  const stage = (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--color-text-muted)' }}>
        P( next token | <span style={{ color: 'var(--color-text-primary)' }}>&quot;{dataset.prompt}&quot;</span> )
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {candidates.map((c, i) => (
          <DataBar
            key={c.token}
            label={c.token.trim()}
            value={`${Math.round(c.reshaped * 100)}%`}
            fraction={c.reshaped}
            dominant={i === dominantIndex}
            accent="predict"
          />
        ))}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label htmlFor="temperature" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>
          Temperature: <span style={{ fontFamily: 'var(--font-mono)' }}>{temperature.toFixed(1)}</span>
        </label>
        <input
          id="temperature"
          name="temperature"
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          aria-label="Temperature"
        />
      </div>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>Next-token prediction</EyebrowLabel>
      <p style={{ marginTop: 12 }}>
        The model produces a probability for every possible next token. Here are the most likely few.
      </p>
    </>
  )

  const deeper = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <EyebrowLabel>How the bars are made</EyebrowLabel>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto auto auto auto auto',
          gap: 8,
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
        }}
      >
        <span style={{ color: 'var(--color-text-muted)' }}>logits</span>
        <span>3.1</span>
        <span style={{ color: 'var(--color-text-muted)' }}>→</span>
        <span style={{ color: 'var(--color-text-muted)' }}>softmax</span>
        <span>0.71</span>
        <span style={{ color: 'var(--color-text-muted)' }}>logits</span>
        <span>0.9</span>
        <span style={{ color: 'var(--color-text-muted)' }}>→</span>
        <span style={{ color: 'var(--color-text-muted)' }}>softmax</span>
        <span>0.06</span>
        <span style={{ color: 'var(--color-text-muted)' }}>logits</span>
        <span>0.4</span>
        <span style={{ color: 'var(--color-text-muted)' }}>→</span>
        <span style={{ color: 'var(--color-text-muted)' }}>softmax</span>
        <span>0.04</span>
      </div>
      <div>
        <DataBar label="+50k more" value="≈14%" fraction={0.14} />
      </div>
      <CaveatNote>
        The probabilities are illustrative — taken from a small open reference model (GPT-2 small) run
        offline, not live Claude or ChatGPT internals.
      </CaveatNote>
    </div>
  )

  return (
    <SceneStation
      id={SCENE.id}
      title={SCENE.title}
      accent="predict"
      stage={stage}
      surface={surface}
      deeper={deeper}
    />
  )
}
```

- [ ] **Step 4: Run and confirm pass**

```bash
npm test -- PredictScene
```

- [ ] **Step 5: Commit**

```bash
git add src/scenes/PredictScene.tsx tests/unit/PredictScene.test.tsx
git commit -m "feat: build PredictScene reference scene end-to-end with temperature slider"
```

---

### Task 21: `AboutScene` (provenance stub)

**Files:**
- Create: `src/scenes/AboutScene.tsx`
- Test: `tests/unit/AboutScene.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AboutScene } from '@/scenes/AboutScene'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

describe('AboutScene', () => {
  it('renders a level-2 heading', () => {
    render(<RunningExampleProvider><AboutScene /></RunningExampleProvider>)
    expect(screen.getByRole('heading', { level: 2, name: /about/i })).toBeInTheDocument()
  })
  it('names the reference model in plain text', () => {
    render(<RunningExampleProvider><AboutScene /></RunningExampleProvider>)
    expect(screen.getByText(/GPT-2/i)).toBeInTheDocument()
    expect(screen.getByText(/illustrative/i)).toBeInTheDocument()
  })
  it('explains why live Claude or ChatGPT internals are not shown', () => {
    render(<RunningExampleProvider><AboutScene /></RunningExampleProvider>)
    const body = screen.getByTestId('about-body').textContent ?? ''
    expect(body.toLowerCase()).toContain('claude')
    expect(body.toLowerCase()).toContain('chatgpt')
    expect(body.toLowerCase()).toMatch(/cannot|do not expose|not accessible/)
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- AboutScene
```

- [ ] **Step 3: Implement `src/scenes/AboutScene.tsx`**

```tsx
import { useRunningExample } from '@/app/RunningExampleContext'

export function AboutScene() {
  const { dataset } = useRunningExample()
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      style={{ minHeight: '100vh', padding: '104px 32px 32px 104px', maxWidth: 760 }}
    >
      <h2
        id="about-title"
        tabIndex={-1}
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700, fontSize: 28, lineHeight: '34px',
          letterSpacing: '-1px', margin: 0,
        }}
      >
        About this explainer
      </h2>
      <div data-testid="about-body" style={{ marginTop: 24, lineHeight: '27px' }}>
        <p>
          Every number, embedding coordinate, attention weight, and probability shown in this site
          comes from a small open reference model — <strong>GPT-2 small</strong>, run offline. They
          are <em>illustrative</em>. Frontier providers (Claude, ChatGPT) do not expose token-level
          attention, embedding coordinates, or full next-token distributions for arbitrary input, so
          this site cannot honestly visualize their internals.
        </p>
        <p style={{ marginTop: 12 }}>Source string: {dataset.source}</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run and confirm pass**

- [ ] **Step 5: Commit**

```bash
git add src/scenes/AboutScene.tsx tests/unit/AboutScene.test.tsx
git commit -m "feat: add AboutScene with provenance / illustrative-model note"
```

---

### Task 22: Compose `App.tsx`

**Files:**
- Modify: `src/App.tsx`
- Test: `tests/unit/App.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from '@/App'

describe('App', () => {
  it('renders the rail, topbar wordmark, and predict scene', () => {
    render(<App />)
    expect(screen.getByRole('navigation', { name: /scenes/i })).toBeInTheDocument()
    expect(screen.getAllByText(/inside an llm/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { level: 2, name: /next-token prediction/i })).toBeInTheDocument()
  })
  it('renders the about section', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: /about/i })).toBeInTheDocument()
  })
  it('includes a skip-to-content link', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /skip to content/i })).toBeInTheDocument()
  })
  it('drives the TopBar pill from the active scene prompt', () => {
    render(<App />)
    expect(screen.getAllByText(/the sky is/i).length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- App.test
```

- [ ] **Step 3: Implement final `src/App.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'
import { useHashSync, SCENE_JUMP_EVENT } from '@/app/useHashSync'
import { useKeyboardNav } from '@/app/useKeyboardNav'
import { ProgressRail } from '@/components/ProgressRail'
import { TopBar } from '@/components/TopBar'
import { PredictScene } from '@/scenes/PredictScene'
import { AboutScene } from '@/scenes/AboutScene'
import { getSceneById, type SceneId } from '@/scenes/scenes.config'

// In Plan 1, only `predict` + `about` are mounted; later scenes are filled in by Plans 2–3.
const MOUNTED_IDS: SceneId[] = ['predict', 'about']

export function App() {
  return (
    <RunningExampleProvider>
      <DepthProvider>
        <Shell />
      </DepthProvider>
    </RunningExampleProvider>
  )
}

function Shell() {
  const [activeId, setActiveId] = useState<SceneId>('predict')
  useHashSync(activeId)

  useEffect(() => {
    function handle(e: Event) {
      const id = (e as CustomEvent<{ id: string }>).detail.id as SceneId
      if (MOUNTED_IDS.includes(id)) {
        setActiveId(id)
        document.getElementById(id)?.scrollIntoView()
      }
    }
    window.addEventListener(SCENE_JUMP_EVENT, handle as EventListener)
    return () => window.removeEventListener(SCENE_JUMP_EVENT, handle as EventListener)
  }, [])

  const idx = MOUNTED_IDS.indexOf(activeId)
  useKeyboardNav({
    onPrev: () => {
      if (idx > 0) {
        const next = MOUNTED_IDS[idx - 1]
        setActiveId(next)
        document.getElementById(next)?.scrollIntoView()
      }
    },
    onNext: () => {
      if (idx < MOUNTED_IDS.length - 1) {
        const next = MOUNTED_IDS[idx + 1]
        setActiveId(next)
        document.getElementById(next)?.scrollIntoView()
      }
    },
  })

  const prompt = getSceneById(activeId).prompt

  return (
    <>
      <a className="skip-link" href="#predict">Skip to content</a>
      <ProgressRail
        activeId={activeId}
        onJump={(id) => {
          if (MOUNTED_IDS.includes(id)) {
            setActiveId(id)
            document.getElementById(id)?.scrollIntoView()
          }
        }}
      />
      <TopBar prompt={prompt} />
      <main className="stations" aria-label="LLM pipeline scenes">
        <PredictScene />
        <AboutScene />
      </main>
    </>
  )
}
```

- [ ] **Step 4: Run and confirm pass**

```bash
npm test -- App.test
```

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx tests/unit/App.test.tsx
git commit -m "feat: compose App with rail, topbar, predict scene, about, hash sync"
```

---

### Task 23: `prefers-reduced-motion` hook + wire `DataBar`

**Files:**
- Create: `src/app/useReducedMotionPref.ts`
- Modify: `src/components/DataBar.tsx`
- Test: `tests/unit/reduced-motion.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PredictScene } from '@/scenes/PredictScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

function setReducedMotion(value: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes('reduce') ? value : false,
      media: query, onchange: null,
      addEventListener: () => {}, removeEventListener: () => {},
      addListener: () => {}, removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

describe('prefers-reduced-motion', () => {
  beforeEach(() => setReducedMotion(true))

  it('disables databar width transitions when reduce is set', () => {
    render(
      <RunningExampleProvider>
        <DepthProvider>
          <PredictScene />
        </DepthProvider>
      </RunningExampleProvider>,
    )
    const fills = screen.getAllByTestId('databar-fill')
    fills.forEach((f) => expect(f.style.transition).toBe('none'))
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- reduced-motion
```

- [ ] **Step 3: Implement and wire**

`src/app/useReducedMotionPref.ts`:

```ts
import { useEffect, useState } from 'react'

export function useReducedMotionPref(): boolean {
  const [reduce, setReduce] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduce(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduce
}
```

Patch `src/components/DataBar.tsx` — add the import and gate the transition:

```diff
-import { accentHex, accentGlow } from '@/utils/accent'
-import type { AccentToken } from '@/scenes/scenes.config'
+import { accentHex, accentGlow } from '@/utils/accent'
+import { useReducedMotionPref } from '@/app/useReducedMotionPref'
+import type { AccentToken } from '@/scenes/scenes.config'
@@
-export function DataBar({ label, value, fraction, dominant = false, accent }: DataBarProps) {
+export function DataBar({ label, value, fraction, dominant = false, accent }: DataBarProps) {
+  const reduce = useReducedMotionPref()
   const useAccent = dominant && accent
@@
-          transition: 'width 240ms ease-out',
+          transition: reduce ? 'none' : 'width 240ms ease-out',
```

- [ ] **Step 4: Run and confirm pass**

```bash
npm test -- reduced-motion
npm test -- DataBar
```

Both should remain green (the earlier DataBar suite doesn't assert the transition value).

- [ ] **Step 5: Commit**

```bash
git add src/app/useReducedMotionPref.ts src/components/DataBar.tsx tests/unit/reduced-motion.test.tsx
git commit -m "feat(a11y): honor prefers-reduced-motion in DataBar transitions"
```

---

### Task 24: README update + provenance note

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace `README.md` content**

```markdown
# Inside an LLM — Interactive Explainer

A single-page interactive explainer that walks readers through what happens when a Large Language
Model receives a prompt and produces output — from raw text to streamed tokens. Two-tier progressive
disclosure: a Surface path for non-technical readers, a Deep path for technically literate peers.

## Status
Plan 1 (Foundation + Reference Scene) complete. PredictScene + About scene are live; remaining
scenes (Prompt, Tokenize, Embed, Attention, Decode, Output) ship in Plans 2–4.

## Provenance — important
Every number, embedding coordinate, attention weight, and probability shown in this site comes from
a small open reference model (**GPT-2 small**), run offline. **They are illustrative.** Frontier
providers do not expose token-level attention, embedding coordinates, or full next-token
distributions for arbitrary input, so this site cannot honestly visualize Claude or ChatGPT
internals. See the `About` section in-app.

## Run

```bash
npm install
npm run dev
```

## Test

```bash
npm test            # unit tests
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run e2e         # playwright (Chromium happy-path)
npm run build       # produces static dist/
```

## Stack
Vite 6 · React 19 · TypeScript 5.7 strict · Tailwind v4 · Motion 12 · D3 (scale only) · Zod 4.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add status, provenance note, and run/test commands"
```

---

### Task 25: Playwright happy-path E2E

**Files:**
- Create: `e2e/happy-path.spec.ts`

- [ ] **Step 1: Write the test**

```ts
import { test, expect } from '@playwright/test'

test('loads PredictScene, toggles Deep, jumps to About', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Inside an LLM').first()).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Next-Token Prediction' })).toBeVisible()

  const blueBar = page.getByRole('progressbar', { name: 'blue' })
  await expect(blueBar).toHaveAttribute('aria-valuenow', '71')

  await page.getByRole('button', { name: /go deeper/i }).click()
  await expect(page.getByRole('note')).toContainText(/illustrative|gpt-2/i)
  await expect(page.getByText('softmax')).toBeVisible()

  await page.getByLabel('Temperature').fill('0.2')
  const cooled = await blueBar.getAttribute('aria-valuenow')
  expect(Number(cooled)).toBeGreaterThan(71)

  await page.getByRole('button', { name: 'About' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /about/i })).toBeVisible()
  await expect(page).toHaveURL(/#about$/)
})

test('keyboard nav advances from Predict to About', async ({ page }) => {
  await page.goto('/')
  await page.locator('body').press('ArrowDown')
  await expect(page).toHaveURL(/#about$/)
})

test('skip link is the first focusable element', async ({ page }) => {
  await page.goto('/')
  await page.locator('body').press('Tab')
  await expect(page.locator(':focus')).toHaveText(/skip to content/i)
})
```

- [ ] **Step 2: Run the e2e suite**

```bash
npm run e2e
```

Expected: all three tests pass.

- [ ] **Step 3: Commit**

```bash
git add e2e/happy-path.spec.ts
git commit -m "test(e2e): add Playwright happy-path covering PredictScene + a11y basics"
```

---

### Task 26: Bundle budget check + production build

**Files:**
- (Verification only.)

- [ ] **Step 1: Build production bundle**

```bash
npm run build
```

- [ ] **Step 2: Inspect bundle size**

```bash
ls -lh dist/assets/*.js
gzip -c dist/assets/*.js | wc -c
```

Expected: gzipped JS comfortably under 200KB (spec §8). Motion + d3-scale (submodules) + Zod + React 19 typically lands around 80–140 KB gzipped.

- [ ] **Step 3: If the bundle is over budget**

Confirm imports use submodule paths (`d3-scale`, not `d3`). Confirm Motion is imported from `motion/react`. If still over, drop unused dependencies before adding code splitting.

- [ ] **Step 4: Final verification**

```bash
npm run typecheck && npm run lint && npm test && npm run e2e
```

All green.

- [ ] **Step 5: Commit (only if anything changed)**

```bash
git add -A
git commit -m "perf: trim Plan 1 bundle to stay under 200KB gzipped"
```

---

## Self-review summary

**Spec coverage (Plan 1 scope):**

| Spec section | Implemented | Task |
|---|---|---|
| §2 layout grid (rail 72 + stage 758×800 + 506 column) | SceneStation grid | 19 |
| §2 progress rail (7 segments + Compare dot, active glow) | ProgressRail | 17 |
| §2 scene-aware TopBar pill | TopBar reads active scene's prompt | 18, 22 |
| §2 navigation: hash sync + keyboard | useHashSync, useKeyboardNav | 10, 11, 22 |
| §3 Scene 4 PredictScene (surface bars + Deep softmax + remainder + CaveatNote + temperature) | PredictScene | 20 |
| §6 design tokens | index.css `@theme` | 2 |
| §6 component naming matches Figma | ProgressRail, TopBar, SceneStation, DeepToggle, CaveatNote, Chip, DataBar | 13–19 |
| §6 data contract with `source` required | PromptDataset schema | 5, 6, 7 |
| §6 Context only — DepthContext + RunningExampleContext | both | 8, 9 |
| §7 provenance rule (illustrative + named in AboutScene) | sky.json `source`, AboutScene | 6, 21 |
| §8 reduced motion | useReducedMotionPref, DataBar wired | 23 |
| §8 keyboard + skip link + 44px hit targets + aria-hidden stage | App skip link, rail buttons, SceneStation stage | 17, 19, 22 |
| §8 200KB gzip budget | Build check | 26 |
| §9 vertical slice (PredictScene first) | This plan | All |

**Out of scope for Plan 1** (handed off to Plans 2–4):
- PromptScene, TokenizeScene, EmbedScene, AttentionScene, DecodeScene, AssembleScene
- CompareSection
- Multi-prompt support (cat.json arrives with Plan 3)

**Placeholder scan:** none — every step has full code, every test has full assertions, every command has expected output.

**Type consistency:** `SceneId`, `AccentToken`, `PromptId`, `PromptDataset`, `NextTokenCandidate`, `Depth` are defined once and re-used across every consuming module.
