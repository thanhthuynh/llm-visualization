/**
 * Phase-0 (gate zero) decision record: the prologue sticky-pin → scroll-snap handoff model.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FINDINGS NOTE (Phase-0 automated spike — `src/prologue/_spike/SpikeHarness.tsx`)
 * ─────────────────────────────────────────────────────────────────────────────
 * Harness: a 450vh `.prologue-track` with a `position:sticky; top:0; height:100vh`
 * stage. Inside the stage, ONE `motion` element driven by
 * `useScroll({ target, offset: ['start start','end end'] })` maps
 * `scrollYProgress` → opacity + translateY (transform-only, NO layout/width/height
 * transforms) over 60 absolutely-positioned dots (the heaviest beat: the embed
 * constellation). After the track: a 1px sentinel, then three snapping dummy
 * stations. The document/body is the single scroll root (no nested overflow).
 *
 * Automated measurement (Playwright, scripted wheel sweep under 4× CPU throttle):
 *
 *   | Engine   | Median fps | 95p frame delta | Seam snap        |
 *   |----------|------------|-----------------|------------------|
 *   | chromium | ~60 fps    | ≤ 16.7ms (PASS) | clean (≤1px)     |
 *   | webkit   | see report — automated webkit measurement availability    |
 *   | firefox  | see report — automated firefox measurement availability   |
 *
 * Exact per-run numbers and the engines that could NOT be measured automatically
 * are in `.superpowers/sdd/task-0-report.md`. The spike spec
 * (`e2e/_spike-handoff.spec.ts`) asserts 95p frame delta ≤ 16.7ms and a clean
 * (≤1px) seam snap on Chromium.
 *
 * CSS the production prologue stage SHOULD use (validated by the spike, see
 * the "Phase-0 spike" block in `src/index.css`):
 *   - sticky stage:  `will-change: transform;` `contain: layout paint;`
 *   - the moving `motion` element: animate ONLY `transform` + `opacity`
 *     (compositor-only properties); never width/height/top/left/margin.
 *   - snap on the ROOT (`html`), prologue track is a non-snapping region
 *     (`scroll-snap-align: none`), the post-track sentinel carries
 *     `scroll-snap-align: start` so the handoff lands on a real snap target.
 *
 * real-Safari / iOS confirmation: PENDING human pass. macOS dev box + headless
 * Chromium cannot stand in for Safari's sticky/snap interaction; the manual
 * protocol (run the harness, eyeball the on-screen fps overlay in real Safari and
 * iOS Safari for both `?mode=proximity` and `?mode=mandatory-pinned`) is in
 * `.superpowers/sdd/task-0-report.md`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type PrologueSnapMode = 'proximity' | 'mandatory-pinned' | 'static'

/**
 * Provisional from the Phase-0 automated spike; confirm against the human's
 * real-Safari pass. `proximity` lets the long sticky-scrubbed prologue track
 * scroll freely (no forced snapping mid-scrub) while still snapping cleanly onto
 * each station once the user is near a snap point — the behaviour the spike
 * measured as smooth on Chromium with a clean ≤1px seam snap.
 */
export const PROLOGUE_SNAP_MODE: PrologueSnapMode = 'proximity'

/**
 * Phase-0 decision (D2): the document/body is the single scroll root. There is no
 * nested overflow scroller, so the IntersectionObserver root is the viewport
 * (`undefined`). Every later phase branches on this model.
 */
export const SCROLL_ROOT_SELECTOR: string | undefined = undefined
