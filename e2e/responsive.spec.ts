import { test, expect } from '@playwright/test'

/**
 * Launch-polish regressions (added during the pre-launch QA pass):
 *
 *  1. The animated prologue hero must actually PAINT at scroll 0 on load.
 *     The sticky stage is a composited layer (will-change + contain); some
 *     engines defer its first paint until a scroll/invalidation, leaving the
 *     hero blank on landing. opacity/visibility assertions can't catch this
 *     (the element computes visible), so we sample real pixels.
 *
 *  2. No horizontal overflow on narrow viewports. The station shell used to
 *     have a hard ~1140px floor (fixed 3-column grid, no breakpoints), so any
 *     viewport < ~1180px scrolled sideways with the surface column off-screen.
 */

test.describe('prologue hero paints on initial load', () => {
  test('hero is not blank at the top of the animated prologue (scrollY 0)', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(300)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(150)

    // Sample the band where the hero "Inside an LLM." sits (centered in the stage).
    const clip = { x: 260, y: 250, width: 760, height: 240 }
    const buf = await page.screenshot({ clip })
    const dataUrl = 'data:image/png;base64,' + buf.toString('base64')

    // Decode in-browser via canvas (no Node PNG dependency) and find the
    // brightest pixel. Hero text is near-white (~765); a blank dark stage is <120.
    const maxLum = await page.evaluate(async (url) => {
      const img = new Image()
      img.src = url
      await img.decode()
      const canvas = new OffscreenCanvas(img.width, img.height)
      const ctx = canvas.getContext('2d')
      if (!ctx) return -1
      ctx.drawImage(img, 0, 0)
      const { data } = ctx.getImageData(0, 0, img.width, img.height)
      let maxL = 0
      for (let i = 0; i < data.length; i += 4) {
        const l = data[i] + data[i + 1] + data[i + 2]
        if (l > maxL) maxL = l
      }
      return maxL
    }, dataUrl)

    expect(maxLum).toBeGreaterThan(400)
  })
})

test.describe('responsive: no horizontal overflow on narrow viewports', () => {
  const NARROW = { width: 390, height: 844 }

  for (const id of ['interlude', 'window', 'attention', 'compare', 'about']) {
    test(`#${id} does not overflow horizontally at ${NARROW.width}px`, async ({ page }) => {
      await page.setViewportSize(NARROW)
      await page.goto(`/#${id}`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(250)
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })
  }
})
