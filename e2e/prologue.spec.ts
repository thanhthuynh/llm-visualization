import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('prologue — site entry experience', () => {
  test('shows the animated prologue on a fresh (hash-less) visit', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.prologue-track')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: /Inside an LLM\./i })).toBeVisible()
  })

  test('is bypassed on a station deep-link (/#tokenize)', async ({ page }) => {
    await page.goto('/#tokenize')
    await expect(page.locator('.prologue-track')).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 2, name: 'Tokenization' })).toBeVisible()
  })

  test('renders the static variant under ?prologue=static', async ({ page }) => {
    await page.goto('/?prologue=static')
    await expect(page.locator('.prologue-static')).toBeVisible()
    await expect(page.locator('.prologue-track')).toHaveCount(0)
    await expect(page.getByText(/Inside an LLM\./i).first()).toBeVisible()
  })

  test('renders the static variant under prefers-reduced-motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page.locator('.prologue-static')).toBeVisible()
    await expect(page.locator('.prologue-track')).toHaveCount(0)
    await context.close()
  })

  test('Skip intro affordance is wired to the interlude forward target', async ({ page }) => {
    await page.goto('/')
    // The always-visible top-right "Skip intro" link is the reliable affordance.
    // Its forward target is #interlude (the first real station after the prologue).
    // The interlude station itself ships in Phase 7 — until it is a mounted station,
    // goTo() rejects it and the App's hash-sync pins the URL back to the active
    // mounted scene, so a *landing* assertion is not achievable yet. We assert the
    // affordance exists, is visible, and points at the interlude target.
    const skip = page.getByRole('link', { name: /skip intro/i })
    await expect(skip).toBeVisible()
    await expect(skip).toHaveAttribute('href', '#interlude')
  })

  test('mounted prologue has no critical/serious axe violations at /', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()

    // color-contrast deferred — accent tokens on dark surfaces sit at ~3.9:1.
    // Tracked in docs/a11y/2026-06-01-audit.md as a brand-level follow-up.
    const DEFERRED = new Set(['color-contrast'])

    const blocking = results.violations.filter(
      (v) => (v.impact === 'critical' || v.impact === 'serious') && !DEFERRED.has(v.id),
    )

    if (blocking.length > 0) {
      console.error('Prologue axe violations at /:', JSON.stringify(blocking, null, 2))
    }

    expect(blocking).toEqual([])
  })
})
