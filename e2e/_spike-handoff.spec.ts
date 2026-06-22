/**
 * TEMPORARY — Phase-0 (gate zero) spike spec.
 *
 * Validates the prologue sticky-pin → scroll-snap handoff on Chromium under a 4×
 * CPU throttle:
 *   1. A scripted wheel sweep from the top, through the 450vh pinned track,
 *      across the seam, into the dummy stations.
 *   2. A `requestAnimationFrame` probe records frame deltas during the sweep;
 *      assert 95th-percentile frame delta ≤ 16.7ms (≈58fps).
 *   3. After a scroll that ends just past the pin, assert the first dummy
 *      station's top is within 1px of 0 (clean snap — no double-snap / rubber-band).
 *
 * Runs on the existing `chromium` project (`npm run e2e`). webkit/firefox are a
 * best-effort attempt recorded in the report. Deleted in the deferred cleanup
 * task after the human's real-Safari pass.
 */
import { test, expect } from '@playwright/test'

// TODO(Phase 0 cleanup): SpikeHarness removed from main.tsx in Task 1.1 (route collapse).
// The /?spike=handoff route no longer exists. This spec is decommissioned with the harness;
// it will be deleted in the deferred Phase-0 cleanup task after the human's real-Safari pass.
test.skip(true, 'SpikeHarness removed in Task 1.1 — decommissioned pending Phase-0 cleanup')

const FRAME_BUDGET_MS = 16.7 // ≈58fps; the 95p frame-delta ceiling
const SWEEP_STEPS = 40
const STEP_PX = 220

declare global {
  interface Window {
    __spikeFrameDeltas?: number[]
    __spikeProbeStop?: () => void
  }
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const rank = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)
  return sorted[Math.max(0, rank)] ?? 0
}

test('prologue sticky→snap handoff: 58fps under 4× throttle + clean seam snap', async ({
  page,
}) => {
  // Throttle the CPU 4× via CDP so the transform-only scrub is stress-tested on a
  // mid-tier device proxy. Chromium only — guarded so a non-Chromium engine still
  // runs the functional assertions.
  const client = await page
    .context()
    .newCDPSession(page)
    .catch(() => null)
  if (client) {
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  }

  await page.goto('/?spike=handoff&mode=proximity')
  await expect(page.getByTestId('fps-overlay')).toBeVisible()
  await expect(page.getByTestId('spike-station-1')).toBeAttached()

  // Install a rAF frame-delta probe.
  await page.evaluate(() => {
    window.__spikeFrameDeltas = []
    let last = performance.now()
    let running = true
    const loop = (now: number) => {
      const delta = now - last
      last = now
      if (delta > 0) window.__spikeFrameDeltas?.push(delta)
      if (running) requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
    window.__spikeProbeStop = () => {
      running = false
    }
  })

  // Scripted wheel sweep from top → through the pinned track → across the seam.
  for (let i = 0; i < SWEEP_STEPS; i += 1) {
    await page.mouse.wheel(0, STEP_PX)
    await page.waitForTimeout(24)
  }

  await page.evaluate(() => window.__spikeProbeStop?.())
  const deltas = await page.evaluate(() => window.__spikeFrameDeltas ?? [])

  // Drop the first few deltas (warm-up / layout) before computing the percentile.
  const steady = deltas.slice(3)
  const p95 = percentile(steady, 95)
  const medianFps = steady.length > 0 ? Math.round(1000 / percentile(steady, 50)) : 0

  // Attach the numbers to the report so they show up without console logging.
  test
    .info()
    .annotations.push(
      { type: 'spike-engine', description: test.info().project.name },
      { type: 'spike-median-fps', description: String(medianFps) },
      { type: 'spike-p95-frame-delta-ms', description: p95.toFixed(2) },
      { type: 'spike-frames-sampled', description: String(steady.length) },
    )

  expect(steady.length, 'frame probe collected samples during the sweep').toBeGreaterThan(20)
  expect(p95, `95p frame delta ${p95.toFixed(2)}ms ≤ ${FRAME_BUDGET_MS}ms`).toBeLessThanOrEqual(
    FRAME_BUDGET_MS,
  )

  // Now exercise the seam snap explicitly. Scroll to just past the end of the
  // 450vh track (so the next snap target is the seam sentinel / station 1), then
  // let proximity snap settle.
  await page.evaluate(() => {
    const track = document.querySelector<HTMLElement>('.prologue-track')
    if (!track) return
    const trackEnd = track.offsetTop + track.offsetHeight
    // A nudge a little past the track end lands inside proximity-snap range of
    // the seam sentinel → station 1.
    window.scrollTo({ top: trackEnd + 4, behavior: 'auto' })
  })
  // Nudge with the wheel so the snap engine commits, then settle.
  await page.mouse.wheel(0, 120)
  await page.waitForTimeout(500)

  const stationTop = await page
    .getByTestId('spike-station-1')
    .evaluate((el) => el.getBoundingClientRect().top)

  test.info().annotations.push({
    type: 'spike-seam-station1-top',
    description: stationTop.toFixed(2),
  })

  expect(
    Math.abs(stationTop),
    `station 1 top ${stationTop.toFixed(2)}px within 1px of 0 (clean seam snap)`,
  ).toBeLessThanOrEqual(1)
})
