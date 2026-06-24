import { test, expect } from '@playwright/test'

test('Compare rail jump shows Claude vs ChatGPT framing + tier badges + caveat', async ({
  page,
}) => {
  await page.goto('/explorer#prompt')

  await page.goto('/explorer#compare')
  await expect(page).toHaveURL(/#compare$/)

  await expect(page.getByRole('heading', { level: 2, name: /claude vs chatgpt/i })).toBeVisible()

  await expect(page.getByText(/more alike than different/i)).toBeVisible()

  const tierA = page.locator('[data-tier="a"]')
  await expect(tierA.first()).toBeVisible()

  await page
    .locator('section#compare')
    .getByRole('button', { name: /go deeper/i })
    .first()
    .click()
  await expect(page.getByRole('note').first()).toContainText(/tier|age|change|volatile|month/i)
  await expect(page.getByText(/last updated/i)).toBeVisible()
})

test('keyboard ArrowDown reaches Compare after the 9 pipeline scenes', async ({ page }) => {
  await page.goto('/explorer#prompt')
  for (let i = 0; i < 9; i++) {
    await page.locator('body').press('ArrowDown')
  }
  await expect(page).toHaveURL(/#compare$/)
})
