# Inside an LLM — Interactive Explainer

A single-page interactive explainer that walks readers through what happens when a Large Language Model receives a prompt and produces output — from raw text to streamed tokens. Two-tier progressive disclosure: a Surface path for non-technical readers, a Deep path for technically literate peers.

## Status

Plan 1 (Foundation + Reference Scene) complete. `PredictScene` + About scene are live; remaining scenes (Prompt, Tokenize, Embed, Attention, Decode, Output) ship in Plans 2–4.

## Provenance — important

Every number, embedding coordinate, attention weight, and probability shown in this site comes from a small open reference model — **GPT-2 small**, run offline. **They are illustrative.** Frontier providers (Claude, ChatGPT) do not expose token-level attention, embedding coordinates, or full next-token distributions for arbitrary input, so this site cannot honestly visualize their internals. See the `About` section in-app.

## Run

```bash
npm install
npm run dev
```

## Test

```bash
npm test            # unit tests (vitest)
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run e2e         # playwright (Chromium happy-path)
npm run build       # produces static dist/
```

## Stack

Vite · React 19 · TypeScript 5.7 strict · Tailwind v4 · Motion · D3 (scale only) · Zod 4.
