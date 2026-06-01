import { test, expect } from '@playwright/test'

test('temperature slider reshapes the live distribution in DecodeScene', async ({ page }) => {
  await page.goto('/explorer')
  await page
    .getByRole('button', { name: /decoding loop/i })
    .first()
    .click()
  await expect(page.getByRole('heading', { level: 2, name: 'Decoding Loop' })).toBeVisible()

  const decode = page.getByLabel('Decoding Loop', { exact: true })
  await decode.getByRole('button', { name: /go deeper/i }).click()

  await expect(decode.getByText(/BASELINE/i)).toBeVisible()
  await expect(decode.getByText(/BALANCED/i)).toBeVisible()

  await decode.locator('#decode-temperature').fill('0.2')

  await expect(decode.getByText(/PEAKED/i)).toBeVisible()
  await expect(decode.getByText(/BALANCED/i)).not.toBeVisible()

  const blueBars = decode.getByRole('progressbar', { name: 'blue' })
  const values = await blueBars.evaluateAll((els) =>
    els.map((el) => Number(el.getAttribute('aria-valuenow') ?? 0)),
  )
  expect(Math.max(...values)).toBeGreaterThanOrEqual(95)

  await decode.locator('#decode-temperature').fill('1.8')
  await expect(decode.getByText(/FLATTER/i)).toBeVisible()
})
