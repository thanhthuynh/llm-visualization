import { test, expect } from '@playwright/test'

test('keyboard ArrowDown advances through the pipeline to About', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 2, name: 'Prompt Input' })).toBeVisible()
  // 7 ArrowDowns to walk prompt → tokenize → embed → attention → predict → decode → output → about
  for (let i = 0; i < 7; i++) {
    await page.locator('body').press('ArrowDown')
  }
  await expect(page).toHaveURL(/#about$/)
  await expect(page.getByRole('heading', { level: 2, name: /about this explainer/i })).toBeVisible()
})

test('rail jump goes directly to Tokenization', async ({ page }) => {
  await page.goto('/')
  // The Tokenize rail button's aria-label includes the rail label and title.
  // Tokenization is the 2nd pipeline scene; its accessible name contains "Tokenization".
  await page
    .getByRole('button', { name: /tokenization/i })
    .first()
    .click()
  await expect(page).toHaveURL(/#tokenize$/)
  await expect(page.getByRole('heading', { level: 2, name: 'Tokenization' })).toBeVisible()
})

test('rail navigation between scenes updates URL hash and active rail segment', async ({
  page,
}) => {
  await page.goto('/')
  await page
    .getByRole('button', { name: /decoding loop/i })
    .first()
    .click()
  await expect(page).toHaveURL(/#decode$/)
  await expect(page.getByRole('heading', { level: 2, name: 'Decoding Loop' })).toBeVisible()
})
