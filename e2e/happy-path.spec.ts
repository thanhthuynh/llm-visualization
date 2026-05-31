import { test, expect } from '@playwright/test'

test('loads PredictScene, toggles Deep, jumps to About', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Inside an LLM').first()).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Next-Token Prediction' })).toBeVisible()

  const blueBar = page.getByRole('progressbar', { name: 'blue' })
  await expect(blueBar).toHaveAttribute('aria-valuenow', '71')

  await page.getByRole('button', { name: /go deeper/i }).click()
  await expect(page.getByRole('note')).toContainText(/illustrative|gpt-2/i)
  await expect(page.getByText('softmax')).toBeVisible()

  await page.getByLabel('Temperature').fill('0.2')
  const cooled = await blueBar.getAttribute('aria-valuenow')
  expect(Number(cooled)).toBeGreaterThan(71)

  await page.getByRole('button', { name: 'About' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /about/i })).toBeVisible()
  await expect(page).toHaveURL(/#about$/)
})

test('keyboard nav advances from Predict to About', async ({ page }) => {
  await page.goto('/')
  await page.locator('body').press('ArrowDown')
  await expect(page).toHaveURL(/#about$/)
})

test('skip link is the first focusable element', async ({ page }) => {
  await page.goto('/')
  await page.locator('body').press('Tab')
  await expect(page.locator(':focus')).toHaveText(/skip to content/i)
})
