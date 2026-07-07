import { test, expect } from '@playwright/test'

/**
 * Plate IV·Detail interactive controls: temperature/top-p sliders and the
 * SAMPLING/GREEDY toggle live-recompute the prediction + sampling cards.
 * All displayed numbers are illustrative (fixed candidate logits).
 */
test.describe('plate IV·Detail decode controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/plate-iv-detail')
    await page.waitForLoadState('networkidle')
  })

  test('defaults: sampling at T 0.70, top-p 0.95, "A" drawn first', async ({ page }) => {
    const section = page.locator('#plate-iv-detail')
    await expect(section.getByText('T = 0.70')).toBeVisible()
    await expect(section.getByText(/drawn: "A"/)).toBeVisible()
    await expect(section.getByText(/tokens in nucleus \(top-p\)/).first()).toBeVisible()
  })

  test('greedy decode collapses the nucleus to one token', async ({ page }) => {
    const section = page.locator('#plate-iv-detail')
    await section.getByText('GREEDY', { exact: true }).click()
    await expect(section.getByText(/1 token · greedy decode/).first()).toBeVisible()
    await expect(section.getByText('GREEDY · argmax')).toBeVisible()
  })

  test('low temperature sharpens the distribution toward "A"', async ({ page }) => {
    const section = page.locator('#plate-iv-detail')
    const slider = section.getByLabel('Temperature')
    await slider.fill('0')
    await expect(section.getByText('T = 0.05')).toBeVisible()
    await expect(section.getByText('1.00', { exact: true }).first()).toBeVisible()
  })

  test('tight top-p shrinks the nucleus', async ({ page }) => {
    const section = page.locator('#plate-iv-detail')
    const slider = section.getByLabel('Top-p')
    await slider.fill('0.1')
    await expect(section.getByText(/1 tokens? in nucleus \(top-p\)/).first()).toBeVisible()
  })
})
