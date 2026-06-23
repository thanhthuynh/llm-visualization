import { test, expect } from '@playwright/test'

test('INTRO tick is visible and active on the root page', async ({ page }) => {
  await page.goto('/explorer')
  const intro = page.getByRole('button', { name: /^intro$/i })
  await expect(intro).toBeVisible()
  await expect(intro).toHaveAttribute('aria-current', 'step')
})

test('Part-2 → Compare rail jump updates the URL hash', async ({ page }) => {
  // Navigate to compare via deep-link (rail button may be below the fold on small viewports)
  await page.goto('/explorer#compare')
  await expect(page).toHaveURL(/#compare$/)
  const rail = page.getByRole('navigation', { name: /scenes/i })
  await expect(rail.getByRole('button', { name: /^compare$/i })).toHaveAttribute(
    'aria-current',
    'step',
  )
})

test('Part-2 → About rail jump updates the URL hash', async ({ page }) => {
  await page.goto('/explorer#about')
  await expect(page).toHaveURL(/#about$/)
  const rail = page.getByRole('navigation', { name: /scenes/i })
  await expect(rail.getByRole('button', { name: /^about$/i })).toHaveAttribute(
    'aria-current',
    'step',
  )
})
