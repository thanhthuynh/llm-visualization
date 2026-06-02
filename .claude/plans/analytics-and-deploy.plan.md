# Plan: Analytics + Public Launch via Cloudflare Pages

**Source**: conversational `/ecc:plan` session 2026-06-02
**Complexity**: Small–Medium (≈3–5 hours including manual setup)
**Goal**: Ship `llm-visualization` publicly on Cloudflare Pages free tier with Umami Cloud analytics for pageviews + button clicks + scene-reach events.

## Summary

- **Host**: Cloudflare Pages, served at `<project>.pages.dev` (free subdomain, unlimited bandwidth)
- **Analytics**: Umami Cloud free tier — single tool, cookieless, no consent banner
- **Auto-deploy** on push to `main` via GitHub integration; preview URLs per PR
- **Events**: `page-view` (auto), `cta-*` button clicks (declarative `data-umami-event`), `scene-reached` (programmatic, once-per-session dedupe)

## Patterns to Mirror

| Category | Source | Pattern |
|---|---|---|
| Hook composition | `src/app/useHashSync.ts` | Custom hook; `useEffect` side-effect on state change |
| Context | `src/app/SceneNavContext.tsx:6` | Single `goTo` chokepoint; React context provider |
| Scene-id typing | `src/scenes/scenes.config.ts` | Reuse exported `SceneId` union as event property type |
| Tests | `tests/` (Vitest + jsdom), `e2e/` (Playwright) | Unit tests colocated under `tests/<feature>/` |
| Env vars | (none yet) | Vite convention: `VITE_*` prefix → exposed to client |

## Architecture

```
index.html
  └─ <script defer src="https://cloud.umami.is/script.js"
              data-website-id="%VITE_UMAMI_WEBSITE_ID%"></script>
       ↓ loads window.umami globally

src/App.tsx
  ├─ useTrackSceneReach(activeSceneId, depth)   → emits `scene-reached` once per session
  └─ <button data-umami-event="cta-*">          → declarative click tracking (no JS)

Cloudflare Pages
  ├─ GitHub push (main) → npm run build → deploy to edge
  ├─ Env var VITE_UMAMI_WEBSITE_ID set in CF UI → injected into HTML at build
  └─ <project>.pages.dev (HTTPS, global CDN, unlimited bandwidth)
```

## Files to Change

| File | Action | Why |
|---|---|---|
| `index.html` | UPDATE | Inject Umami `<script>` with `%VITE_UMAMI_WEBSITE_ID%` placeholder |
| `src/analytics/events.ts` | CREATE | Event-name union + payload `interface`s — canonical taxonomy |
| `src/analytics/umami.ts` | CREATE | Typed `track()` wrapper; safe no-op when `window.umami` undefined |
| `src/analytics/useTrackSceneReach.ts` | CREATE | Hook: on `SceneId` change → emit once per session via `useRef<Set>` |
| `src/App.tsx` | UPDATE | Call `useTrackSceneReach` at app root where active scene + depth live |
| `tests/analytics/umami.test.ts` | CREATE | Wrapper no-ops without `window.umami`; calls with exact args when present |
| `tests/analytics/useTrackSceneReach.test.tsx` | CREATE | Dedupe across rerenders; re-emits on scene change |
| `.env.example` | CREATE | Document `VITE_UMAMI_WEBSITE_ID` |
| `README.md` | UPDATE | Add **Deploy** + **Analytics** sections |
| Selected CTA components | UPDATE | Add `data-umami-event="<id>"` attributes (during Task 7) |

> `wrangler.toml` not needed — CF Pages UI handles project setup. `_redirects` not needed — app uses hash routing.

## Tasks

### Task 1 — Analytics module (events + wrapper)
- **Create** `src/analytics/events.ts`:
  - `export type AnalyticsEvent = 'scene-reached' | 'cta-start-explore' | 'cta-depth-toggle' | ...`
  - `export interface SceneReachedProps { scene: SceneId; depth: 'surface' | 'deep' }`
- **Create** `src/analytics/umami.ts`:
  - `export function track(event: AnalyticsEvent, props?: Record<string, unknown>): void`
  - Body: `if (typeof window !== 'undefined' && window.umami) { window.umami.track(event, props) }`
  - Declare global: `interface Window { umami?: { track: (e: string, p?: Record<string, unknown>) => void } }`
  - No `any`. No throw. No `console.log`.
- **Validate**: `npm run typecheck`

### Task 2 — `useTrackSceneReach` hook
- **Create** `src/analytics/useTrackSceneReach.ts`:
  ```ts
  export function useTrackSceneReach(
    sceneId: SceneId | null,
    depth: 'surface' | 'deep',
  ): void
  ```
- Internals: `useRef<Set<SceneId>>(new Set())` + `useEffect` on `[sceneId, depth]`.
- On effect: skip if `sceneId === null` or already in set; else `track('scene-reached', { scene: sceneId, depth })` then `set.add(sceneId)`.
- Set lives until page reload = one session — matches Umami's session window.
- **Mirror**: `src/app/useHashSync.ts` for hook shape.

### Task 3 — Mount the hook
- Locate active `SceneId` + `depth` in `src/App.tsx` (or wherever `SceneNavProvider` + `DepthContext` compose).
- Add `useTrackSceneReach(activeSceneId, depth)` once at app root.
- No other changes — scene components stay untouched.

### Task 4 — Tests
- `tests/analytics/umami.test.ts`:
  - `track('x')` is a no-op when `window.umami` undefined (no throw).
  - With `vi.stubGlobal('umami', { track: vi.fn() })`, `track('x', { a: 1 })` calls `track` with `('x', { a: 1 })`.
- `tests/analytics/useTrackSceneReach.test.tsx` (uses `@testing-library/react`, `vi.mock('@/analytics/umami')`):
  - Render with `scene='prompt'` → 1 call.
  - Rerender with same `'prompt'` → still 1 call.
  - Rerender with `'tokenize'` → 2 calls total.
  - Switching `depth` while same scene → no re-emit (scene already in set).
- **Validate**: `npm test`

### Task 5 — Inject Umami script in `index.html`
- Add **after** the Google Fonts `<link>`s, before `</head>`:
  ```html
  <script defer
          src="https://cloud.umami.is/script.js"
          data-website-id="%VITE_UMAMI_WEBSITE_ID%"
          crossorigin="anonymous"></script>
  ```
- Vite substitutes `%VITE_*%` placeholders in `index.html` at build time when the env var is present.
- When env var is empty (local dev), `data-website-id=""` → Umami script no-ops → zero dev-pollution in prod analytics.
- **No SRI (`integrity=...`)** — intentional. Umami Cloud auto-updates `script.js` without URL versioning, so a pinned hash would silently break analytics on every vendor release. `crossorigin="anonymous"` is included so CORS errors surface cleanly in DevTools. The CDN-trust risk is tracked in the **Risks** table and the real mitigation path (self-host) is Future Enhancement #1.

### Task 6 — Env-var plumbing
- **Create** `.env.example`:
  ```
  # From https://cloud.umami.is → Settings → Websites → your site → Tracking code
  VITE_UMAMI_WEBSITE_ID=
  ```
- Local `.env` stays out of git (already covered by `.gitignore:9` → `.env*`).
- CF Pages stores the real UUID as a project env var (Task 9).

### Task 7 — Add `data-umami-event` to high-value CTAs
- During implementation, walk through these candidates (decide one-by-one; review with user):
  - Landing page "Start" / "Explore" button → `data-umami-event="cta-start-explore"`
  - Surface ↔ Deep toggle → `data-umami-event="cta-depth-toggle"` + `data-umami-event-to="surface|deep"`
  - Scene-card buttons on landing → `data-umami-event="cta-scene-card"` + `data-umami-event-scene="<id>"`
  - Any "Next scene" / "Prev scene" navigation buttons → `data-umami-event="cta-scene-nav"` + `data-umami-event-direction="next|prev"`
- Keep the taxonomy in `src/analytics/events.ts` in sync — update the `AnalyticsEvent` union when adding new names.
- Ceiling: ≤15 named events to start. Resist instrumenting everything.

### Task 8 — Umami Cloud account (manual)
- Sign up at https://cloud.umami.is (free).
- Add website: name `Inside an LLM`, domain `<project>.pages.dev` (placeholder; can update).
- Copy the `data-website-id` UUID from the tracking-code snippet.
- Keep dashboard public/share-link off unless you want stats public.

### Task 9 — Cloudflare Pages project (manual)
1. Push current `main` to GitHub (HEAD `fd17866`).
2. https://dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git → select repo.
3. Build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output: `dist`
   - Root directory: `/`
4. Environment variables (Production + Preview):
   - `NODE_VERSION` = `20` (matches `.nvmrc`)
   - `VITE_UMAMI_WEBSITE_ID` = UUID from Task 8
5. Save & deploy. First build should take ~2 min.

### Task 10 — README update
- Add **Deploy** section (3–5 lines): pushed to `main` auto-deploys via CF Pages; PRs get preview URLs.
- Add **Analytics** section (3–5 lines): Umami Cloud, cookieless, taxonomy in `src/analytics/events.ts`, no consent banner required.

## Event Taxonomy (initial)

| Event | Trigger | Props |
|---|---|---|
| (pageview) | auto, Umami | — |
| `scene-reached` | first visit to each scene in a session | `{ scene: SceneId, depth: 'surface' \| 'deep' }` |
| `cta-start-explore` | landing-page primary CTA | — |
| `cta-depth-toggle` | Surface ↔ Deep toggle | `{ to: 'surface' \| 'deep' }` |
| `cta-scene-card` | landing-page scene-card click | `{ scene: SceneId }` |
| `cta-scene-nav` | next/prev scene buttons | `{ direction: 'next' \| 'prev' }` |

## Validation

**Local (pre-deploy):**
```bash
npm run typecheck
npm test
npm run build && npm run preview        # confirm built HTML has Umami script tag
npm run e2e                             # Playwright happy-path unchanged
```

**Post-deploy:**
```bash
curl -I https://<project>.pages.dev/                          # 200 OK
curl -s  https://<project>.pages.dev/ | grep cloud.umami.is   # script tag present
```
- Open deployed URL → DevTools → Network: see `/script.js` (200) and `/api/send` on pageview.
- Click instrumented button → second `/api/send` with the event name.
- Navigate scene → `/api/send` with `scene-reached`.
- Re-navigate to same scene → no new `scene-reached` (dedupe).
- Umami dashboard shows the visit in real-time.

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Free-tier event ceiling hit by viral share | Low–Med | Once-per-session dedupe on `scene-reached`. Escape: self-host Umami on CF Workers + D1 (still free, more ops). |
| `vite.config.ts:11-13` git-rev call fails on CF Pages | Low | CF does full clone; existing try/catch already returns `'unknown'` on failure. |
| `window.umami` undefined when `track()` runs (script not loaded yet) | Low | Wrapper checks before call; tested in Task 4. |
| Sourcemaps exposed publicly (`sourcemap: true` in `vite.config.ts:8`) | Trivial | Acceptable — open educational site; sourcemaps aid learners. |
| Ad-blocker blocks `cloud.umami.is` | Med | Expected & correct — readers opting out is fine. |
| Umami CDN compromise injects malicious JS into visitors' browsers | Low | No SRI (would break on vendor updates — see Task 5). Blast radius limited: static site, no auth/PII/payments. Real mitigation = self-host (Future Enhancement #1); promote if posture concerns increase. |

## Future Enhancements (out of scope now)

1. **Self-host Umami** on CF Workers + D1 — eliminates third-party CDN supply-chain risk AND removes the event-volume ceiling. Same-origin script delivery; SRI becomes feasible (you control the build). Promote when either: (a) traffic outgrows free-tier event cap, or (b) supply-chain risk posture tightens.
2. Custom domain — buy `.dev` at Cloudflare Registrar (~$12/yr), add to CF Pages; no code change.
3. Open Graph + Twitter Card meta tags in `index.html` for social-share previews.
4. Saved funnel in Umami: Prompt → Tokenize → … → Output reach %.

## Acceptance

- [ ] Tasks 1–10 complete
- [ ] `npm run typecheck && npm test && npm run build && npm run e2e` green locally
- [ ] First CF Pages deploy green
- [ ] Umami dashboard shows pageview within 60 s of opening the deployed URL
- [ ] One `scene-reached` event fires per scene per session; dedupe verified in DevTools
- [ ] At least three CTA buttons instrumented with `data-umami-event`
- [ ] README **Deploy** + **Analytics** sections present
