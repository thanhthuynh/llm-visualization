# The Atlas — An atlas of language models

> From the boundaries of a context window to the autonomous loops of an agent — the whole territory of a modern LLM, charted as one map.

A single-page, nautical-chart-themed explainer of LLM internals. The Atlas treats a language model as territory to be surveyed: every concept is a numbered chart plate, every process a route, every budget a sounding measured in tokens. One continuously scrolling page with a fixed station rail, hash deep-links (`#/plate-iv`), keyboard paging (←/k, →/j), and per-plate entrance animations that respect `prefers-reduced-motion`. Dark only — dark is the design.

**Live:** [llm-visualization.pages.dev](https://llm-visualization.pages.dev)

**Stack:** Vite · React 19 · TypeScript 5.7 strict · Tailwind v4 · Motion + Web Animations API · self-hosted Fraunces/Hanken Grotesk/Spline Sans Mono · Umami · Playwright · vitest-axe

---

## Honesty — read this first

**Every number on this site is illustrative.** Token counts, similarity scores, attention weights, and the candidate logits behind the interactive decode controls are fixed design values, not measurements of any real model. What *is* real is the math: Plate IV·Detail runs an exact softmax with temperature scaling and top-p nucleus truncation over those illustrative logits, live, as you move the sliders. The site never claims to visualize a frontier model's internals — providers do not expose them.

---

## The charts

| Plate | Title | Subject |
|---|---|---|
| — | **Home** | Clickable route map of the whole territory |
| I | *The Boundaries of Memory* | The context window — a 128K-token transect |
| II | *Standing Orders* | The system prompt — read first, every turn |
| III | *Bearings from Afar* | Retrieval/RAG — nearness is similarity |
| IV | *The Inference Passage* | Prompt → tokenize → embed → attend → predict → sample → output |
| IV·D | *The Passage, Sounded* | One real prompt through all seven stations, with live temperature / top-p / decode controls |
| V | *The Self-Directed Survey* | Agents — goal, instruments, and the reason–act–observe loop |
| VI | *The Scouting Party* | Subagents — parallel isolated scouts, condensed findings |
| VII | *The Circuit* | Loops — iterations and stop conditions |
| App. | *Gazetteer of Terms* | 17 cross-linked definitions |
| 00 | *About the Atlas* | Colophon and how to read these charts |

---

## Develop

```bash
nvm use            # Node 20
npm install
npm run dev        # localhost:5173
```

| Command | What it does |
|---|---|
| `npm run build` | Typecheck + production build |
| `npm test` | Vitest unit + a11y-unit suites |
| `npm run e2e` | Playwright E2E (Chromium) |
| `npm run a11y` / `npm run a11y:e2e` | axe scans — per plate (jsdom) and across all 11 live sections |
| `npm run lint` / `npm run format` | ESLint (zero-warning) / Prettier |

Deployed on Cloudflare Pages from `main`; PRs get preview URLs.

## License

MIT — see [LICENSE](LICENSE).
