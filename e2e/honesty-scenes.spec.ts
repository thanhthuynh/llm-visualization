import { test, expect } from '@playwright/test'

test('AttentionScene shows the surface Simplified note and TWO caveats in deep', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: /attention/i }).first().click()
  await expect(page).toHaveURL(/#attention$/)

  const attentionSection = page.getByLabel('Attention', { exact: true })

  await expect(attentionSection.getByText(/simplified.*go deeper/i)).toBeVisible()

  await attentionSection.getByRole('button', { name: /go deeper/i }).click()

  const notes = attentionSection.getByRole('note')
  await expect(notes).toHaveCount(2)

  await expect(attentionSection.getByRole('button', { name: /head 1/i })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await attentionSection.getByRole('button', { name: /head 2/i }).click()
  await expect(attentionSection.getByRole('button', { name: /head 2/i })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

test('EmbedScene shows the meaning-space and a CaveatNote in Deep', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /embeddings/i }).first().click()
  await expect(page).toHaveURL(/#embed$/)

  const embedSection = page.getByLabel('Embeddings', { exact: true })

  await expect(embedSection.locator('[data-testid="embedding-dot-sky"]').first()).toBeVisible()

  await embedSection.getByRole('button', { name: /go deeper/i }).click()
  await expect(embedSection.getByRole('note').first()).toContainText(
    /king.*man.*woman|word2vec|older idea/i,
  )
})
