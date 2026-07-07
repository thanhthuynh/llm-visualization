import { test, expect } from '@playwright/test'

test.describe('navigation shell', () => {
  test('rail click smooth-scrolls to the station and lights it up', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('nav[aria-label="Stations"] a[data-route="plate-iii"]')
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#/plate-iii')
    const railItem = page.locator('nav[aria-label="Stations"] a[data-route="plate-iii"]')
    await expect(railItem).toHaveAttribute('aria-current', 'true')
  })

  test('keyboard pages with arrows and j/k', async ({ page }) => {
    // Reduced motion → instant jumps; rapid keypresses can't race a smooth
    // scroll (mid-flight the midpoint spy legitimately re-asserts neighbors).
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.keyboard.press('j')
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#/plate-i')
    await page.keyboard.press('ArrowRight')
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#/plate-ii')
    await page.keyboard.press('k')
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#/plate-i')
    await page.keyboard.press('ArrowLeft')
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#/home')
  })

  test('header nav routes and tracks the active group', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const nav = page.getByRole('navigation', { name: 'Primary' })
    await expect(nav.getByText('CHARTS')).toHaveAttribute('aria-current', 'true')
    await nav.getByText('GLOSSARY').click()
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#/gazetteer')
    await expect(nav.getByText('GLOSSARY')).toHaveAttribute('aria-current', 'true')
    await nav.getByText('ABOUT').click()
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#/about')
  })

  test('deep link lands the section under the header on a fresh load', async ({ page }) => {
    await page.goto('/#/plate-vi')
    await page.waitForLoadState('networkidle')
    await expect
      .poll(() =>
        page.evaluate(() => {
          const el = document.getElementById('plate-vi')
          return el ? Math.round(el.getBoundingClientRect().top) : 9999
        }),
      )
      .toBeLessThan(150)
  })

  test('the station rail hides below 1100px viewports', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 })
    await page.goto('/')
    await expect(page.locator('nav[aria-label="Stations"]')).toBeHidden()
    await page.setViewportSize({ width: 1280, height: 800 })
    await expect(page.locator('nav[aria-label="Stations"]')).toBeVisible()
  })
})
