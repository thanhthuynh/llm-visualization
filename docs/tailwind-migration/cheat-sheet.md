# Tailwind Migration — Cheat Sheet

> Reference for `docs/superpowers/plans/2026-06-01-llm-explainer-plan-7-tailwind-migration.md`.
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
