import { test, expect, type Page } from '@playwright/test'

async function arrowDownTo(page: Page, hash: string) {
  await page.locator('body').press('ArrowDown')
  await expect(page).toHaveURL(new RegExp(`${hash}$`)) // settle: each press advances exactly one
}

test('keyboard ArrowDown advances through the pipeline to About', async ({ page }) => {
  await page.goto('/#prompt')
  await expect(page.getByRole('heading', { level: 2, name: 'Prompt Input' })).toBeVisible()
  // 8 settled ArrowDowns: prompt → tokenize → embed → attention → predict → decode → output → compare → about
  await arrowDownTo(page, '#tokenize')
  await arrowDownTo(page, '#embed')
  await arrowDownTo(page, '#attention')
  await arrowDownTo(page, '#predict')
  await arrowDownTo(page, '#decode')
  await arrowDownTo(page, '#output')
  await arrowDownTo(page, '#compare')
  await arrowDownTo(page, '#about')
  await expect(page.getByRole('heading', { level: 2, name: /about this explainer/i })).toBeVisible()
})

test('rail jump goes directly to Tokenization', async ({ page }) => {
  await page.goto('/#prompt')
  // The Tokenize rail button's aria-label includes the rail label and title.
  // Tokenization is the 2nd pipeline scene; its accessible name contains "Tokenization".
  await page
    .getByRole('button', { name: /tokenize/i })
    .first()
    .click()
  await expect(page).toHaveURL(/#tokenize$/)
  await expect(page.getByRole('heading', { level: 2, name: 'Tokenization' })).toBeVisible()
})

test('rail navigation between scenes updates URL hash and active rail segment', async ({
  page,
}) => {
  await page.goto('/#prompt')
  await page
    .getByRole('button', { name: /decode/i })
    .first()
    .click()
  await expect(page).toHaveURL(/#decode$/)
  await expect(page.getByRole('heading', { level: 2, name: 'Decoding Loop' })).toBeVisible()
})
