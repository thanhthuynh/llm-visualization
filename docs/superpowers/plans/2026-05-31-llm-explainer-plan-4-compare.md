# Interactive LLM Explainer — Plan 4: Compare Section

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Source spec:** `/Users/thanh/workspace/obsidian-primary-vault/llm-explainer-spec-v1.1.md` (§4 "Scale-up: Claude vs ChatGPT section")
**Builds on:** Plans 1–3 + PR #3 Figma-fidelity + the post-Plan-3 main at `68d5336`.
**Goal:** Build the Compare section the spec calls "Phase 2" — a Claude vs ChatGPT scale-up scene that leads with what's shared, then ranks differences by how durable and verifiable they are. Each claim carries an explicit `(a)/(b)/(c)` tier badge. The disabled "Compare" dot on the ProgressRail becomes live.
**Architecture:** Treat `compare` as an eighth pipeline-adjacent scene (between `output` and `about` in mount order). Reuses the same `SceneStation` pattern, with new presentational components for comparison primitives (`ClaimTier`, `ContextWindowBar`, `TokenizerCount`, `PhilosophyCard`, `CompareTable`). All comparison data lives in one dated config module (`src/data/compare.config.ts`).
**Tech stack delta from Plan 3:** Zero new dependencies. Bundle should grow ~3–5 KB gz.

---

## File Structure (Plan 4 additions / modifications)

| Path | Responsibility |
|---|---|
| `src/data/compare.config.ts` | Dated comparison data. Model lineups, context windows, pricing structure, tokenizer counts (illustrative), post-training documents. Carries `lastUpdated` ISO date and a `tier` field on each claim. |
| `src/components/ClaimTier.tsx` | A pill badge `(a)`, `(b)`, or `(c)` with tier-keyed color. |
| `src/components/ContextWindowBar.tsx` | Two-row horizontal bar comparison; bars near-equal at ~1M to reinforce "convergence". |
| `src/components/TokenizerCount.tsx` | Two-cell display: same prompt, two illustrative token counts. |
| `src/components/PhilosophyCard.tsx` | Single card showing a post-training approach (title + description + public-doc ref). |
| `src/components/CompareTable.tsx` | Small reusable table: label / value / `ClaimTier` per row. |
| `src/scenes/CompareScene.tsx` | Reuses `predict` accent. Layout: framing prose, "both" anchor, context-window section, tokenizer section, philosophy cards, model-lineup table, CaveatNote, last-updated footnote. |
| `src/scenes/scenes.config.ts` | Add `'compare'` to `SceneId`. Add `compare` entry with `implemented: true`. |
| `src/components/ProgressRail.tsx` | Replace hardcoded disabled Compare dot with a config-driven active button. |
| `src/App.tsx` | Mount `<CompareScene />` between `<AssembleScene />` and `<AboutScene />`. |
| `tests/unit/CompareScene.test.tsx` | h2, framing, ≥3 tier badges, context bars, tokenizer counts, philosophy cards, CaveatNote, last-updated. |
| `tests/unit/ClaimTier.test.tsx` | Tier letter, tier-specific style, data-tier attr. |
| `tests/unit/ContextWindowBar.test.tsx` | Two progressbars, aria-valuenow/max, formatted labels. |
| `tests/unit/TokenizerCount.test.tsx` | Two cells, prompt + count + illustrative note. |
| `tests/unit/PhilosophyCard.test.tsx` | Title + description + ref. |
| `tests/unit/CompareTable.test.tsx` | Row count + tier badges + table caption. |
| `tests/unit/compare.config.test.ts` | lastUpdated ISO, valid tiers, ≥4 lineup entries, two philosophies, two tokenizer examples. |
| `tests/unit/ProgressRail.test.tsx` | Compare button no longer disabled; calls onJump('compare'). |
| `tests/unit/App.test.tsx` | Eight + one (Compare) scene-heading expectation. |
| `tests/unit/scenes.config.test.ts` | `implementedIds` includes `'compare'` between `'output'` and `'about'`. |
| `e2e/compare-section.spec.ts` | Rail-click Compare → URL `#compare` → heading → ≥1 tier badge → CaveatNote → last-updated. |
| `e2e/mvp-flow.spec.ts` | ArrowDown count bumps from 7→8 to land at `#about` (Compare now between Output and About). |

---

## Token / accent decision

The spec doesn't assign Compare its own accent. **Plan picks reusing `predict` (purple #9D4EDD)** — no new tokens, no `AccentToken` union widening. Compare is conceptually a "comparison of distributions" so the visual link to Predict is intuitive. Easy to revisit later.

---

## Patterns this plan locks in

| Category | Pattern |
|---|---|
| **Comparison data** | Single config module; updates propagate. |
| **Tier discipline** | Every Compare claim has an explicit `(a)`, `(b)`, or `(c)` badge. Test asserts ≥ 3 badges. |
| **Date stamping** | `lastUpdated` ISO string rendered as a footnote. CaveatNote calls out (b)/(c) volatility. |
| **No new accents** | Reuse `predict`. |
| **Compare placement** | Mount after `output`, before `about`. Rail dot sits between the last pipeline scene and About. |

---

## Validation commands

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
npm test            # vitest run
npm run e2e         # playwright (Chromium)
npm run build       # vite build; assert bundle < 200 KB gz
```

Plan 4 should grow unit tests by ~20 (six new component + config tests + 1 scene). E2E grows by 2 (compare-section). Bundle grows ~3–5 KB gz.

---

## Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Compare claims drift out of date | High | Single config file with `lastUpdated`; CaveatNote explicitly says (b)/(c) ages fast. |
| Tokenizer counts feel like a "live integration" promise | Med | Config labels counts as **illustrative**; same pattern as Plans 1–3's precomputed data. |
| Existing ProgressRail "Compare disabled" test breaks | High (known) | Plan updates that test to assert the live behavior. |
| `SceneId` union grows to 9 | Med | Type system catches all usage sites; `scenes.config.test.ts` is updated. |

---

## Tasks

### Task 1: `compare.config.ts` + tier types + tests

**Files:**
- Create: `src/data/compare.config.ts`
- Create: `tests/unit/compare.config.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/unit/compare.config.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  COMPARE_CONFIG,
  type Tier,
  type ContextWindow,
  type TokenizerExample,
  type Philosophy,
  type LineupEntry,
} from '@/data/compare.config'

describe('compare.config', () => {
  it('exposes a lastUpdated ISO date', () => {
    expect(COMPARE_CONFIG.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('lists at least two context-window entries near 1M tokens', () => {
    const windows: ContextWindow[] = [...COMPARE_CONFIG.contextWindows]
    expect(windows.length).toBeGreaterThanOrEqual(2)
    windows.forEach((w) => {
      expect(w.tokens).toBeGreaterThanOrEqual(200_000)
      expect(w.tier).toMatch(/^[abc]$/)
    })
  })

  it('contains exactly two tokenizer examples (Claude + GPT)', () => {
    const tk: TokenizerExample[] = [...COMPARE_CONFIG.tokenizerExamples]
    expect(tk).toHaveLength(2)
    tk.forEach((t) => {
      expect(t.prompt.length).toBeGreaterThan(0)
      expect(t.tokenCount).toBeGreaterThan(0)
    })
  })

  it('lists two post-training philosophies', () => {
    const phils: Philosophy[] = [...COMPARE_CONFIG.philosophies]
    expect(phils).toHaveLength(2)
    expect(phils.map((p) => p.title).join(' ')).toMatch(/constitutional|rlhf/i)
  })

  it('lists a model lineup with at least 4 entries', () => {
    const lineup: LineupEntry[] = [...COMPARE_CONFIG.modelLineup]
    expect(lineup.length).toBeGreaterThanOrEqual(4)
    lineup.forEach((m) => {
      expect(m.name.length).toBeGreaterThan(0)
      expect(m.tier).toMatch(/^[abc]$/)
    })
  })

  it("Tier type is the literal union 'a' | 'b' | 'c'", () => {
    const valid: Tier[] = ['a', 'b', 'c']
    expect(valid).toEqual(['a', 'b', 'c'])
  })
})
```

- [ ] **Step 2: Run + confirm failure**

```bash
npm test -- compare.config
```

- [ ] **Step 3: Implement `src/data/compare.config.ts`**

```ts
export type Tier = 'a' | 'b' | 'c'

export interface ContextWindow {
  vendor: 'anthropic' | 'openai'
  family: string
  tokens: number
  tier: Tier
}

export interface TokenizerExample {
  vendor: 'anthropic' | 'openai'
  label: string
  prompt: string
  tokenCount: number
  note: string
}

export interface Philosophy {
  vendor: 'anthropic' | 'openai'
  title: string
  description: string
  publicDoc: string
  tier: Tier
}

export interface LineupEntry {
  vendor: 'anthropic' | 'openai'
  name: string
  family: string
  tier: Tier
}

export interface CompareConfig {
  lastUpdated: string
  contextWindows: ReadonlyArray<ContextWindow>
  tokenizerExamples: ReadonlyArray<TokenizerExample>
  philosophies: ReadonlyArray<Philosophy>
  modelLineup: ReadonlyArray<LineupEntry>
}

export const COMPARE_CONFIG: CompareConfig = {
  lastUpdated: '2026-05-31',
  contextWindows: [
    { vendor: 'anthropic', family: 'Claude Opus / Sonnet (API)', tokens: 1_000_000, tier: 'a' },
    { vendor: 'openai', family: 'GPT-5.5 (API)', tokens: 1_000_000, tier: 'a' },
  ],
  tokenizerExamples: [
    {
      vendor: 'anthropic',
      label: 'Claude (proprietary BPE)',
      prompt: 'The cat sat down because it was tired',
      tokenCount: 9,
      note: 'Illustrative — Anthropic does not publish the tokenizer.',
    },
    {
      vendor: 'openai',
      label: 'GPT (tiktoken o200k-family)',
      prompt: 'The cat sat down because it was tired',
      tokenCount: 8,
      note: 'Illustrative — GPT uses the public tiktoken o200k tokenizer.',
    },
  ],
  philosophies: [
    {
      vendor: 'anthropic',
      title: 'Constitutional AI / RLAIF',
      description:
        'Anthropic publishes a constitution — a list of principles the model is trained to follow. Outputs are scored by another model against those principles, then the policy is updated.',
      publicDoc: 'Anthropic constitution',
      tier: 'a',
    },
    {
      vendor: 'openai',
      title: 'RLHF + Model Spec',
      description:
        'OpenAI uses Reinforcement Learning from Human Feedback. The Model Spec describes how the model is meant to behave; humans rate outputs and the policy is updated.',
      publicDoc: 'OpenAI Model Spec',
      tier: 'a',
    },
  ],
  modelLineup: [
    { vendor: 'anthropic', name: 'Claude Opus 4.8', family: 'Opus', tier: 'a' },
    { vendor: 'anthropic', name: 'Claude Opus 4.7', family: 'Opus', tier: 'a' },
    { vendor: 'anthropic', name: 'Claude Sonnet 4.6', family: 'Sonnet', tier: 'a' },
    { vendor: 'anthropic', name: 'Claude Haiku 4.5', family: 'Haiku', tier: 'a' },
    { vendor: 'openai', name: 'GPT-5.5', family: 'GPT', tier: 'a' },
    { vendor: 'openai', name: 'GPT-5.5 Pro', family: 'GPT', tier: 'a' },
    { vendor: 'openai', name: 'GPT-5.5 Thinking', family: 'GPT', tier: 'a' },
    { vendor: 'openai', name: 'GPT-5.5 Instant', family: 'GPT', tier: 'a' },
  ],
}
```

- [ ] **Step 4: Run + confirm pass; typecheck + lint**

- [ ] **Step 5: Commit**

```bash
git add src/data/compare.config.ts tests/unit/compare.config.test.ts
git commit -m "feat(data): add compare.config with tier-tagged claims + lastUpdated"
```

---

### Task 2: `ClaimTier` badge component

**Files:**
- Create: `src/components/ClaimTier.tsx`
- Create: `tests/unit/ClaimTier.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ClaimTier } from '@/components/ClaimTier'

describe('ClaimTier', () => {
  it('renders the tier letter in parentheses', () => {
    render(<ClaimTier tier="a" />)
    expect(screen.getByText('(a)')).toBeInTheDocument()
  })

  it('uses a different border color for each tier', () => {
    const { rerender } = render(<ClaimTier tier="a" />)
    const a = screen.getByText('(a)').style.borderColor
    rerender(<ClaimTier tier="c" />)
    const c = screen.getByText('(c)').style.borderColor
    expect(a).not.toBe(c)
  })

  it('exposes tier on a data attribute for tests', () => {
    render(<ClaimTier tier="b" />)
    expect(screen.getByText('(b)').getAttribute('data-tier')).toBe('b')
  })
})
```

- [ ] **Step 2: Run + confirm failure**

- [ ] **Step 3: Implement `src/components/ClaimTier.tsx`**

```tsx
import type { CSSProperties } from 'react'
import type { Tier } from '@/data/compare.config'

interface ClaimTierProps {
  tier: Tier
}

const STYLES: Record<Tier, { border: string; color: string; bg: string }> = {
  a: {
    border: 'rgba(46, 230, 214, 0.6)',
    color: '#2EE6D6',
    bg: 'color-mix(in srgb, #2EE6D6 14%, var(--color-surface-card))',
  },
  b: {
    border: 'rgba(251, 191, 36, 0.6)',
    color: '#FBBF24',
    bg: 'color-mix(in srgb, #FBBF24 14%, var(--color-surface-card))',
  },
  c: {
    border: 'var(--color-border)',
    color: 'var(--color-text-muted)',
    bg: 'var(--color-surface-card)',
  },
}

export function ClaimTier({ tier }: ClaimTierProps) {
  const s = STYLES[tier]
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: 'var(--radius-pill)',
    border: `1px solid ${s.border}`,
    background: s.bg,
    color: s.color,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    lineHeight: '16px',
  }
  return (
    <span data-tier={tier} style={style}>
      ({tier})
    </span>
  )
}
```

- [ ] **Step 4: Run + confirm pass; typecheck + lint**

- [ ] **Step 5: Commit**

```bash
git add src/components/ClaimTier.tsx tests/unit/ClaimTier.test.tsx
git commit -m "feat: add ClaimTier (a)(b)(c) tier badge component"
```

---

### Task 3: `ContextWindowBar` component

**Files:**
- Create: `src/components/ContextWindowBar.tsx`
- Create: `tests/unit/ContextWindowBar.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContextWindowBar } from '@/components/ContextWindowBar'

const rows = [
  { vendor: 'anthropic' as const, family: 'Claude', tokens: 1_000_000 },
  { vendor: 'openai' as const, family: 'GPT', tokens: 1_000_000 },
]

describe('ContextWindowBar', () => {
  it('renders one progressbar per row with family + token label', () => {
    render(<ContextWindowBar rows={rows} maxTokens={1_000_000} />)
    const bars = screen.getAllByRole('progressbar')
    expect(bars).toHaveLength(2)
    expect(screen.getByText(/^Claude$/i)).toBeInTheDocument()
    expect(screen.getByText(/^GPT$/i)).toBeInTheDocument()
  })

  it('sets aria-valuenow to the token count and aria-valuemax to maxTokens', () => {
    render(<ContextWindowBar rows={rows} maxTokens={1_000_000} />)
    const bars = screen.getAllByRole('progressbar')
    bars.forEach((b) => {
      expect(b.getAttribute('aria-valuenow')).toBe('1000000')
      expect(b.getAttribute('aria-valuemax')).toBe('1000000')
    })
  })

  it('formats large counts with a 1M suffix', () => {
    render(<ContextWindowBar rows={rows} maxTokens={1_000_000} />)
    expect(screen.getAllByText(/1M/i).length).toBeGreaterThanOrEqual(2)
  })
})
```

- [ ] **Step 2: Run + confirm failure**

- [ ] **Step 3: Implement `src/components/ContextWindowBar.tsx`**

```tsx
interface ContextWindowRow {
  vendor: 'anthropic' | 'openai'
  family: string
  tokens: number
}

interface ContextWindowBarProps {
  rows: ReadonlyArray<ContextWindowRow>
  maxTokens: number
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

export function ContextWindowBar({ rows, maxTokens }: ContextWindowBarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map((r) => {
        const pct = Math.round((r.tokens / maxTokens) * 100)
        const label = formatTokens(r.tokens)
        return (
          <div
            key={`${r.vendor}-${r.family}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 64px',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13 }}>{r.family}</span>
            <div
              role="progressbar"
              aria-label={`${r.family} context window`}
              aria-valuenow={r.tokens}
              aria-valuemin={0}
              aria-valuemax={maxTokens}
              style={{
                height: 18,
                borderRadius: 9,
                background: 'var(--color-surface-track)',
                overflow: 'hidden',
              }}
            >
              <div
                data-testid={`ctx-fill-${r.vendor}`}
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background:
                    r.vendor === 'anthropic'
                      ? 'var(--color-accent-predict, #9D4EDD)'
                      : 'var(--color-accent-output, #2EE6D6)',
                }}
              />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, textAlign: 'right' }}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run + confirm pass; typecheck + lint**

- [ ] **Step 5: Commit**

```bash
git add src/components/ContextWindowBar.tsx tests/unit/ContextWindowBar.test.tsx
git commit -m "feat: add ContextWindowBar paired-bars component"
```

---

### Task 4: `TokenizerCount` component

**Files:**
- Create: `src/components/TokenizerCount.tsx`
- Create: `tests/unit/TokenizerCount.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TokenizerCount } from '@/components/TokenizerCount'

const examples = [
  {
    vendor: 'anthropic' as const,
    label: 'Claude (proprietary BPE)',
    prompt: 'The cat sat',
    tokenCount: 4,
    note: 'illustrative',
  },
  {
    vendor: 'openai' as const,
    label: 'GPT (tiktoken)',
    prompt: 'The cat sat',
    tokenCount: 3,
    note: 'illustrative',
  },
]

describe('TokenizerCount', () => {
  it('renders both labels', () => {
    render(<TokenizerCount examples={examples} />)
    expect(screen.getByText(/claude/i)).toBeInTheDocument()
    expect(screen.getByText(/gpt/i)).toBeInTheDocument()
  })

  it('shows the same prompt in each cell', () => {
    render(<TokenizerCount examples={examples} />)
    expect(screen.getAllByText(/The cat sat/i).length).toBeGreaterThanOrEqual(2)
  })

  it('shows the token count for each', () => {
    render(<TokenizerCount examples={examples} />)
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows the illustrative note for each', () => {
    render(<TokenizerCount examples={examples} />)
    expect(screen.getAllByText(/illustrative/i).length).toBeGreaterThanOrEqual(2)
  })
})
```

- [ ] **Step 2: Run + confirm failure**

- [ ] **Step 3: Implement `src/components/TokenizerCount.tsx`**

```tsx
interface TokenizerCountExample {
  vendor: 'anthropic' | 'openai'
  label: string
  prompt: string
  tokenCount: number
  note: string
}

interface TokenizerCountProps {
  examples: ReadonlyArray<TokenizerCountExample>
}

export function TokenizerCount({ examples }: TokenizerCountProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {examples.map((e) => (
        <div
          key={e.vendor}
          style={{
            padding: 14,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            background: 'var(--color-surface-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: 13,
              color: 'var(--color-text-primary)',
            }}
          >
            {e.label}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              color: 'var(--color-text-muted)',
            }}
          >
            &quot;{e.prompt}&quot;
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--color-text-primary)',
              }}
            >
              {e.tokenCount}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--color-text-muted)',
              }}
            >
              tokens
            </span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--color-text-muted)',
              fontStyle: 'italic',
            }}
          >
            {e.note}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run + confirm pass; typecheck + lint**

- [ ] **Step 5: Commit**

```bash
git add src/components/TokenizerCount.tsx tests/unit/TokenizerCount.test.tsx
git commit -m "feat: add TokenizerCount paired-card component"
```

---

### Task 5: `PhilosophyCard` component

**Files:**
- Create: `src/components/PhilosophyCard.tsx`
- Create: `tests/unit/PhilosophyCard.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PhilosophyCard } from '@/components/PhilosophyCard'

describe('PhilosophyCard', () => {
  it('renders the title, description, and public-doc reference', () => {
    render(
      <PhilosophyCard
        title="Constitutional AI / RLAIF"
        description="Anthropic publishes a constitution."
        publicDoc="Anthropic constitution"
        vendor="anthropic"
      />,
    )
    expect(screen.getByText(/Constitutional AI/i)).toBeInTheDocument()
    expect(screen.getByText(/publishes a constitution/i)).toBeInTheDocument()
    expect(screen.getByText(/Anthropic constitution/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run + confirm failure**

- [ ] **Step 3: Implement `src/components/PhilosophyCard.tsx`**

```tsx
interface PhilosophyCardProps {
  title: string
  description: string
  publicDoc: string
  vendor: 'anthropic' | 'openai'
}

export function PhilosophyCard({ title, description, publicDoc, vendor }: PhilosophyCardProps) {
  return (
    <div
      style={{
        padding: 16,
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-surface-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 17,
          color: vendor === 'anthropic' ? '#9D4EDD' : '#2EE6D6',
        }}
      >
        {title}
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          lineHeight: '22px',
          color: 'var(--color-text-primary)',
        }}
      >
        {description}
      </p>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--color-text-muted)',
        }}
      >
        ref: {publicDoc}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run + confirm pass; typecheck + lint**

- [ ] **Step 5: Commit**

```bash
git add src/components/PhilosophyCard.tsx tests/unit/PhilosophyCard.test.tsx
git commit -m "feat: add PhilosophyCard for Constitutional AI / RLHF blocks"
```

---

### Task 6: `CompareTable` primitive

**Files:**
- Create: `src/components/CompareTable.tsx`
- Create: `tests/unit/CompareTable.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CompareTable } from '@/components/CompareTable'

const rows = [
  { label: 'Claude Opus 4.8', value: 'Opus family', tier: 'a' as const },
  { label: 'GPT-5.5 Thinking', value: 'GPT family', tier: 'a' as const },
]

describe('CompareTable', () => {
  it('renders each row with a label, value, and tier badge', () => {
    render(<CompareTable rows={rows} caption="lineup" />)
    expect(screen.getByText('Claude Opus 4.8')).toBeInTheDocument()
    expect(screen.getByText('GPT-5.5 Thinking')).toBeInTheDocument()
    expect(screen.getAllByText(/family/i).length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('(a)').length).toBe(2)
  })

  it('renders a table with the given caption for screen readers', () => {
    render(<CompareTable rows={rows} caption="Model lineup" />)
    expect(screen.getByRole('table', { name: /model lineup/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run + confirm failure**

- [ ] **Step 3: Implement `src/components/CompareTable.tsx`**

```tsx
import { ClaimTier } from './ClaimTier'
import type { Tier } from '@/data/compare.config'

interface CompareTableRow {
  label: string
  value: string
  tier: Tier
}

interface CompareTableProps {
  rows: ReadonlyArray<CompareTableRow>
  caption?: string
}

export function CompareTable({ rows, caption }: CompareTableProps) {
  return (
    <table
      aria-label={caption}
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: 'var(--font-body)',
        fontSize: 13,
      }}
    >
      {caption && (
        <caption
          style={{
            textAlign: 'left',
            color: 'var(--color-text-muted)',
            fontSize: 11,
            paddingBottom: 8,
          }}
        >
          {caption}
        </caption>
      )}
      <tbody>
        {rows.map((r, i) => (
          <tr key={`${r.label}-${i}`} style={{ borderTop: '1px solid var(--color-border)' }}>
            <th
              scope="row"
              style={{
                textAlign: 'left',
                padding: '8px 10px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              {r.label}
            </th>
            <td style={{ padding: '8px 10px', color: 'var(--color-text-muted)' }}>{r.value}</td>
            <td style={{ padding: '8px 10px', textAlign: 'right' }}>
              <ClaimTier tier={r.tier} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 4: Run + confirm pass; typecheck + lint**

- [ ] **Step 5: Commit**

```bash
git add src/components/CompareTable.tsx tests/unit/CompareTable.test.tsx
git commit -m "feat: add CompareTable primitive for tier-tagged claim rows"
```

---

### Task 7: Add `'compare'` to `SceneId` + scenes.config entry

**Files:**
- Modify: `src/scenes/scenes.config.ts`
- Modify: `tests/unit/scenes.config.test.ts`

- [ ] **Step 1: Update the test expectation first**

In `tests/unit/scenes.config.test.ts`, update the implementedIds expectation to include `'compare'` between `'output'` and `'about'`:

```ts
expect(implementedIds).toEqual([
  'prompt',
  'tokenize',
  'embed',
  'attention',
  'predict',
  'decode',
  'output',
  'compare',
  'about',
])
```

If the file also asserts the total scene count (`expect(SCENES).toHaveLength(8)`), bump it to 9. Update the "expects 7 pipeline scenes plus about" wording if present.

- [ ] **Step 2: Run + confirm failure**

```bash
npm test -- scenes.config
```

- [ ] **Step 3: Modify `src/scenes/scenes.config.ts`**

Widen `SceneId` to include `'compare'` (between `'output'` and `'about'`):

```ts
export type SceneId =
  | 'prompt'
  | 'tokenize'
  | 'embed'
  | 'attention'
  | 'predict'
  | 'decode'
  | 'output'
  | 'compare'
  | 'about'
```

Add the new entry to `SCENES`, between `output` and `about`:

```ts
  {
    id: 'compare',
    title: 'Claude vs ChatGPT',
    accent: 'predict',
    prompt: '',
    railLabel: 'COMPARE',
    implemented: true,
  },
```

Do NOT widen `AccentToken` — Compare reuses `predict`.

- [ ] **Step 4: Run + confirm pass**

```bash
npm test -- scenes.config
```

- [ ] **Step 5: Commit**

```bash
git add src/scenes/scenes.config.ts tests/unit/scenes.config.test.ts
git commit -m "feat: add compare to SceneId + scenes.config (reuses predict accent)"
```

---

### Task 8: `CompareScene`

**Files:**
- Create: `src/scenes/CompareScene.tsx`
- Create: `tests/unit/CompareScene.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CompareScene } from '@/scenes/CompareScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

function renderScene() {
  return render(
    <RunningExampleProvider>
      <DepthProvider>
        <CompareScene />
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('CompareScene', () => {
  it('renders the heading', () => {
    renderScene()
    expect(screen.getByRole('heading', { level: 2, name: /claude vs chatgpt/i })).toBeInTheDocument()
  })

  it("leads with 'more alike than different' framing", () => {
    renderScene()
    expect(screen.getByText(/more alike than different/i)).toBeInTheDocument()
  })

  it('renders at least three tier badges with data-tier attributes', () => {
    renderScene()
    const badges = screen.getAllByText(/^\([abc]\)$/).filter((el) => el.getAttribute('data-tier'))
    expect(badges.length).toBeGreaterThanOrEqual(3)
  })

  it('renders the context-window comparison with two progressbars', () => {
    renderScene()
    expect(screen.getByText(/context window/i)).toBeInTheDocument()
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThanOrEqual(2)
  })

  it('renders the tokenizer count comparison with illustrative labels', () => {
    renderScene()
    expect(screen.getAllByText(/illustrative/i).length).toBeGreaterThanOrEqual(2)
  })

  it('renders both philosophy cards in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/constitutional ai/i)).toBeInTheDocument()
    expect(screen.getByText(/rlhf/i)).toBeInTheDocument()
  })

  it('renders a CaveatNote about (b)/(c) volatility in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const note = screen.getByRole('note')
    expect(note.textContent?.toLowerCase()).toMatch(/age|volatile|change|tier|month/)
  })

  it('renders a "last updated" footnote with the date in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/last updated.*2026/i)).toBeInTheDocument()
  })

  it('renders the model lineup table in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByRole('table', { name: /model lineup/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run + confirm failure**

- [ ] **Step 3: Implement `src/scenes/CompareScene.tsx`**

```tsx
import { SceneStation } from '@/components/SceneStation'
import { CaveatNote } from '@/components/CaveatNote'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { ClaimTier } from '@/components/ClaimTier'
import { ContextWindowBar } from '@/components/ContextWindowBar'
import { TokenizerCount } from '@/components/TokenizerCount'
import { PhilosophyCard } from '@/components/PhilosophyCard'
import { CompareTable } from '@/components/CompareTable'
import { getSceneById } from '@/scenes/scenes.config'
import { COMPARE_CONFIG } from '@/data/compare.config'

const SCENE = getSceneById('compare')

export function CompareScene() {
  const maxTokens = Math.max(...COMPARE_CONFIG.contextWindows.map((c) => c.tokens))
  const contextRows = COMPARE_CONFIG.contextWindows.map((c) => ({
    vendor: c.vendor,
    family: c.family,
    tokens: c.tokens,
  }))
  const lineupRows = COMPARE_CONFIG.modelLineup.map((m) => ({
    label: m.name,
    value: m.family,
    tier: m.tier,
  }))

  const stage = (
    <div
      style={{
        padding: 'var(--stage-padding)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        height: '100%',
      }}
    >
      <EyebrowLabel>The honest comparison</EyebrowLabel>

      <div
        style={{
          padding: 14,
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          background: 'var(--color-surface-card)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Architecture: both <ClaimTier tier="a" />
        </div>
        <p
          style={{
            margin: '6px 0 0',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--color-text-muted)',
            lineHeight: '20px',
          }}
        >
          Decoder-only autoregressive transformers, pretrained then post-trained. Everything you
          watched in scenes 1–6 applies to both.
        </p>
      </div>

      <div>
        <EyebrowLabel>Context window (API)</EyebrowLabel>
        <div style={{ marginTop: 8 }}>
          <ContextWindowBar rows={contextRows} maxTokens={maxTokens} />
        </div>
        <p
          style={{
            margin: '8px 0 0',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
          }}
        >
          The honest story here is <strong>convergence</strong>, not &ldquo;X is bigger.&rdquo;{' '}
          <ClaimTier tier="a" />
        </p>
      </div>

      <div>
        <EyebrowLabel>Tokenizers differ — same text, different counts</EyebrowLabel>
        <div style={{ marginTop: 8 }}>
          <TokenizerCount examples={[...COMPARE_CONFIG.tokenizerExamples]} />
        </div>
        <p
          style={{
            margin: '8px 0 0',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
          }}
        >
          Best hard difference. Ties back to Scene 1 (Tokenization). <ClaimTier tier="a" />
        </p>
      </div>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>Claude vs ChatGPT</EyebrowLabel>
      <p style={{ marginTop: 12 }}>
        At the architecture level, these systems are <strong>more alike than different</strong> —
        both decoder-only transformers, pretrained then post-trained with RLHF-family techniques.
        Lead with what they share, then rank differences by how durable and verifiable they are.
      </p>
    </>
  )

  const deeper = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <EyebrowLabel>Post-training philosophy</EyebrowLabel>
        <div
          style={{
            marginTop: 8,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          {COMPARE_CONFIG.philosophies.map((p) => (
            <PhilosophyCard
              key={p.vendor}
              title={p.title}
              description={p.description}
              publicDoc={p.publicDoc}
              vendor={p.vendor}
            />
          ))}
        </div>
        <p
          style={{
            margin: '8px 0 0',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
          }}
        >
          The existence of each program is public <ClaimTier tier="a" />. Current recipes are
          partial / historical <ClaimTier tier="b" />.
        </p>
      </div>

      <div>
        <EyebrowLabel>Model lineup</EyebrowLabel>
        <div style={{ marginTop: 8 }}>
          <CompareTable rows={lineupRows} caption="Model lineup" />
        </div>
      </div>

      <CaveatNote>
        Tier (a) claims are public + verifiable; (b) are reasonable inference; (c) age fast — model
        names, exact context-window numbers, and any &ldquo;which is smarter&rdquo; comparison
        change month-to-month.
      </CaveatNote>

      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--color-text-muted)',
        }}
      >
        Last updated {COMPARE_CONFIG.lastUpdated}
      </p>
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

- [ ] **Step 4: Run + confirm pass; typecheck + lint**

- [ ] **Step 5: Commit**

```bash
git add src/scenes/CompareScene.tsx tests/unit/CompareScene.test.tsx
git commit -m "feat: build CompareScene with tier-tagged claims + convergence framing"
```

---

### Task 9: Wire CompareScene into rail + App

**Files:**
- Modify: `src/components/ProgressRail.tsx`
- Modify: `src/App.tsx`
- Modify: `tests/unit/ProgressRail.test.tsx`
- Modify: `tests/unit/App.test.tsx`

- [ ] **Step 1: Update `ProgressRail.test.tsx`**

Find the existing test asserting Compare is `disabled` (it likely says "renders Compare as a disabled placeholder"). Replace with:

```ts
it('renders the Compare dot as an active scene link', async () => {
  const onJump = vi.fn()
  render(<ProgressRail activeId="predict" onJump={onJump} />)
  const compare = screen.getByRole('button', { name: /compare/i })
  expect(compare).not.toBeDisabled()
  await userEvent.click(compare)
  expect(onJump).toHaveBeenCalledWith('compare')
})
```

- [ ] **Step 2: Run + confirm failure**

```bash
npm test -- ProgressRail
```

- [ ] **Step 3: Modify `src/components/ProgressRail.tsx`**

Locate the hardcoded Compare button (currently around lines 100–117). Replace with a button that jumps to `'compare'` and is no longer disabled:

```tsx
      <button
        type="button"
        onClick={() => onJump('compare')}
        aria-label="Compare"
        {...(activeId === 'compare' ? { 'aria-current': 'step' as const } : {})}
        style={{
          minWidth: 44,
          minHeight: 44,
          width: 16,
          height: 16,
          marginTop: 16,
          borderRadius: '50%',
          background:
            activeId === 'compare'
              ? 'var(--color-accent-predict, #9D4EDD)'
              : 'var(--color-rail-inactive)',
          border: '1px solid var(--color-border)',
          cursor: 'pointer',
          padding: 0,
        }}
      />
```

Leave the About button below it untouched.

- [ ] **Step 4: Update `tests/unit/App.test.tsx`**

If a test asserts a specific count or list of mounted scene headings, increase the count by one. Add an explicit assertion for the Compare heading:

```ts
expect(screen.getByRole('heading', { level: 2, name: /claude vs chatgpt/i })).toBeInTheDocument()
```

- [ ] **Step 5: Modify `src/App.tsx`**

Add the import alongside the others:

```tsx
import { CompareScene } from '@/scenes/CompareScene'
```

Insert `<CompareScene />` between `<AssembleScene />` and `<AboutScene />` in the `<main className="stations">` block. Final order:

```tsx
<main className="stations" aria-label="LLM pipeline scenes">
  <PromptScene />
  <TokenizeScene />
  <EmbedScene />
  <AttentionScene />
  <PredictScene />
  <DecodeScene />
  <AssembleScene />
  <CompareScene />
  <AboutScene />
</main>
```

- [ ] **Step 6: Run + verify**

```bash
npm test && npm run typecheck && npm run lint
```

- [ ] **Step 7: Commit**

```bash
git add src/components/ProgressRail.tsx src/App.tsx tests/unit/ProgressRail.test.tsx tests/unit/App.test.tsx
git commit -m "feat: enable Compare rail dot + mount CompareScene in App"
```

---

### Task 10: Cross-scene Playwright E2E for Compare

**Files:**
- Create: `e2e/compare-section.spec.ts`
- Modify: `e2e/mvp-flow.spec.ts` (the ArrowDown count needs to grow from 7 → 8 to land on `#about` since Compare now sits between Output and About)

- [ ] **Step 1: Write the new E2E**

```ts
import { test, expect } from '@playwright/test'

test('Compare rail jump shows Claude vs ChatGPT framing + tier badges + caveat', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /^compare$/i }).first().click()
  await expect(page).toHaveURL(/#compare$/)

  await expect(
    page.getByRole('heading', { level: 2, name: /claude vs chatgpt/i }),
  ).toBeVisible()

  await expect(page.getByText(/more alike than different/i)).toBeVisible()

  const tierA = page.locator('[data-tier="a"]')
  await expect(tierA.first()).toBeVisible()

  // Open Deep — CaveatNote about volatility, last-updated stamp.
  await page
    .locator('section#compare')
    .getByRole('button', { name: /go deeper/i })
    .first()
    .click()
  await expect(page.getByRole('note').first()).toContainText(/tier|age|change|volatile|month/i)
  await expect(page.getByText(/last updated/i)).toBeVisible()
})

test('keyboard ArrowDown reaches Compare after the 7 pipeline scenes', async ({ page }) => {
  await page.goto('/')
  for (let i = 0; i < 7; i++) {
    await page.locator('body').press('ArrowDown')
  }
  await expect(page).toHaveURL(/#compare$/)
})
```

- [ ] **Step 2: Update `e2e/mvp-flow.spec.ts`**

Find the ArrowDown loop (currently `for (let i = 0; i < 7; i++)` reaching `#about`). Bump the count to 8:

```ts
// 8 ArrowDowns to walk prompt → tokenize → embed → attention → predict → decode → output → compare → about
for (let i = 0; i < 8; i++) {
  await page.locator('body').press('ArrowDown')
}
```

- [ ] **Step 3: Run E2E**

```bash
npm run e2e
```

Expected: all existing tests still pass + 2 new tests pass. Total: 10.

- [ ] **Step 4: Commit**

```bash
git add e2e/compare-section.spec.ts e2e/mvp-flow.spec.ts
git commit -m "test(e2e): add compare-section flow + adjust mvp-flow ArrowDown for 9-stop pipeline"
```

---

### Task 11: Bundle budget + final verification

**Files:** none — verification only.

- [ ] **Step 1: Build**

```bash
rm -rf .vite
npm run build
```

- [ ] **Step 2: Inspect bundle size**

```bash
ls -lh dist/assets/*.js
gzip -c dist/assets/*.js | wc -c
```

Expected: under 200 KB. Plan 3 ended at ~140.8 KB gz; Plan 4 adds ~3–5 KB gz from new components + config data, putting us around ~145 KB gz.

- [ ] **Step 3: Final green sweep**

```bash
npm run typecheck && npm run lint && npm test && npm run e2e
```

All exit 0.

- [ ] **Step 4: Commit (only if anything changed)**

```bash
git add -A
git commit -m "chore: verify Plan 4 bundle and full suite"
```

---

## Self-review summary

**Spec coverage (Plan 4 scope — spec §4):**

| Spec §4 row | Implemented | Task |
|---|---|---|
| Framing: more alike than different + "both" anchor | CompareScene stage anchor block + surface paragraph | 8 |
| Architecture family: both decoder-only transformers (tier a) | Stage anchor block with `<ClaimTier tier="a" />` | 8 |
| Context window (API): ~1M both, convergence story (tier a) | ContextWindowBar + tier badge + caption | 3, 8 |
| Tokenizer: different proprietary BPE → different counts (tier a) | TokenizerCount + tier badge + caption | 4, 8 |
| Post-training philosophy (Constitutional AI / RLHF) | PhilosophyCard ×2 + tier callout | 5, 8 |
| Model lineup with last-updated stamp | CompareTable + lastUpdated footnote | 6, 8 |
| Caveat on (b)/(c) volatility | CaveatNote in deep panel | 8 |
| Rail "Compare" dot reserved → now live | ProgressRail update | 9 |
| Spec §10 — "Compare is Phase 2" item closed | All of Plan 4 | All |

**Out of scope (deferred, post-Plan 4):**
- Inline-style → Tailwind migration (separate plan).
- Full a11y audit (axe-core + manual VoiceOver/NVDA).
- ESLint config hygiene (`.vite` ignore + node globals) — config-protection hook blocks edits.
- Live tokenizer integration (`tiktoken`, `@anthropic-ai/tokenizer`).
- Compare-specific accent token — reuses `predict`.

**Placeholder scan:** none — every task has full code, every test asserts concrete values.

**Type consistency:** `Tier`, `ContextWindow`, `TokenizerExample`, `Philosophy`, `LineupEntry`, `CompareConfig`, `SceneId` (widened with `'compare'`), and the component prop interfaces are used consistently across the new files.
