import { test, expect } from '@playwright/test'

test('scrolling the stations container updates the left-rail active indicator', async ({
  page,
}) => {
  await page.goto('/explorer')
  await expect(page.getByRole('heading', { level: 2, name: 'Prompt Input' })).toBeVisible()

  const stations = page.locator('.stations')
  await stations.waitFor()

  await page.locator('#tokenize').scrollIntoViewIfNeeded()

  await expect
    .poll(async () => {
      const url = page.url()
      return url.includes('#tokenize')
    })
    .toBe(true)

  const railTokenize = page.getByRole('button', { name: /tokeniz/i }).first()
  await expect(railTokenize).toHaveAttribute('aria-current', 'step')
})
