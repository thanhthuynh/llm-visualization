import { test, expect } from '@playwright/test'

test('INTRO tick is visible and active on the root page', async ({ page }) => {
  await page.goto('/')
  const intro = page.getByRole('button', { name: /^intro$/i })
  await expect(intro).toBeVisible()
  await expect(intro).toHaveAttribute('aria-current', 'step')
})

test('Part-2 → Compare rail jump updates the URL hash', async ({ page }) => {
  await page.goto('/#prompt')
  const rail = page.getByRole('navigation', { name: /scenes/i })
  const compareBtn = rail.getByRole('button', { name: /^compare$/i })
  await compareBtn.scrollIntoViewIfNeeded()
  await compareBtn.click()
  await expect(page).toHaveURL(/#compare$/)
  await expect(compareBtn).toHaveAttribute('aria-current', 'step')
})

test('Part-2 → About rail jump updates the URL hash', async ({ page }) => {
  await page.goto('/#prompt')
  const rail = page.getByRole('navigation', { name: /scenes/i })
  const aboutBtn = rail.getByRole('button', { name: /^about$/i })
  await aboutBtn.scrollIntoViewIfNeeded()
  await aboutBtn.click()
  await expect(page).toHaveURL(/#about$/)
  await expect(aboutBtn).toHaveAttribute('aria-current', 'step')
})

test('About rail button is reachable and clickable at the default viewport (720 px height)', async ({
  page,
}) => {
  // Confirm the About button — the bottom-most rail station — is reachable
  // at the default Playwright viewport (1280×720) without deep-linking.
  await page.goto('/#prompt')
  const rail = page.getByRole('navigation', { name: /scenes/i })
  const aboutBtn = rail.getByRole('button', { name: /^about$/i })

  // Scroll it into view inside the internally-scrollable rail container,
  // then confirm it is actually clickable (not clipped off-screen).
  await aboutBtn.scrollIntoViewIfNeeded()
  await expect(aboutBtn).toBeVisible()
  await aboutBtn.click()
  await expect(page).toHaveURL(/#about$/)
})
