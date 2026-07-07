import { test, expect } from '@playwright/test'

/**
 * The one-scroll happy path: land on home, walk the whole atlas, use the
 * reference cross-links. Section ids double as hash slugs (#/{id}).
 */
test.describe('happy path', () => {
  test('lands on the hero with header and rail', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /An atlas of/ })).toBeVisible()
    await expect(page.getByRole('banner').getByText('The Atlas')).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Stations' })).toBeVisible()
    await expect(
      page.getByRole('navigation', { name: 'Primary' }).getByText('CHARTS'),
    ).toBeVisible()
  })

  test('every section is reachable by scrolling and updates the hash', async ({ page }) => {
    await page.goto('/')
    const ids = [
      'home',
      'plate-i',
      'plate-ii',
      'plate-iii',
      'plate-iv',
      'plate-iv-detail',
      'plate-v',
      'plate-vi',
      'plate-vii',
      'gazetteer',
      'about',
    ]
    for (const id of ids) {
      await page.evaluate((sectionId) => {
        const el = document.getElementById(sectionId)
        if (!el) throw new Error(`missing section ${sectionId}`)
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60 })
      }, id)
      await page.waitForTimeout(150)
      await expect.poll(() => page.evaluate(() => window.location.hash)).toBe(`#/${id}`)
    }
  })

  test('gazetteer entries cross-link to their plates', async ({ page }) => {
    await page.goto('/#/gazetteer')
    await page.waitForLoadState('networkidle')
    const entry = page.locator('#gazetteer a[data-route="plate-v"]').first()
    await entry.click()
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#/plate-v')
    await expect
      .poll(() =>
        page.evaluate(() => {
          const el = document.getElementById('plate-v')
          return el ? Math.abs(el.getBoundingClientRect().top) < 200 : false
        }),
      )
      .toBe(true)
  })

  test('hero map stations route to plates', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.locator('#home a[data-route="plate-iv"]').first().click()
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#/plate-iv')
  })
})
