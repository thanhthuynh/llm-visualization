import { test, expect } from '@playwright/test'

test('WindowScene deep-links and surface+Deep toggle works', async ({ page }) => {
  await page.goto('/explorer#window')
  await expect(page.getByRole('heading', { level: 2, name: /context window/i })).toBeVisible()
  const windowSection = page.getByLabel('Context Window', { exact: true })
  await expect(windowSection.getByText(/fixed budget of tokens/i)).toBeVisible()
  await windowSection.getByRole('button', { name: /go deeper/i }).click()
  await expect(windowSection.getByText(/oldest tokens are simply gone/i)).toBeVisible()
})

test('SystemScene deep-links and surface+Deep toggle works', async ({ page }) => {
  await page.goto('/explorer#system')
  await expect(page.getByRole('heading', { level: 2, name: /the system prompt/i })).toBeVisible()
  const systemSection = page.getByLabel('The System Prompt', { exact: true })
  await expect(systemSection.getByText(/before your first word/i)).toBeVisible()
  await systemSection.getByRole('button', { name: /go deeper/i }).click()
  await expect(systemSection.getByRole('note')).toBeVisible()
})
