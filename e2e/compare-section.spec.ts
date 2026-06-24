import { test, expect, type Page } from '@playwright/test'

async function arrowDownTo(page: Page, hash: string) {
  await page.locator('body').press('ArrowDown')
  await expect(page).toHaveURL(new RegExp(`${hash}$`)) // settle: each press advances exactly one
}

test('Compare rail jump shows Claude vs ChatGPT framing + tier badges + caveat', async ({
  page,
}) => {
  await page.goto('/#compare')
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

test('keyboard ArrowDown reaches Compare after the 7 Part-2 pipeline scenes (tokenize→output)', async ({
  page,
}) => {
  await page.goto('/#prompt')
  // prompt → tokenize → embed → attention → predict → decode → output → compare (7 steps)
  await arrowDownTo(page, '#tokenize')
  await arrowDownTo(page, '#embed')
  await arrowDownTo(page, '#attention')
  await arrowDownTo(page, '#predict')
  await arrowDownTo(page, '#decode')
  await arrowDownTo(page, '#output')
  await arrowDownTo(page, '#compare')
})
