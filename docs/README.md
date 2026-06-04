# Documentation Index

Topic docs that aren't the public README. Audit reports, design briefs, migration cheat sheets, and pointers to external documents that complete the picture.

## In this folder

| Doc | What it covers | Last updated |
|---|---|---|
| [a11y/2026-06-01-audit.md](a11y/2026-06-01-audit.md) | WCAG 2.1 AA audit using vitest-axe + `@axe-core/playwright`. 10/10 unit-axe + 9/9 E2E-axe passing. Documents the one `landmark-unique` serious fix and the nine deferred `color-contrast` findings that need a brand-level decision. Includes VoiceOver walkthrough checklist for the manual layer. | 2026-06-01 |
| [tailwind-migration/cheat-sheet.md](tailwind-migration/cheat-sheet.md) | Reference for the inline-style → Tailwind-utility migration (Plans 7 + 8). Translation tables for layout, visual/typography, dynamic-value passthrough. Lists the 16 legitimate remaining inline-style exceptions and *why* each one stays. Adds the canonical-theme-class form (`bg-surface-card`) that supersedes the arbitrary form (`bg-(--color-surface-card)`) where Tailwind v4 auto-generates utilities. | 2026-06-01 |
| [landing-page-brand-voice.md](landing-page-brand-voice.md) | Voice profile derived from existing app copy (README, Predict, Decode, About, Compare scenes). Six voice attributes + six anti-attributes + three signature moves + microcopy length norms + preserved-exactly honesty disclosures + the final reusable VOICE PROFILE block. Anchors all landing-page copy. | 2026-06-01 |
| [landing-page-design-direction.md](landing-page-design-direction.md) | The brief Figma worked from for the landing page. Visual language, color usage (the 7 accents are sacred), hero composition with chip-strip mechanic, scene-card grid, provenance section as a "methods section, not a disclaimer," two-paths demo, motion budget, and an explicit "what we will NOT do" list. | 2026-06-01 |
| [CODEMAPS/](CODEMAPS/) | Token-lean per-area source-tree maps for agent context loading: `architecture.md` (mount chain, scene pipeline, data flow), `frontend.md` (src/ layout + 24 components + 9 scenes + 8 landing sections), `data.md` (Zod-validated dataset boundary), `dependencies.md` (6 runtime packages + external services + analytics taxonomy). Pair with `../CLAUDE.md`. | 2026-06-04 |
| [audits/2026-06-04-doc-drift.md](audits/2026-06-04-doc-drift.md) | Documentation drift audit at HEAD `8111053`. Confirms 9 scenes ✅, 10 analytics events ✅, scenes.config.ts SSoT ✅. Flags one drift: the inline-style count of 16/13 in `tailwind-migration/cheat-sheet.md` is stale — actual is **23 blocks across 18 files** (Plan 10 landing files were never categorized). Cheat sheet and `../README.md:121` updated in the same session. | 2026-06-04 |

## Pointers to external docs

| Doc | Where | Why it's there |
|---|---|---|
| **Engineering + visual spec v1.1** (source of truth) | External notes, pinned to the project's private Figma file (link kept in maintainer notes) | Big, opinionated, Figma-locked. The visual + architectural source of truth. |
| **Engineering + visual spec v1.0** (historical) | External notes | The pre-Figma brief. Kept for continuity; superseded by v1.1. |
| **PRD (retrospective)** | in-repo — [`PRD.md`](PRD.md) | Product intent, the 25 decisions worth remembering, analytics design, Tier-1/2/3 success metrics, risks carried forward. The product-lens companion to the spec. |
| **Figma design file** | Private — *Inside an LLM — Design System + Scenes* (link kept in maintainer notes) | Visual source of truth; tokens, scene frames (14 = 7 surface + 7 deep), and component library. |
| **CHANGELOG** | `../CHANGELOG.md` | Per-PR version log with rationale and links. |

## Document conventions

- **READMEs answer "what is this and how do I run it?"** They are public-facing and front-of-the-line.
- **Specs answer "what does it look like and how is it built?"** They are visual + architectural sources of truth.
- **PRDs answer "why does it exist and how will we know it worked?"** They carry product intent, decisions, and metrics.
- **Audit reports** are dated (`YYYY-MM-DD-topic.md`) so the *time* of the finding is part of the filename.
- **Cheat sheets** are living references — updated as new cases emerge during migration work.
