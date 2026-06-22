import { test, expect } from '@playwright/test'

test('scrolling the document updates the left-rail active indicator', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 2, name: 'Prompt Input' })).toBeVisible()

  // Confirm .stations is present (CSS role changed but class is still in DOM)
  await page.locator('.stations').waitFor()

  // Scroll the document (not a nested scroller) to bring #tokenize into view
  await page.evaluate(() => {
    document.getElementById('tokenize')?.scrollIntoView({ behavior: 'instant' })
  })

  await expect
    .poll(async () => {
      return page.url()
    })
    .toContain('#tokenize')

  const railTokenize = page.getByRole('button', { name: /tokeniz/i }).first()
  await expect(railTokenize).toHaveAttribute('aria-current', 'step')
})
