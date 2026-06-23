import { test, expect } from '@playwright/test'

test('INTRO tick is visible and active on the root page', async ({ page }) => {
  await page.goto('/explorer')
  const intro = page.getByRole('button', { name: /^intro$/i })
  await expect(intro).toBeVisible()
  await expect(intro).toHaveAttribute('aria-current', 'step')
})

test('Part-2 → Compare rail jump updates the URL hash', async ({ page }) => {
  await page.goto('/explorer#prompt')
  await page
    .getByRole('button', { name: /^compare$/i })
    .first()
    .click()
  await expect(page).toHaveURL(/#compare$/)
})

test('Part-2 → About rail jump updates the URL hash', async ({ page }) => {
  await page.goto('/explorer#prompt')
  await page
    .getByRole('button', { name: /^about$/i })
    .first()
    .click()
  await expect(page).toHaveURL(/#about$/)
})
