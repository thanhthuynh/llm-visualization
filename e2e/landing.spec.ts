import { test, expect } from '@playwright/test'

// TODO(Phase 4): replace with prologue.spec — landing page removed in the route collapse.
// The / route now serves the station shell directly (Task 1.1). The prologue that
// replaces this landing page lands in Phase 4; this spec will be rewritten then.
test.describe.skip('Landing page', () => {
  test('renders the hero H1 + provenance + CTA at /', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: /Inside an LLM/i })).toBeVisible()
    await expect(
      page.getByText(
        /Numbers from GPT-2 small, run offline\. Illustrative, not Claude or ChatGPT/i,
      ),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /Start with the prompt/i })).toBeVisible()
  })

  test('hero CTA navigates to /explorer#prompt and mounts the explainer', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Start with the prompt/i }).click()
    await expect(page).toHaveURL(/\/explorer#prompt$/)
    // ProgressRail rail buttons confirm the explainer mounted at the prompt scene.
    await expect(page.getByRole('button', { name: /prompt/i }).first()).toBeVisible()
  })

  test('all 7 scene cards link to /explorer#<scene>', async ({ page }) => {
    await page.goto('/')
    const scenes = ['prompt', 'tokenize', 'embed', 'attention', 'predict', 'decode', 'output']
    for (const scene of scenes) {
      const card = page.locator(`a[href="/explorer#${scene}"]`).first()
      await expect(card).toBeVisible()
    }
  })

  test('clicking each scene card opens the explorer on that scene', async ({ page }) => {
    const scenes = [
      ['prompt', 'Prompt Input'],
      ['tokenize', 'Tokenization'],
      ['embed', 'Embeddings'],
      ['attention', 'Attention'],
      ['predict', 'Next-Token Prediction'],
      ['decode', 'Decoding Loop'],
      ['output', 'Output Assembly'],
    ] as const
    for (const [id, title] of scenes) {
      await page.goto('/')
      await page.locator(`a[href="/explorer#${id}"]`).first().click()
      await expect(page).toHaveURL(new RegExp(`/explorer#${id}$`))
      const rail = page.getByRole('navigation', { name: /scenes/i })
      await expect(rail.getByRole('button', { name: new RegExp(title, 'i') })).toHaveAttribute(
        'aria-current',
        'step',
      )
    }
  })

  test('Surface ↔ Deep toggle flips selection', async ({ page }) => {
    await page.goto('/')
    const deepBtn = page.getByRole('button', { name: /^Deep$/ })
    await deepBtn.scrollIntoViewIfNeeded()
    await deepBtn.click()
    await expect(deepBtn).toHaveAttribute('aria-pressed', 'true')
  })

  test('provenance section shows the build-time commit SHA', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { level: 2, name: /Where the numbers come from/i }),
    ).toBeVisible()
    // 7-char commit (vite injects), or 'unknown' in environments without git.
    await expect(page.getByText(/commit\s+[a-f0-9]{7}|commit\s+unknown/i)).toBeVisible()
  })
})
