# Tailwind Migration — Cheat Sheet

> Every file migration follows the mapping below. If a property isn't covered, add it here before continuing.

## Decisions locked at pilot (Task 2 — Chip.tsx)

| Question | Decision | Verified at |
|---|---|---|
| `fontFamily: 'var(--font-mono)'` syntax | `font-[family-name:--font-mono]` | Chip pilot |
| `width: ${pct}%` dynamic | `style={{ '--bar-w': pct + '%' } as CSSProperties} className="w-[var(--bar-w)]"` | DataBar (Wave 3) |
| Runtime accent colors | `style={{ '--chip-ring': accent } as CSSProperties} className="border-(--chip-ring)"` | Chip pilot |
| `boxShadow: ... ${accent}66` | `style={{ '--chip-shadow': shadow } as CSSProperties} className="shadow-[var(--chip-shadow)]"` | Chip pilot |

## Translation table — layout

| Inline style | Tailwind class |
|---|---|
| `display: 'flex'` | `flex` |
| `display: 'inline-flex'` | `inline-flex` |
| `display: 'grid'` | `grid` |
| `flexDirection: 'column'` | `flex-col` |
| `alignItems: 'center'` | `items-center` |
| `alignItems: 'flex-start'` | `items-start` |
| `justifyContent: 'center'` | `justify-center` |
| `justifyContent: 'space-between'` | `justify-between` |
| `justifyContent: 'flex-end'` | `justify-end` |
| `flexWrap: 'wrap'` | `flex-wrap` |
| `gap: 4` | `gap-1` |
| `gap: 6` | `gap-1.5` |
| `gap: 8` | `gap-2` |
| `gap: 10` | `gap-2.5` |
| `gap: 12` | `gap-3` |
| `gap: 16` | `gap-4` |
| `gap: 18` | `gap-[18px]` |
| `gap: 20` | `gap-5` |
| `gap: 24` | `gap-6` |
| `width: '100%'` | `w-full` |
| `height: '100%'` | `h-full` |
| `marginTop: 4` | `mt-1` |
| `marginTop: 8` | `mt-2` |
| `marginTop: 12` | `mt-3` |
| `marginTop: 18` | `mt-[18px]` |
| `marginTop: 24` | `mt-6` |
| `marginTop: 'auto'` | `mt-auto` |
| `padding: 14` | `p-[14px]` |
| `padding: 'var(--stage-padding)'` | `p-(--stage-padding)` |
| `padding: '8px 14px'` | `px-[14px] py-2` |
| `padding: '10px 16px'` | `px-4 py-[10px]` |
| `padding: '11px 18px'` | `px-[18px] py-[11px]` |
| `gridTemplateColumns: '1fr 1fr'` | `grid-cols-2` |
| `minHeight: 0` | `min-h-0` |
| `minHeight: 44` | `min-h-[44px]` |
| `flex: 1` | `flex-1` |
| `maxWidth: 'var(--surface-max-w)'` | `max-w-(--surface-max-w)` |

## Translation table — visual / typography

| Inline style | Tailwind class |
|---|---|
| `background: 'var(--color-surface-card)'` | `bg-(--color-surface-card)` |
| `background: 'transparent'` | `bg-transparent` |
| `color: 'var(--color-text-primary)'` | `text-(--color-text-primary)` |
| `color: 'var(--color-text-muted)'` | `text-(--color-text-muted)` |
| `border: '1px solid var(--color-border)'` | `border border-(--color-border)` |
| `borderRadius: 'var(--radius-card)'` | `rounded-(--radius-card)` |
| `borderRadius: 'var(--radius-pill)'` | `rounded-(--radius-pill)` |
| `fontFamily: 'var(--font-body)'` | `font-[family-name:--font-body]` |
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
| `lineHeight: 1.3` | `leading-[1.3]` |
| `cursor: 'pointer'` | `cursor-pointer` |
| `cursor: 'default'` | `cursor-default` |
| `cursor: 'not-allowed'` | `cursor-not-allowed` |
| `opacity: 0.4` | `opacity-40` |

## Dynamic values (CSS-var passthrough)

| Inline style | New approach |
|---|---|
| `style={{ width: \`${pct}%\` }}` | `style={{ '--bar-w': \`${pct}%\` } as CSSProperties} className="w-[var(--bar-w)]"` |
| `style={{ border: \`1px solid ${accent}\` }}` | `style={{ '--accent': accent } as CSSProperties} className="border border-(--accent)"` |
| `style={{ boxShadow: \`0 0 8px 1px ${accent}66\` }}` | `style={{ '--shadow': shadow } as CSSProperties} className="shadow-[var(--shadow)]"` |
| SVG `transform={...}` | LEAVE AS-IS — not a CSS `style` prop |

## Allowed remaining inline styles (CSS-var passthrough only)

To be filled after each Wave 3 file lands.

| File | Line | Why |
|---|---|---|

## Remaining inline styles (legitimate exceptions)

As of 2026-06-04, **23 inline `style={{...}}` blocks remain across 18 files** (`grep -rn "style={{" src --include="*.tsx"`). The 16 blocks across 13 files enumerated in the tables below — Categories 1, 2, and 3 — were curated as intentional exceptions through Plan 8. The 5 new files in `src/landing/` (`Hero.tsx`, `HeroPipelinePreview.tsx`, `LandingFooter.tsx`, `SceneCardGrid.tsx`, `SurfaceDeepPreview.tsx`) were added by Plan 10 (landing page) and have not yet been categorized — they may be legitimate exceptions or migration candidates. See [`docs/audits/2026-06-04-doc-drift.md`](../audits/2026-06-04-doc-drift.md) for the audit that surfaced this gap.

The 16 originally-curated exceptions remain intentional:

### Category 1: CSS-var passthrough (runtime-computed values)

| File | Reason |
|---|---|
| `src/components/Chip.tsx` | `--chip-ring`, `--chip-shadow` (active accent color/shadow) |
| `src/components/DataBar.tsx` | `--bar-w`, `--bar-fill`, `--bar-glow`, `--bar-value-color` (runtime percentages and accent colors) |
| `src/components/ContextWindowBar.tsx` | `--ctx-w`, `--ctx-fill` (runtime width + vendor-keyed color) |
| `src/components/AccentRule.tsx` | `--rule-color` (per-scene accent) |
| `src/components/PhilosophyCard.tsx` | `--vendor-color` (vendor-keyed title color) |
| `src/components/DeepToggle.tsx` | `--dt-label`, `--dt-border`, `--dt-shadow` (expanded-state accent) |
| `src/components/ProgressRail.tsx` | `--rail-bg`, `--rail-shadow`, `--rail-label` (per-button per-scene accent) |
| `src/components/PromptField.tsx` | Conditional `animation` based on `prefers-reduced-motion` |
| `src/scenes/PredictScene.tsx` | `--sm-color`, `--sm-bg` (softmax accent + tint) |

### Category 2: Arbitrary `gridTemplateColumns` (Tailwind cannot express)

Tailwind v4 supports `grid-cols-N` and `grid-cols-[arbitrary]`, but multi-token templates with `1fr auto 1fr` or `minmax(...) var(--g) var(--c)` are clearer as inline.

| File | Template |
|---|---|
| `src/components/SceneStation.tsx` | `minmax(var(--stage-min-w), 1fr) var(--col-gap) var(--col-right)` |
| `src/components/DistributionPair.tsx` | `1fr auto 1fr` |
| `src/components/DataBar.tsx` | `70px 1fr 52px` |
| `src/components/ContextWindowBar.tsx` | `120px 1fr 64px` |
| `src/scenes/AssembleScene.tsx` | `auto auto auto auto auto` (5-col) |
| `src/scenes/AttentionScene.tsx` | `auto auto auto` (×2) |
| `src/scenes/DecodeScene.tsx` | `max-content 1fr` |
| `src/scenes/TokenizeScene.tsx` | `repeat(3, max-content)` |

### Category 3: One-off CSS calc

| File | Reason |
|---|---|
| `src/scenes/AboutScene.tsx` | `maxWidth: 'calc(760px + var(--gutter-left))'` — one-off layout cap |

---

## Canonical theme classes

Tailwind v4's `@theme {}` block auto-generates utility classes from declared CSS variables. The arbitrary-value form `bg-(--color-X)` works, but the **canonical form is shorter and lints clean**. Always prefer canonical when both exist.

### Theme-token auto-generation (from `src/index.css:3-43`)

| `@theme` var | Auto-generated utilities |
|---|---|
| `--color-X` | `bg-X`, `text-X`, `border-X`, `divide-X`, `ring-X`, `from-X`, `to-X`, `stroke-X`, `fill-X`, … |
| `--font-X` | `font-X` |
| `--radius-X` | `rounded-X` |

### Concrete translations for this project

| Arbitrary form | Canonical theme class |
|---|---|
| `bg-(--color-surface-card)` | `bg-surface-card` |
| `bg-(--color-surface-deep)` | `bg-surface-deep` |
| `bg-(--color-surface-track)` | `bg-surface-track` |
| `bg-(--color-bg-base)` | `bg-bg-base` |
| `bg-(--color-rail-inactive)` | `bg-rail-inactive` |
| `bg-(--color-bar-inactive)` | `bg-bar-inactive` |
| `text-(--color-text-primary)` | `text-text-primary` |
| `text-(--color-text-muted)` | `text-text-muted` |
| `text-(--color-accent-caveat)` | `text-accent-caveat` |
| `border-(--color-border)` | `border-border` *(awkward but canonical)* |
| `border-(--color-accent-caveat)` | `border-accent-caveat` |
| `border-(--color-accent-attention)` | `border-accent-attention` |
| `border-(--color-accent-output)` | `border-accent-output` |
| `rounded-(--radius-card)` | `rounded-card` |
| `rounded-(--radius-pill)` | `rounded-pill` |
| `rounded-(--radius-deep-panel)` | `rounded-deep-panel` |
| `rounded-(--radius-accent-rule)` | `rounded-accent-rule` |
| `rounded-(--radius-rail-active)` | `rounded-rail-active` |
| `rounded-(--radius-rail-inactive)` | `rounded-rail-inactive` |
| `font-[family-name:--font-body]` | `font-body` |
| `font-[family-name:--font-mono]` | `font-mono` |
| `font-[family-name:--font-display]` | `font-display` |

### Pixel-value-to-scale translations

The default Tailwind v4 spacing scale is `0.25rem` (4px) per unit. Map exact `[Npx]` values to the canonical scale where N is a multiple of 2:

| Arbitrary | Canonical |
|---|---|
| `py-[14px]` | `py-3.5` |
| `mt-[18px]` | `mt-4.5` |
| `gap-[10px]` | `gap-2.5` |
| `gap-[18px]` | `gap-4.5` |
| `pt-[104px]` | `pt-26` |
| `min-w-[44px]` | `min-w-11` |
| `min-h-[44px]` | `min-h-11` |
| `w-[72px]` | `w-18` |
| `w-[30px]` | `w-7.5` |
| `h-[34px]` | `h-8.5` |
| `h-[3px]` | (no canonical — keep `h-[3px]`) |
| `h-[18px]` | `h-4.5` |
| `h-[22px]` | `h-5.5` |
| `px-[14px]` | `px-3.5` |
| `px-[18px]` | `px-4.5` |
| `py-[10px]` | `py-2.5` |
| `py-[11px]` | (no canonical — keep) |
| `text-[Npx]` | keep arbitrary unless N matches the `text-xs/sm/base/lg/...` scale (12/14/16/18/...) |
| `leading-[Npx]` | `leading-N/4` for multiples of 4 |

### Keep arbitrary (no canonical exists)

- CSS-var passthrough for runtime values (`--bar-w`, `--rail-bg`, `--tier-color`, etc.) — these are *element-local* custom properties, not theme tokens.
- Custom `@theme` vars that don't match Tailwind's known prefixes (`--stage-padding`, `--gutter-left`, `--col-gap`, `--col-right`, `--surface-max-w`, `--stage-h`, `--stage-min-w`) — Tailwind v4 only auto-generates utilities for the well-known prefixes; these stay as `p-(--stage-padding)`, `h-(--stage-h)`, etc.
- Pixel values that don't fall on the 4px/0.5-unit scale (`text-[11px]`, `text-[13px]`, `text-[15px]`, `text-[17px]`, `text-[22px]`, `text-[28px]`, `leading-[1.3]`, `tracking-[0.54px]`, `tracking-[-0.2px]`, `tracking-[-1px]`).
