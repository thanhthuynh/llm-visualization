<!-- Generated: 2026-06-04 | Files scanned: 53 | Token estimate: ~250 -->

# Codemaps — Inside an LLM

Token-lean architecture docs for agent context loading. Updated via `/ecc:update-codemaps`. Pair with [`../../CLAUDE.md`](../../CLAUDE.md) for project conventions.

| Map | Scope | When to read |
|---|---|---|
| [architecture.md](architecture.md) | High-level system, scene pipeline, data flow | First load when entering a new conversation |
| [frontend.md](frontend.md) | `src/` tree, providers, components, scenes, landing | Any UI change |
| [data.md](data.md) | `src/data/` — Zod schemas, loaders, prompts, illustrative datasets | Any data-shape or dataset change |
| [dependencies.md](dependencies.md) | npm deps, external services, env vars | Adding/removing libraries or services |

**No `backend.md`** — this is a single-page client-side app. The only external runtime services are Cloudflare Pages (host) and Umami Cloud (analytics). See `dependencies.md`.

## Freshness

Each codemap carries a `<!-- Generated -->` header. If a map is stale relative to recent `src/` changes, re-run `/ecc:update-codemaps`. The drift audit at [`../audits/2026-06-04-doc-drift.md`](../audits/2026-06-04-doc-drift.md) is the most recent verification of doc-vs-code sync.
