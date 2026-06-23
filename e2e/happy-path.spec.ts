import { test, expect } from '@playwright/test'

test('loads PredictScene, toggles Deep, jumps to About', async ({ page }) => {
  await page.goto('/explorer#prompt')
  await expect(page.getByText('Inside an LLM').first()).toBeVisible()

  // Navigate to Predict scene via the rail (default scene is now Prompt).
  await page
    .getByRole('button', { name: /predict/i })
    .first()
    .click()
  await expect(page.getByRole('heading', { level: 2, name: 'Next-Token Prediction' })).toBeVisible()

  const blueBar = page.getByRole('progressbar', { name: 'blue' })
  await expect(blueBar).toHaveAttribute('aria-valuenow', '71')

  await page
    .getByLabel('Next-Token Prediction', { exact: true })
    .getByRole('button', { name: /go deeper/i })
    .click()
  await expect(
    page.getByLabel('Next-Token Prediction', { exact: true }).getByRole('note'),
  ).toContainText(/illustrative|gpt-2/i)
  await expect(page.getByText('softmax')).toBeVisible()

  await page.getByLabel('Temperature').fill('0.2')
  const cooled = await blueBar.getAttribute('aria-valuenow')
  expect(Number(cooled)).toBeGreaterThan(71)

  await page.getByRole('button', { name: 'About' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /about/i })).toBeVisible()
  await expect(page).toHaveURL(/#about$/)
})

test('keyboard nav advances scene-by-scene', async ({ page }) => {
  await page.goto('/explorer#prompt')
  // Default is Prompt; one ArrowDown should land on Tokenize.
  await page.locator('body').press('ArrowDown')
  await expect(page).toHaveURL(/#tokenize$/)
})

test('skip link is the first focusable element', async ({ page }) => {
  // This test asserts the top-of-page skip affordance; a fresh (hash-less) entry
  // now lands on the prologue at scroll-top, where the skip link is first-focusable.
  // (A station deep-link scrolls the page, moving Chromium's focus start point.)
  await page.goto('/explorer')
  await page.locator('body').press('Tab')
  await expect(page.locator(':focus')).toHaveText(/skip to content/i)
})
