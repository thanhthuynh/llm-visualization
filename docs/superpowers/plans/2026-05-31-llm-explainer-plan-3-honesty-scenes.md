# Interactive LLM Explainer — Plan 3: Honesty-Critical Scenes

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Source spec:** `/Users/thanh/workspace/obsidian-primary-vault/llm-explainer-spec-v1.1.md`
**Builds on:** Plan 1 (`2026-05-30-llm-explainer-foundation.md`), Plan 2 (`2026-05-31-llm-explainer-plan-2-mvp-scenes.md`), and the post-Plan-2 PR #3 Figma-fidelity refactor (responsive SceneStation, `--gutter-*` / `--col-*` / `--stage-*` tokens, `<DeepPanel>`, `<SceneNav>`).
**Goal:** Add the two scenes the spec calls out as the project's truth-stakes — Embeddings (`⚐ honesty-critical`) and Attention (`⚐⚐ the classic trap`). After Plan 3 the full 7-scene pipeline is mounted.
**Architecture:** Both scenes are SVG-driven (per spec §5 — no Canvas, no Three.js for the design as drawn). Embeddings uses a 2D meaning-space with 8 dots + a contextual-shift animation. Attention uses surface arcs + a deep 8×8 causal matrix coloured by `d3-scale-chromatic` interpolator + a 3-head selector + TWO CaveatNotes (the spec mandates both). Adds a second precomputed dataset (`cat.json`) for "The cat sat down because it was tired".
**Tech stack delta from Plan 2:** `d3-scale-chromatic` and `d3-scale` (already installed, finally consumed for the magma color ramp). No new deps.

---

## File Structure (Plan 3 additions / modifications)

| Path | Responsibility |
|---|---|
| `src/data/prompts/cat.json` | 8-token attention dataset. 3 heads × 8×8 causal matrices. Row 5 ("it") matches the spec example. |
| `src/data/loader.ts` | Widen `PromptId` to `'sky' \| 'cat'`. Add `cat` to the RAW registry. |
| `src/data/illustrative-embeddings.ts` | 8 hardcoded illustrative 2D dot positions + labels for EmbedScene's meaning-space (`sky`, `blue`, `cloud`, `rain`, `dog`, `cat`, `walked`, `ran`). |
| `src/components/EmbeddingDot.tsx` | A single SVG `<circle>` + label `<text>`. Hover/focus shows the token name; `aria-hidden` on the SVG since the prose carries meaning. |
| `src/components/EmbeddingSpace.tsx` | SVG axes ("meaning →"), N dots via EmbeddingDot, optional cluster ellipse, optional contextual-shift ghost+connector+shifted-dot. |
| `src/components/AttentionArc.tsx` | SVG `<path>` Bezier arc from a query token x-position back to a source token x-position; stroke-opacity & width scale with weight. |
| `src/components/AttentionMatrix.tsx` | 8×8 grid (`<svg>`) with `keys →` / `queries ↓` axes; lower triangle filled with d3 `interpolateMagma`; upper triangle blank. Highlights the active query row. |
| `src/components/HeadSelector.tsx` | Three buttons "Head 1 / Head 2 / Head 3" with `aria-pressed`; calls `onSelect(headIndex: 0\|1\|2)`. |
| `src/scenes/EmbedScene.tsx` | Cyan `embed` accent. Surface: meaning-space + cluster ellipse. Deep: contextual-shift, dim row (768–4096 dims), CaveatNote on `king-man+woman`. |
| `src/scenes/AttentionScene.tsx` | Magenta `attention` accent. Surface: token row + arcs to "cat / because / sat / down / The" + inline "Simplified — open Go deeper" note. Deep: AttentionMatrix + HeadSelector + mechanism row + **two** CaveatNotes. |
| `src/scenes/scenes.config.ts` | Flip `embed.implemented` and `attention.implemented` to `true`. |
| `tests/unit/cat-dataset.test.ts` | Schema parse + assert row-5 weights match the spec, all rows lower-triangular and sum ≈1. |
| `tests/unit/EmbeddingDot.test.tsx` | Renders at given (x,y), exposes label, aria-hidden. |
| `tests/unit/EmbeddingSpace.test.tsx` | Renders axes labels, N dots, optional cluster + shift dot. |
| `tests/unit/AttentionArc.test.tsx` | Renders SVG path; stroke-opacity scales with weight. |
| `tests/unit/AttentionMatrix.test.tsx` | 64 cells, lower-triangle filled, upper-triangle has `data-blank`, query row highlighted. |
| `tests/unit/HeadSelector.test.tsx` | 3 buttons, `aria-pressed` flips, calls onSelect. |
| `tests/unit/EmbedScene.test.tsx` | h2, eyebrow, dot count, deep contextual-shift dot + CaveatNote + dim row. |
| `tests/unit/AttentionScene.test.tsx` | h2, inline simplified note, surface arcs, deep matrix + selector + 2 CaveatNotes + mechanism row. |
| `tests/unit/scenes.config.test.ts` | Update implemented-IDs expectation. |
| `e2e/honesty-scenes.spec.ts` | Open `#attention`, assert two `<note>` roles in deep panel, switch head, confirm Embed CaveatNote. |

---

## Patterns this plan locks in

| Category | Pattern |
|---|---|
| **SVG components** | Outer `<svg>` carries `aria-label`. Inner geometry uses `data-testid` for tests, never role="img" (the prose carries meaning). The stage frame is already `aria-hidden`-equivalent (data-stage-frame, post-PR-3); SVG elements inside don't need redundant aria-hiding. |
| **d3 imports** | Submodule paths only: `from 'd3-scale'` and `from 'd3-scale-chromatic'`. Never `from 'd3'`. |
| **Color scales** | `scaleSequential(interpolateMagma).domain([0, 1])` — instance per render is fine; d3 scale construction is cheap. |
| **Dataset isolation** | AttentionScene imports cat dataset DIRECTLY via `loadPromptDataset('cat')`. It does NOT use `useRunningExample()` because its prompt is fixed by the spec ("The cat sat down because it was tired"). EmbedScene uses hardcoded illustrative dots; it does not depend on the running-example dataset either. |
| **Two CaveatNotes** | AttentionScene's deep panel must render exactly TWO `<note>` elements (per spec §3 Scene 3) — flow ≠ reasoning + one-head-one-layer omission. Both visible at all times in deep. |

---

## Validation commands

```bash
npm run typecheck   # tsc --noEmit (both projects)
npm run lint        # eslint .
npm test            # vitest run
npm run e2e         # playwright (Chromium)
npm run build       # vite build; assert bundle < 200 KB gz
```

After Plan 3 completion: unit tests should grow by ~30 new tests. Bundle should grow ~5–15 KB gz from finally consuming `d3-scale` + `d3-scale-chromatic`.

---

## Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| `d3-scale-chromatic` interpolator import path drift across versions | Low | Plan pins exact import: `import { interpolateMagma } from 'd3-scale-chromatic'`. |
| SVG geometry math errors (arc control points, cell positions) | Med | Each geometry helper is a pure function with a unit test covering one fixed input. |
| Attention matrix accidentally fills upper triangle | High (easy bug) | Test asserts every cell where `j > i` has `data-blank="true"` and `fill` is the inactive grey, not the magma color. |
| EmbedScene contextual-shift dot interpreted as a real model output | Med | The shift is rendered with a dashed ghost stroke + a "2D = projection" badge in the dim row; CaveatNote calls it out explicitly. |
| `cat.json` invents weights that don't sum to 1 per row | High (data hygiene) | Schema already enforces `[0,1]` per cell; test additionally asserts row sums to within `[0.99, 1.01]`. |
| Mounting both scenes pushes Attention below the fold without proper scroll-snap | Low | App.tsx's `<main className="stations">` already snaps; SceneStation already enforces `min-height: 100vh`. |

---

## Tasks

### Task 1: `cat.json` dataset + loader widening

**Files:**
- Create: `src/data/prompts/cat.json`
- Modify: `src/data/loader.ts`
- Create: `tests/unit/cat-dataset.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/unit/cat-dataset.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import cat from '@/data/prompts/cat.json'
import { PromptDatasetSchema } from '@/data/schema'

describe('cat.json', () => {
  it('matches the schema', () => {
    expect(() => PromptDatasetSchema.parse(cat)).not.toThrow()
  })

  it('has 8 tokens for "The cat sat down because it was tired"', () => {
    const tokens = (cat as { tokens: Array<{ text: string }> }).tokens
    expect(tokens.map((t) => t.text)).toEqual([
      'The',
      ' cat',
      ' sat',
      ' down',
      ' because',
      ' it',
      ' was',
      ' tired',
    ])
  })

  it("has 3 attention heads of 8x8 each", () => {
    const heads = (cat as { attention: { heads: number[][][] } }).attention.heads
    expect(heads).toHaveLength(3)
    heads.forEach((head) => {
      expect(head).toHaveLength(8)
      head.forEach((row) => expect(row).toHaveLength(8))
    })
  })

  it("row 5 of head 0 (the 'it' query) matches the spec example weights", () => {
    const itRow = (cat as { attention: { heads: number[][][] } }).attention.heads[0][5]
    expect(itRow[1]).toBeCloseTo(0.61, 2) // cat
    expect(itRow[4]).toBeCloseTo(0.14, 2) // because
    expect(itRow[2]).toBeCloseTo(0.09, 2) // sat
    expect(itRow[3]).toBeCloseTo(0.08, 2) // down
    expect(itRow[0]).toBeCloseTo(0.05, 2) // The
  })

  it("respects the causal mask — upper triangle is all 0", () => {
    const heads = (cat as { attention: { heads: number[][][] } }).attention.heads
    heads.forEach((head) => {
      head.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (j > i) expect(cell).toBe(0)
        })
      })
    })
  })

  it("each row sums to ~1", () => {
    const heads = (cat as { attention: { heads: number[][][] } }).attention.heads
    heads.forEach((head) => {
      head.forEach((row) => {
        const sum = row.reduce((a, b) => a + b, 0)
        expect(sum).toBeGreaterThanOrEqual(0.99)
        expect(sum).toBeLessThanOrEqual(1.01)
      })
    })
  })

  it("labels itself as illustrative", () => {
    expect((cat as { source: string }).source.toLowerCase()).toMatch(/illustrative|gpt-2/)
  })
})
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- cat-dataset
```

Expected: FAIL — "Cannot find module '@/data/prompts/cat.json'".

- [ ] **Step 3: Create `src/data/prompts/cat.json`**

```json
{
  "prompt": "The cat sat down because it was tired",
  "source": "GPT-2 small, run offline — illustrative reference model. Token IDs and attention weights are illustrative; row 5 (the 'it' query) of head 0 matches the values shown in the Figma mockup.",
  "tokens": [
    { "text": "The",     "id": 464 },
    { "text": " cat",    "id": 3797 },
    { "text": " sat",    "id": 3332 },
    { "text": " down",   "id": 866 },
    { "text": " because","id": 780 },
    { "text": " it",     "id": 340 },
    { "text": " was",    "id": 373 },
    { "text": " tired",  "id": 10032 }
  ],
  "nextToken": [
    { "token": " .",     "p": 0.42, "logit": 2.3 },
    { "token": " and",   "p": 0.18, "logit": 1.4 },
    { "token": " from",  "p": 0.10, "logit": 0.8 },
    { "token": " ,",     "p": 0.08, "logit": 0.6 },
    { "token": " after", "p": 0.05, "logit": 0.1 },
    { "token": " so",    "p": 0.05, "logit": 0.1 },
    { "token": " of",    "p": 0.03, "logit": -0.3 },
    { "token": " all",   "p": 0.02, "logit": -0.6 }
  ],
  "embedding2d": [
    [-0.30,  0.10],
    [-0.20,  0.55],
    [ 0.40, -0.05],
    [ 0.55, -0.15],
    [-0.05, -0.40],
    [-0.10,  0.40],
    [ 0.35, -0.20],
    [ 0.60,  0.45]
  ],
  "attention": {
    "heads": [
      [
        [1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
        [0.30, 0.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
        [0.10, 0.60, 0.30, 0.00, 0.00, 0.00, 0.00, 0.00],
        [0.05, 0.30, 0.50, 0.15, 0.00, 0.00, 0.00, 0.00],
        [0.05, 0.10, 0.30, 0.40, 0.15, 0.00, 0.00, 0.00],
        [0.05, 0.61, 0.09, 0.08, 0.14, 0.03, 0.00, 0.00],
        [0.05, 0.40, 0.05, 0.05, 0.05, 0.30, 0.10, 0.00],
        [0.05, 0.40, 0.05, 0.05, 0.10, 0.20, 0.05, 0.10]
      ],
      [
        [1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
        [0.40, 0.60, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
        [0.10, 0.40, 0.50, 0.00, 0.00, 0.00, 0.00, 0.00],
        [0.05, 0.15, 0.40, 0.40, 0.00, 0.00, 0.00, 0.00],
        [0.05, 0.10, 0.20, 0.40, 0.25, 0.00, 0.00, 0.00],
        [0.10, 0.30, 0.10, 0.15, 0.25, 0.10, 0.00, 0.00],
        [0.05, 0.20, 0.10, 0.10, 0.20, 0.20, 0.15, 0.00],
        [0.05, 0.20, 0.10, 0.10, 0.20, 0.20, 0.05, 0.10]
      ],
      [
        [1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
        [0.20, 0.80, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
        [0.05, 0.70, 0.25, 0.00, 0.00, 0.00, 0.00, 0.00],
        [0.05, 0.50, 0.30, 0.15, 0.00, 0.00, 0.00, 0.00],
        [0.05, 0.40, 0.20, 0.20, 0.15, 0.00, 0.00, 0.00],
        [0.10, 0.55, 0.10, 0.10, 0.10, 0.05, 0.00, 0.00],
        [0.05, 0.50, 0.10, 0.10, 0.10, 0.10, 0.05, 0.00],
        [0.05, 0.55, 0.05, 0.05, 0.10, 0.10, 0.05, 0.05]
      ]
    ]
  },
  "bytes": {
    " cat": "20 63 61 74",
    " it": "20 69 74"
  }
}
```

- [ ] **Step 4: Replace `src/data/loader.ts`**

```ts
import sky from '@/data/prompts/sky.json'
import cat from '@/data/prompts/cat.json'
import { PromptDatasetSchema, type PromptDataset } from './schema'

export type PromptId = 'sky' | 'cat'

const RAW: Record<PromptId, unknown> = { sky, cat }

export function loadPromptDataset(id: PromptId): PromptDataset {
  if (!(id in RAW)) throw new Error(`unknown prompt id: ${id}`)
  return PromptDatasetSchema.parse(RAW[id])
}
```

- [ ] **Step 5: Re-run + verify**

```bash
npm test -- cat-dataset
npm test
npm run typecheck && npm run lint
```

Expected: 7 cat-dataset tests pass; full suite stays green; typecheck/lint exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/data/prompts/cat.json src/data/loader.ts tests/unit/cat-dataset.test.ts
git commit -m "feat(data): add cat.json dataset + widen PromptId to sky|cat"
```

---

### Task 2: `EmbeddingDot` component

**Files:**
- Create: `src/components/EmbeddingDot.tsx`
- Create: `tests/unit/EmbeddingDot.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmbeddingDot } from '@/components/EmbeddingDot'
import type { ReactNode } from 'react'

function renderInSvg(node: ReactNode) {
  return render(<svg width={200} height={200}>{node}</svg>)
}

describe('EmbeddingDot', () => {
  it('renders a circle at the given (x, y)', () => {
    renderInSvg(<EmbeddingDot x={50} y={80} label="sky" />)
    const dot = screen.getByTestId('embedding-dot-sky')
    expect(dot.getAttribute('cx')).toBe('50')
    expect(dot.getAttribute('cy')).toBe('80')
  })

  it('renders the label text near the dot', () => {
    renderInSvg(<EmbeddingDot x={50} y={80} label="sky" />)
    expect(screen.getByText('sky')).toBeInTheDocument()
  })

  it('applies the accent color when accent prop is provided', () => {
    renderInSvg(<EmbeddingDot x={50} y={80} label="sky" accent="embed" />)
    const dot = screen.getByTestId('embedding-dot-sky')
    expect(dot.getAttribute('fill')?.toLowerCase()).toContain('4cc9f0')
  })

  it('renders a ghost variant with dashed stroke + no fill', () => {
    renderInSvg(<EmbeddingDot x={50} y={80} label="sky" ghost />)
    const dot = screen.getByTestId('embedding-dot-sky')
    expect(dot.getAttribute('fill')).toBe('none')
    expect(dot.getAttribute('stroke-dasharray')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run + confirm failure**

```bash
npm test -- EmbeddingDot
```

- [ ] **Step 3: Implement `src/components/EmbeddingDot.tsx`**

```tsx
import { accentHex } from '@/utils/accent'
import type { AccentToken } from '@/scenes/scenes.config'

interface EmbeddingDotProps {
  x: number
  y: number
  label: string
  accent?: AccentToken
  ghost?: boolean
  radius?: number
}

export function EmbeddingDot({ x, y, label, accent, ghost = false, radius = 5 }: EmbeddingDotProps) {
  const fill = ghost ? 'none' : accent ? accentHex(accent) : 'var(--color-text-primary)'
  const stroke = ghost ? (accent ? accentHex(accent) : 'var(--color-text-muted)') : 'transparent'
  return (
    <g>
      <circle
        data-testid={`embedding-dot-${label}`}
        cx={x}
        cy={y}
        r={radius}
        fill={fill}
        stroke={stroke}
        strokeWidth={ghost ? 1.5 : 0}
        strokeDasharray={ghost ? '3 3' : undefined}
      />
      <text
        x={x + radius + 4}
        y={y + 4}
        fontFamily="var(--font-mono)"
        fontSize={11}
        fill="var(--color-text-muted)"
      >
        {label}
      </text>
    </g>
  )
}
```

- [ ] **Step 4: Run + confirm pass; typecheck/lint**

- [ ] **Step 5: Commit**

```bash
git add src/components/EmbeddingDot.tsx tests/unit/EmbeddingDot.test.tsx
git commit -m "feat: add EmbeddingDot SVG component (solid + ghost variants)"
```

---

### Task 3: `EmbeddingSpace` + illustrative dot positions

**Files:**
- Create: `src/data/illustrative-embeddings.ts`
- Create: `src/components/EmbeddingSpace.tsx`
- Create: `tests/unit/EmbeddingSpace.test.tsx`

- [ ] **Step 1: Write `src/data/illustrative-embeddings.ts`**

```ts
export interface IllustrativeDot {
  label: string
  x: number // normalised −1..1
  y: number
}

export const ILLUSTRATIVE_DOTS: ReadonlyArray<IllustrativeDot> = [
  { label: 'sky',    x: -0.55, y: -0.40 },
  { label: 'blue',   x: -0.30, y: -0.55 },
  { label: 'cloud',  x: -0.50, y: -0.15 },
  { label: 'rain',   x: -0.20, y: -0.20 },
  { label: 'dog',    x:  0.45, y:  0.30 },
  { label: 'cat',    x:  0.55, y:  0.10 },
  { label: 'walked', x:  0.25, y:  0.55 },
  { label: 'ran',    x:  0.45, y:  0.50 },
]
```

- [ ] **Step 2: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmbeddingSpace } from '@/components/EmbeddingSpace'
import { ILLUSTRATIVE_DOTS } from '@/data/illustrative-embeddings'

describe('EmbeddingSpace', () => {
  it('renders the meaning-axis labels', () => {
    render(<EmbeddingSpace dots={ILLUSTRATIVE_DOTS} />)
    expect(screen.getAllByText(/meaning/i).length).toBeGreaterThanOrEqual(2)
  })

  it('renders one dot per item', () => {
    render(<EmbeddingSpace dots={ILLUSTRATIVE_DOTS} />)
    ILLUSTRATIVE_DOTS.forEach((d) => {
      expect(screen.getByTestId(`embedding-dot-${d.label}`)).toBeInTheDocument()
    })
  })

  it('renders a cluster ellipse when cluster prop is set', () => {
    render(
      <EmbeddingSpace
        dots={ILLUSTRATIVE_DOTS}
        cluster={{ cx: -0.4, cy: -0.3, rx: 0.3, ry: 0.3 }}
      />,
    )
    expect(screen.getByTestId('embedding-cluster')).toBeInTheDocument()
  })

  it('renders the contextual-shift anchors when shift prop is set', () => {
    render(
      <EmbeddingSpace
        dots={ILLUSTRATIVE_DOTS}
        shift={{ from: 'sky', to: { x: -0.10, y: -0.45 } }}
      />,
    )
    expect(screen.getByTestId('embedding-shift-ghost')).toBeInTheDocument()
    expect(screen.getByTestId('embedding-shift-shifted')).toBeInTheDocument()
    expect(screen.getByTestId('embedding-shift-line')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run + confirm failure**

```bash
npm test -- EmbeddingSpace
```

- [ ] **Step 4: Implement `src/components/EmbeddingSpace.tsx`**

```tsx
import { EmbeddingDot } from './EmbeddingDot'
import type { AccentToken } from '@/scenes/scenes.config'
import type { IllustrativeDot } from '@/data/illustrative-embeddings'

interface ClusterShape {
  cx: number
  cy: number
  rx: number
  ry: number
}

interface ShiftShape {
  from: string
  to: { x: number; y: number }
}

interface EmbeddingSpaceProps {
  dots: ReadonlyArray<IllustrativeDot>
  cluster?: ClusterShape
  shift?: ShiftShape
  accent?: AccentToken
  width?: number
  height?: number
}

const PAD = 32

function project(v: number, axis: 'x' | 'y', w: number, h: number): number {
  const size = axis === 'x' ? w : h
  return PAD + ((v + 1) / 2) * (size - 2 * PAD)
}

export function EmbeddingSpace({
  dots,
  cluster,
  shift,
  accent,
  width = 600,
  height = 400,
}: EmbeddingSpaceProps) {
  const fromDot = shift ? dots.find((d) => d.label === shift.from) : undefined

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-label="2D meaning space (illustrative)"
      style={{ display: 'block' }}
    >
      {/* axes */}
      <line x1={PAD} y1={height / 2} x2={width - PAD} y2={height / 2} stroke="var(--color-border)" />
      <line x1={width / 2} y1={PAD} x2={width / 2} y2={height - PAD} stroke="var(--color-border)" />
      <text x={width - PAD + 4} y={height / 2 + 4} fontSize={11} fill="var(--color-text-muted)">
        meaning →
      </text>
      <text x={width / 2 + 4} y={PAD - 6} fontSize={11} fill="var(--color-text-muted)">
        meaning ↑
      </text>

      {cluster && (
        <ellipse
          data-testid="embedding-cluster"
          cx={project(cluster.cx, 'x', width, height)}
          cy={project(cluster.cy, 'y', width, height)}
          rx={cluster.rx * (width / 2)}
          ry={cluster.ry * (height / 2)}
          fill="rgba(76, 201, 240, 0.08)"
          stroke="rgba(76, 201, 240, 0.4)"
          strokeDasharray="4 4"
        />
      )}

      {dots.map((d) => (
        <EmbeddingDot
          key={d.label}
          x={project(d.x, 'x', width, height)}
          y={project(d.y, 'y', width, height)}
          label={d.label}
          accent={accent}
        />
      ))}

      {shift && fromDot && (
        <>
          <g data-testid="embedding-shift-ghost">
            <EmbeddingDot
              x={project(fromDot.x, 'x', width, height)}
              y={project(fromDot.y, 'y', width, height)}
              label={`${fromDot.label} (input)`}
              ghost
            />
          </g>
          <line
            data-testid="embedding-shift-line"
            x1={project(fromDot.x, 'x', width, height)}
            y1={project(fromDot.y, 'y', width, height)}
            x2={project(shift.to.x, 'x', width, height)}
            y2={project(shift.to.y, 'y', width, height)}
            stroke="var(--color-accent-embed)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <g data-testid="embedding-shift-shifted">
            <EmbeddingDot
              x={project(shift.to.x, 'x', width, height)}
              y={project(shift.to.y, 'y', width, height)}
              label={`${shift.from} (after attention)`}
              accent="embed"
            />
          </g>
        </>
      )}
    </svg>
  )
}
```

- [ ] **Step 5: Run + confirm pass; typecheck/lint**

- [ ] **Step 6: Commit**

```bash
git add src/data/illustrative-embeddings.ts src/components/EmbeddingSpace.tsx tests/unit/EmbeddingSpace.test.tsx
git commit -m "feat: add EmbeddingSpace SVG (axes + dots + cluster + contextual-shift)"
```

---

### Task 4: `EmbedScene`

**Files:**
- Create: `src/scenes/EmbedScene.tsx`
- Create: `tests/unit/EmbedScene.test.tsx`
- Modify: `src/scenes/scenes.config.ts` — flip `embed.implemented = true`
- Modify: `tests/unit/scenes.config.test.ts` — add `'embed'` to expected mounted list (between `tokenize` and `predict`)

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmbedScene } from '@/scenes/EmbedScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

function renderScene() {
  return render(
    <RunningExampleProvider>
      <DepthProvider>
        <EmbedScene />
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('EmbedScene', () => {
  it('renders the heading', () => {
    renderScene()
    expect(screen.getByRole('heading', { level: 2, name: /embeddings/i })).toBeInTheDocument()
  })

  it("shows the 'A SPACE OF MEANING' eyebrow", () => {
    renderScene()
    expect(screen.getByText(/space of meaning/i)).toBeInTheDocument()
  })

  it('renders illustrative dots in the meaning space', () => {
    renderScene()
    expect(screen.getByTestId('embedding-dot-sky')).toBeInTheDocument()
    expect(screen.getByTestId('embedding-dot-cat')).toBeInTheDocument()
  })

  it('reveals the contextual-shift dot in Deep', async () => {
    renderScene()
    expect(screen.queryByTestId('embedding-shift-shifted')).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByTestId('embedding-shift-shifted')).toBeInTheDocument()
  })

  it('reveals the dim row in Deep with 768-4096 dims + 2D projection + position info', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/768.*4096/i)).toBeInTheDocument()
    expect(screen.getByText(/2D = projection/i)).toBeInTheDocument()
    expect(screen.getByText(/\+ position/i)).toBeInTheDocument()
  })

  it('shows a CaveatNote about king-man+woman in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const note = screen.getByRole('note')
    expect(note.textContent?.toLowerCase()).toMatch(/king.*man.*woman|word2vec|older idea/i)
  })
})
```

- [ ] **Step 2: Run + confirm failure**

- [ ] **Step 3: Implement `src/scenes/EmbedScene.tsx`**

```tsx
import { SceneStation } from '@/components/SceneStation'
import { CaveatNote } from '@/components/CaveatNote'
import { EmbeddingSpace } from '@/components/EmbeddingSpace'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { getSceneById } from '@/scenes/scenes.config'
import { ILLUSTRATIVE_DOTS } from '@/data/illustrative-embeddings'

const SCENE = getSceneById('embed')

export function EmbedScene() {
  const stage = (
    <div
      style={{
        padding: 'var(--stage-padding)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        height: '100%',
      }}
    >
      <EyebrowLabel>A space of meaning</EyebrowLabel>
      <div style={{ flex: 1, minHeight: 0 }}>
        <EmbeddingSpace
          dots={ILLUSTRATIVE_DOTS}
          cluster={{ cx: -0.4, cy: -0.3, rx: 0.35, ry: 0.35 }}
          accent="embed"
          width={600}
          height={420}
        />
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)' }}>
        Each token gets a position in a shared meaning space. Neighbours are related.
      </p>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>From tokens to vectors</EyebrowLabel>
      <p style={{ marginTop: 12 }}>
        Each token is mapped to a long vector — a position in a space the model has learned during
        training. Related tokens land near each other.
      </p>
    </>
  )

  const deeper = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <EyebrowLabel>Contextual shift</EyebrowLabel>
      <div style={{ width: '100%' }}>
        <EmbeddingSpace
          dots={ILLUSTRATIVE_DOTS}
          shift={{ from: 'sky', to: { x: -0.1, y: -0.45 } }}
          accent="embed"
          width={520}
          height={300}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
        }}
      >
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          768–4096 dims
        </span>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          2D = projection
        </span>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          + position
        </span>
      </div>
      <p>
        You&apos;re seeing a 2D projection of a space with hundreds to thousands of dimensions —
        flattening it distorts the real distances.
      </p>
      <p>
        The model also adds positional info so word order matters, and a token&apos;s spot keeps
        moving — meaning becomes contextual after attention (next step).
      </p>
      <CaveatNote>
        The famous <strong>king − man + woman ≈ queen</strong> story is an older idea (word2vec).
        Transformer embeddings shift with context, so a static-vector arithmetic picture isn&apos;t
        what the model does to your prompt.
      </CaveatNote>
    </div>
  )

  return (
    <SceneStation
      id={SCENE.id}
      title={SCENE.title}
      accent="embed"
      stage={stage}
      surface={surface}
      deeper={deeper}
    />
  )
}
```

- [ ] **Step 4: Flip `embed.implemented = true` in `scenes.config.ts`**

- [ ] **Step 5: Update `tests/unit/scenes.config.test.ts`**

Change the expected `implementedIds` list to include `'embed'` between `'tokenize'` and `'predict'`. After this task it becomes `['prompt', 'tokenize', 'embed', 'predict', 'decode', 'output', 'about']`.

- [ ] **Step 6: Run + verify**

```bash
npm test && npm run typecheck && npm run lint
```

- [ ] **Step 7: Commit**

```bash
git add src/scenes/EmbedScene.tsx tests/unit/EmbedScene.test.tsx src/scenes/scenes.config.ts tests/unit/scenes.config.test.ts
git commit -m "feat: build EmbedScene with meaning-space + contextual-shift + CaveatNote"
```

---

### Task 5: `AttentionArc` component

**Files:**
- Create: `src/components/AttentionArc.tsx`
- Create: `tests/unit/AttentionArc.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AttentionArc } from '@/components/AttentionArc'
import type { ReactNode } from 'react'

function renderInSvg(node: ReactNode) {
  return render(<svg width={400} height={120}>{node}</svg>)
}

describe('AttentionArc', () => {
  it('renders an SVG path with both endpoints anchored', () => {
    renderInSvg(<AttentionArc x1={50} x2={250} baseline={80} weight={0.5} label="cat" />)
    const arc = screen.getByTestId('attention-arc-cat')
    const d = arc.getAttribute('d') ?? ''
    expect(d).toMatch(/^M\s*50/)
    expect(d).toContain('250')
  })

  it('scales stroke-opacity with weight', () => {
    renderInSvg(<AttentionArc x1={50} x2={250} baseline={80} weight={0.9} label="cat" />)
    const arc = screen.getByTestId('attention-arc-cat')
    const opacity = Number(arc.getAttribute('stroke-opacity'))
    expect(opacity).toBeGreaterThan(0.7)
  })

  it('renders a percentage label', () => {
    renderInSvg(<AttentionArc x1={50} x2={250} baseline={80} weight={0.61} label="cat" />)
    expect(screen.getByText(/61/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run + confirm failure**

- [ ] **Step 3: Implement `src/components/AttentionArc.tsx`**

```tsx
interface AttentionArcProps {
  x1: number
  x2: number
  baseline: number
  weight: number
  label: string
}

export function AttentionArc({ x1, x2, baseline, weight, label }: AttentionArcProps) {
  const midX = (x1 + x2) / 2
  const lift = Math.max(24, Math.abs(x2 - x1) * 0.5)
  const controlY = baseline - lift
  const d = `M ${x1} ${baseline} Q ${midX} ${controlY} ${x2} ${baseline}`
  const opacity = Math.min(1, 0.25 + weight * 0.75)
  const strokeWidth = 1 + weight * 4
  const pct = Math.round(weight * 100)

  return (
    <g>
      <path
        data-testid={`attention-arc-${label}`}
        d={d}
        fill="none"
        stroke="var(--color-accent-attention)"
        strokeOpacity={opacity}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <text
        x={midX}
        y={controlY - 4}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={11}
        fill="var(--color-text-muted)"
      >
        {pct}%
      </text>
    </g>
  )
}
```

- [ ] **Step 4: Run + confirm pass; typecheck/lint**

- [ ] **Step 5: Commit**

```bash
git add src/components/AttentionArc.tsx tests/unit/AttentionArc.test.tsx
git commit -m "feat: add AttentionArc — quadratic Bezier with weight-scaled stroke"
```

---

### Task 6: `AttentionMatrix` component

**Files:**
- Create: `src/components/AttentionMatrix.tsx`
- Create: `tests/unit/AttentionMatrix.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AttentionMatrix } from '@/components/AttentionMatrix'

const tokens = ['The', 'cat', 'sat', 'down', 'because', 'it', 'was', 'tired']

const matrix = [
  [1, 0, 0, 0, 0, 0, 0, 0],
  [0.3, 0.7, 0, 0, 0, 0, 0, 0],
  [0.1, 0.6, 0.3, 0, 0, 0, 0, 0],
  [0.05, 0.3, 0.5, 0.15, 0, 0, 0, 0],
  [0.05, 0.1, 0.3, 0.4, 0.15, 0, 0, 0],
  [0.05, 0.61, 0.09, 0.08, 0.14, 0.03, 0, 0],
  [0.05, 0.4, 0.05, 0.05, 0.05, 0.3, 0.1, 0],
  [0.05, 0.4, 0.05, 0.05, 0.1, 0.2, 0.05, 0.1],
]

describe('AttentionMatrix', () => {
  it('renders 64 cells (8x8)', () => {
    render(<AttentionMatrix tokens={tokens} weights={matrix} queryIndex={5} />)
    expect(screen.getAllByTestId(/^attention-cell-/)).toHaveLength(64)
  })

  it("upper-triangle cells (j > i) are marked blank", () => {
    render(<AttentionMatrix tokens={tokens} weights={matrix} queryIndex={5} />)
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 8; j++) {
        const cell = screen.getByTestId(`attention-cell-${i}-${j}`)
        expect(cell.getAttribute('data-blank')).toBe('true')
      }
    }
  })

  it("lower-triangle cells are NOT marked blank and have a numeric fill color", () => {
    render(<AttentionMatrix tokens={tokens} weights={matrix} queryIndex={5} />)
    const cell = screen.getByTestId('attention-cell-5-1')
    expect(cell.getAttribute('data-blank')).toBeNull()
    expect(cell.getAttribute('fill')).toMatch(/^(rgb|#)/)
  })

  it('highlights the query row with a stronger stroke', () => {
    render(<AttentionMatrix tokens={tokens} weights={matrix} queryIndex={5} />)
    const cell = screen.getByTestId('attention-cell-5-1')
    expect(Number(cell.getAttribute('stroke-width') ?? '0')).toBeGreaterThan(0.5)
  })

  it("renders the axis labels 'keys →' and 'queries ↓'", () => {
    render(<AttentionMatrix tokens={tokens} weights={matrix} queryIndex={5} />)
    expect(screen.getByText(/keys →/i)).toBeInTheDocument()
    expect(screen.getByText(/queries ↓/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run + confirm failure**

- [ ] **Step 3: Implement `src/components/AttentionMatrix.tsx`**

```tsx
import { scaleSequential } from 'd3-scale'
import { interpolateMagma } from 'd3-scale-chromatic'

interface AttentionMatrixProps {
  tokens: ReadonlyArray<string>
  weights: ReadonlyArray<ReadonlyArray<number>>
  queryIndex: number
  cellSize?: number
}

export function AttentionMatrix({
  tokens,
  weights,
  queryIndex,
  cellSize = 36,
}: AttentionMatrixProps) {
  const n = tokens.length
  const labelGutter = 80
  const totalW = labelGutter + n * cellSize + 24
  const totalH = labelGutter + n * cellSize + 24
  const color = scaleSequential(interpolateMagma).domain([0, 1])

  return (
    <svg
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      aria-label="Attention matrix"
    >
      <text
        x={labelGutter + (n * cellSize) / 2}
        y={18}
        textAnchor="middle"
        fontSize={11}
        fill="var(--color-text-muted)"
      >
        keys →
      </text>
      <text
        x={14}
        y={labelGutter + (n * cellSize) / 2}
        textAnchor="middle"
        transform={`rotate(-90 14 ${labelGutter + (n * cellSize) / 2})`}
        fontSize={11}
        fill="var(--color-text-muted)"
      >
        queries ↓
      </text>

      {tokens.map((t, j) => (
        <text
          key={`col-${j}`}
          x={labelGutter + j * cellSize + cellSize / 2}
          y={labelGutter - 6}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-text-muted)"
        >
          {t.trim()}
        </text>
      ))}

      {tokens.map((t, i) => (
        <text
          key={`row-${i}`}
          x={labelGutter - 6}
          y={labelGutter + i * cellSize + cellSize / 2 + 4}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill={i === queryIndex ? 'var(--color-accent-attention)' : 'var(--color-text-muted)'}
          fontWeight={i === queryIndex ? 700 : 400}
        >
          {t.trim()}
        </text>
      ))}

      {tokens.map((_, i) =>
        tokens.map((__, j) => {
          const blank = j > i
          const x = labelGutter + j * cellSize
          const y = labelGutter + i * cellSize
          const w = weights[i][j]
          const fill = blank ? 'var(--color-rail-inactive)' : color(w)
          const isQueryRow = i === queryIndex
          return (
            <rect
              key={`cell-${i}-${j}`}
              data-testid={`attention-cell-${i}-${j}`}
              {...(blank ? { 'data-blank': 'true' } : {})}
              x={x}
              y={y}
              width={cellSize - 2}
              height={cellSize - 2}
              rx={4}
              fill={fill}
              stroke={isQueryRow && !blank ? 'var(--color-accent-attention)' : 'transparent'}
              strokeWidth={isQueryRow && !blank ? 1.5 : 0}
            />
          )
        }),
      )}
    </svg>
  )
}
```

- [ ] **Step 4: Run + confirm pass; typecheck/lint**

- [ ] **Step 5: Commit**

```bash
git add src/components/AttentionMatrix.tsx tests/unit/AttentionMatrix.test.tsx
git commit -m "feat: add AttentionMatrix 8x8 with d3 magma ramp + causal mask"
```

---

### Task 7: `HeadSelector` component

**Files:**
- Create: `src/components/HeadSelector.tsx`
- Create: `tests/unit/HeadSelector.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HeadSelector } from '@/components/HeadSelector'

describe('HeadSelector', () => {
  it('renders 3 head buttons', () => {
    render(<HeadSelector active={0} onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: /head 1/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /head 2/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /head 3/i })).toBeInTheDocument()
  })

  it('marks aria-pressed correctly for the active head', () => {
    render(<HeadSelector active={1} onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: /head 1/i })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: /head 2/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /head 3/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onSelect with the head index when clicked', async () => {
    const onSelect = vi.fn()
    render(<HeadSelector active={0} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: /head 2/i }))
    expect(onSelect).toHaveBeenCalledWith(1)
  })
})
```

- [ ] **Step 2: Run + confirm failure**

- [ ] **Step 3: Implement `src/components/HeadSelector.tsx`**

```tsx
import type { CSSProperties } from 'react'

interface HeadSelectorProps {
  active: 0 | 1 | 2
  onSelect: (index: 0 | 1 | 2) => void
}

const HEADS = [0, 1, 2] as const

function buttonStyle(isActive: boolean): CSSProperties {
  return {
    padding: '6px 14px',
    borderRadius: 'var(--radius-pill)',
    border: `1px solid ${isActive ? 'var(--color-accent-attention)' : 'var(--color-border)'}`,
    background: isActive
      ? 'color-mix(in srgb, var(--color-accent-attention) 16%, var(--color-surface-card))'
      : 'var(--color-surface-card)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    minHeight: 44,
  }
}

export function HeadSelector({ active, onSelect }: HeadSelectorProps) {
  return (
    <div role="group" aria-label="Attention head" style={{ display: 'flex', gap: 8 }}>
      {HEADS.map((i) => (
        <button
          key={i}
          type="button"
          aria-pressed={active === i}
          onClick={() => onSelect(i)}
          style={buttonStyle(active === i)}
        >
          Head {i + 1}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run + confirm pass; typecheck/lint**

- [ ] **Step 5: Commit**

```bash
git add src/components/HeadSelector.tsx tests/unit/HeadSelector.test.tsx
git commit -m "feat: add HeadSelector 3-button group with aria-pressed"
```

---

### Task 8: `AttentionScene`

**Files:**
- Create: `src/scenes/AttentionScene.tsx`
- Create: `tests/unit/AttentionScene.test.tsx`
- Modify: `src/scenes/scenes.config.ts` — flip `attention.implemented = true`
- Modify: `tests/unit/scenes.config.test.ts` — add `'attention'` to expected list (between `'embed'` and `'predict'`)

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AttentionScene } from '@/scenes/AttentionScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

function renderScene() {
  return render(
    <RunningExampleProvider>
      <DepthProvider>
        <AttentionScene />
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('AttentionScene', () => {
  it('renders the heading', () => {
    renderScene()
    expect(screen.getByRole('heading', { level: 2, name: /attention/i })).toBeInTheDocument()
  })

  it("shows the inline 'Simplified — open Go deeper' note on the surface", () => {
    renderScene()
    expect(screen.getByText(/simplified/i)).toBeInTheDocument()
    expect(screen.getByText(/go deeper to see/i)).toBeInTheDocument()
  })

  it('renders surface arcs from the it query to earlier tokens', () => {
    renderScene()
    expect(screen.getByTestId('attention-arc-cat')).toBeInTheDocument()
    expect(screen.getByTestId('attention-arc-because')).toBeInTheDocument()
    expect(screen.getByTestId('attention-arc-sat')).toBeInTheDocument()
  })

  it('renders the 8 cat-prompt tokens on the surface', () => {
    renderScene()
    const stageTokens = ['The', 'cat', 'sat', 'down', 'because', 'it', 'was', 'tired']
    stageTokens.forEach((t) =>
      expect(screen.getAllByText(new RegExp(`^${t}$`)).length).toBeGreaterThanOrEqual(1),
    )
  })

  it('renders the 8x8 matrix in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getAllByTestId(/^attention-cell-/)).toHaveLength(64)
  })

  it('renders the head selector in Deep with Head 1 active by default', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByRole('button', { name: /head 1/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders the mechanism row in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/q.k|SCORE/i)).toBeInTheDocument()
    expect(screen.getByText(/softmax/i)).toBeInTheDocument()
    expect(screen.getByText(/Σ.*w.*v|BLEND|VALUES/i)).toBeInTheDocument()
  })

  it('renders TWO CaveatNotes in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const notes = screen.getAllByRole('note')
    expect(notes).toHaveLength(2)
    const allText = notes.map((n) => n.textContent?.toLowerCase() ?? '').join(' | ')
    expect(allText).toMatch(/information.*flow|reasoning|contested/)
    expect(allText).toMatch(/one head|one layer|feed-?forward|dozens/)
  })

  it('switches matrix when a different head is selected', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const before = screen.getByTestId('attention-cell-5-1').getAttribute('fill')
    await userEvent.click(screen.getByRole('button', { name: /head 2/i }))
    const after = screen.getByTestId('attention-cell-5-1').getAttribute('fill')
    expect(after).not.toBe(before)
  })
})
```

- [ ] **Step 2: Run + confirm failure**

- [ ] **Step 3: Implement `src/scenes/AttentionScene.tsx`**

```tsx
import { useState } from 'react'
import { SceneStation } from '@/components/SceneStation'
import { CaveatNote } from '@/components/CaveatNote'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { AttentionArc } from '@/components/AttentionArc'
import { AttentionMatrix } from '@/components/AttentionMatrix'
import { HeadSelector } from '@/components/HeadSelector'
import { getSceneById } from '@/scenes/scenes.config'
import { loadPromptDataset } from '@/data/loader'

const SCENE = getSceneById('attention')
const CAT = loadPromptDataset('cat')

const QUERY_INDEX = 5 // ' it'

const TOKEN_X: ReadonlyArray<number> = Array.from(
  { length: 8 },
  (_, i) => 80 + i * 70 + 30,
)
const BASELINE_Y = 240

const SURFACE_ARCS = [
  { from: 1, label: 'cat' },
  { from: 4, label: 'because' },
  { from: 2, label: 'sat' },
  { from: 3, label: 'down' },
  { from: 0, label: 'The' },
] as const

function chipDisplay(text: string): string {
  return text.startsWith(' ') ? text.slice(1) : text
}

export function AttentionScene() {
  const [head, setHead] = useState<0 | 1 | 2>(0)
  const tokens = CAT.tokens.map((t) => chipDisplay(t.text))
  const headWeights = CAT.attention.heads[head]
  const queryRow = headWeights[QUERY_INDEX]

  const stage = (
    <div
      style={{
        padding: 'var(--stage-padding)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        height: '100%',
      }}
    >
      <EyebrowLabel>Who is &ldquo;it&rdquo; looking at?</EyebrowLabel>
      <svg width={620} height={300} viewBox="0 0 620 300" aria-label="Attention arcs">
        {SURFACE_ARCS.map((a) => (
          <AttentionArc
            key={a.label}
            x1={TOKEN_X[QUERY_INDEX]}
            x2={TOKEN_X[a.from]}
            baseline={BASELINE_Y}
            weight={queryRow[a.from]}
            label={a.label}
          />
        ))}
        {tokens.map((t, i) => (
          <g key={i}>
            <rect
              x={TOKEN_X[i] - 28}
              y={BASELINE_Y - 4}
              width={56}
              height={28}
              rx={14}
              fill={i === QUERY_INDEX ? 'var(--color-accent-attention)' : 'var(--color-surface-card)'}
              stroke="var(--color-border)"
            />
            <text
              x={TOKEN_X[i]}
              y={BASELINE_Y + 14}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={12}
              fill={i === QUERY_INDEX ? '#fff' : 'var(--color-text-primary)'}
            >
              {t}
            </text>
          </g>
        ))}
      </svg>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--color-text-muted)',
          margin: 0,
        }}
      >
        Simplified — open Go deeper to see what&apos;s really going on.
      </p>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>Letting tokens look at each other</EyebrowLabel>
      <p style={{ marginTop: 12 }}>
        At each layer, every token can look at every earlier token and weigh how much each one
        matters for the next prediction. Above, the pronoun <em>it</em> pulls most of its
        information from <em>cat</em>.
      </p>
    </>
  )

  const deeper = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <EyebrowLabel>The actual attention matrix</EyebrowLabel>
      <HeadSelector active={head} onSelect={setHead} />
      <div style={{ overflowX: 'auto' }}>
        <AttentionMatrix tokens={tokens} weights={headWeights} queryIndex={QUERY_INDEX} />
      </div>
      <p
        style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)' }}
      >
        Darker = more attention. The upper triangle is blank — a token can only attend to itself
        and earlier tokens, never the future.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <EyebrowLabel>Under the hood</EyebrowLabel>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto auto auto auto',
            gap: 8,
            alignItems: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
          }}
        >
          <span>q·k</span>
          <span style={{ color: 'var(--color-text-muted)' }}>SCORE</span>
          <span style={{ color: 'var(--color-text-muted)' }}>→</span>
          <span>softmax</span>
          <span style={{ color: 'var(--color-text-muted)' }}>WEIGHTS</span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto auto',
            gap: 8,
            alignItems: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
          }}
        >
          <span>Σ w·v</span>
          <span style={{ color: 'var(--color-text-muted)' }}>→</span>
          <span>BLEND VALUES</span>
        </div>
      </div>
      <CaveatNote>
        Attention shows where information <em>can flow</em>, not a transparent readout of the
        model&apos;s &ldquo;understanding&rdquo;. Reading it as reasoning is contested.
      </CaveatNote>
      <CaveatNote>
        This is one head in one layer. Real models stack dozens of layers with multiple heads each,
        and the feed-forward (MLP) sublayers — which do much of the actual work — aren&apos;t
        pictured at all.
      </CaveatNote>
    </div>
  )

  return (
    <SceneStation
      id={SCENE.id}
      title={SCENE.title}
      accent="attention"
      stage={stage}
      surface={surface}
      deeper={deeper}
    />
  )
}
```

- [ ] **Step 4: Flip `attention.implemented = true` in `scenes.config.ts`**

- [ ] **Step 5: Update `tests/unit/scenes.config.test.ts`**

Change expected `implementedIds` to `['prompt', 'tokenize', 'embed', 'attention', 'predict', 'decode', 'output', 'about']`.

- [ ] **Step 6: Run + verify; typecheck/lint**

- [ ] **Step 7: Commit**

```bash
git add src/scenes/AttentionScene.tsx tests/unit/AttentionScene.test.tsx src/scenes/scenes.config.ts tests/unit/scenes.config.test.ts
git commit -m "feat: build AttentionScene with arcs + matrix + head selector + 2 caveats"
```

---

### Task 9: Mount the two new scenes in `App.tsx`

**Files:**
- Modify: `src/App.tsx`
- Modify: `tests/unit/App.test.tsx`

- [ ] **Step 1: Update `tests/unit/App.test.tsx` to expect the two new headings**

Inside the existing "renders all mounted scene headings" test (or the closest equivalent), add:

```ts
expect(screen.getByRole('heading', { level: 2, name: /embeddings/i })).toBeInTheDocument()
expect(screen.getByRole('heading', { level: 2, name: /attention/i })).toBeInTheDocument()
```

- [ ] **Step 2: Run + confirm failure**

- [ ] **Step 3: Update `src/App.tsx`**

Add imports near the existing scene imports:

```tsx
import { EmbedScene } from '@/scenes/EmbedScene'
import { AttentionScene } from '@/scenes/AttentionScene'
```

Update the `<main className="stations">` block to insert the new scenes in pipeline order:

```tsx
<main className="stations" aria-label="LLM pipeline scenes">
  <PromptScene />
  <TokenizeScene />
  <EmbedScene />
  <AttentionScene />
  <PredictScene />
  <DecodeScene />
  <AssembleScene />
  <AboutScene />
</main>
```

- [ ] **Step 4: Run + confirm pass; typecheck/lint**

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx tests/unit/App.test.tsx
git commit -m "feat: mount EmbedScene + AttentionScene in App"
```

---

### Task 10: Cross-scene Playwright E2E for honesty scenes

**Files:**
- Create: `e2e/honesty-scenes.spec.ts`

- [ ] **Step 1: Write the test**

```ts
import { test, expect } from '@playwright/test'

test('AttentionScene shows the surface Simplified note and TWO caveats in deep', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /attention/i }).first().click()
  await expect(page).toHaveURL(/#attention$/)

  await expect(page.getByText(/simplified.*go deeper/i)).toBeVisible()

  await page.getByRole('button', { name: /go deeper/i }).first().click()

  const notes = page.getByRole('note')
  await expect(notes).toHaveCount(2)

  await expect(page.getByRole('button', { name: /head 1/i })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: /head 2/i }).click()
  await expect(page.getByRole('button', { name: /head 2/i })).toHaveAttribute('aria-pressed', 'true')
})

test('EmbedScene shows the meaning-space and a CaveatNote in Deep', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /embeddings/i }).first().click()
  await expect(page).toHaveURL(/#embed$/)

  await expect(page.locator('[data-testid="embedding-dot-sky"]').first()).toBeVisible()

  await page.getByRole('button', { name: /go deeper/i }).first().click()
  await expect(page.getByRole('note').first()).toContainText(/king.*man.*woman|word2vec|older idea/i)
})
```

- [ ] **Step 2: Run E2E**

```bash
npm run e2e
```

Expected: all existing E2E tests still pass + 2 new pass.

- [ ] **Step 3: Commit**

```bash
git add e2e/honesty-scenes.spec.ts
git commit -m "test(e2e): add honesty-scenes E2E covering Attention caveats and Embed meaning-space"
```

---

### Task 11: Bundle budget + final verification

**Files:** none — verification only.

- [ ] **Step 1: Build**

```bash
npm run build
```

- [ ] **Step 2: Inspect bundle size**

```bash
ls -lh dist/assets/*.js
gzip -c dist/assets/*.js | wc -c
```

Expected: gzipped JS under 200 KB.

- [ ] **Step 3: Final green sweep**

```bash
npm run typecheck && npm run lint && npm test && npm run e2e
```

All exit 0.

- [ ] **Step 4: Commit (only if anything changed)**

```bash
git add -A
git commit -m "chore: verify Plan 3 bundle and full suite"
```

---

## Self-review summary

**Spec coverage (Plan 3 scope):**

| Spec section | Implemented | Task |
|---|---|---|
| §3 Scene 2 Embeddings surface | EmbedScene + EmbeddingSpace + EmbeddingDot | 2, 3, 4 |
| §3 Scene 2 Deep (contextual-shift + dim row + word2vec CaveatNote) | EmbedScene deeper | 4 |
| §3 Scene 3 Attention surface (8 cat tokens + arcs + "Simplified" inline note) | AttentionScene stage | 5, 8 |
| §3 Scene 3 Deep (8×8 causal matrix + head selector + mechanism row + TWO CaveatNotes) | AttentionScene deeper + matrix + selector | 6, 7, 8 |
| §6 Data contract — second precomputed dataset | cat.json + loader widening | 1 |
| §7 Provenance — cat.json carries the source string | cat.json | 1 |
| §7 Causal mask — upper triangle blank | AttentionMatrix `data-blank` | 6 |
| §8 SVG content has prose equivalent | Each scene's surface/deep prose mirrors the visual | 4, 8 |
| Cross-scene nav + rail integration | Foundation already wired in Plans 1+2; only mount changes | 9 |

**Out of scope (Plan 4):** Compare section build, inline-style → Tailwind migration, full a11y audit, eslint config hygiene, perf pass on the larger SVGs (canvas/virtualization).

**Placeholder scan:** none — every task has full code, every test asserts concrete values.

**Type consistency:** `SceneId`, `AccentToken`, `PromptId`, `IllustrativeDot`, and the SVG component props (`x`/`y`/`label`/`weight`/`accent`) are used consistently across components, scenes, and tests.
