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

test('RagScene deep-links and surface+Deep toggle works', async ({ page }) => {
  await page.goto('/explorer#rag')
  await expect(page.getByRole('heading', { level: 2, name: /retrieval \(rag\)/i })).toBeVisible()
  const ragSection = page.getByLabel('Retrieval (RAG)', { exact: true })
  await expect(ragSection.getByText(/retrieval step searches/i)).toBeVisible()
  await ragSection.getByRole('button', { name: /go deeper/i }).click()
  await expect(ragSection.getByText(/toy retrieval over five sentences/i)).toBeVisible()
})

test('HallucinateScene deep-links and surface+Deep toggle works', async ({ page }) => {
  await page.goto('/explorer#hallucinate')
  await expect(page.getByRole('heading', { level: 2, name: /hallucination/i })).toBeVisible()
  const halluSection = page.getByLabel('Hallucination', { exact: true })
  await expect(halluSection.getByText(/plausible-sounding text/i)).toBeVisible()
  await halluSection.getByRole('button', { name: /go deeper/i }).click()
  await expect(halluSection.getByText(/court filing.*cases that never existed/i)).toBeVisible()
})
