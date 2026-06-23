import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const SCENE_IDS = [
  'prompt',
  'tokenize',
  'embed',
  'attention',
  'predict',
  'decode',
  'output',
  'compare',
  'about',
] as const

test.describe('a11y — full pipeline', () => {
  for (const id of SCENE_IDS) {
    test(`${id} scene has no critical/serious axe violations`, async ({ page }) => {
      await page.goto(`/explorer#${id}`)
      await page.waitForLoadState('networkidle')

      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()

      // color-contrast deferred — accent tokens on dark surfaces sit at ~3.9:1.
      // Tracked in docs/a11y/2026-06-01-audit.md as a brand-level follow-up.
      const DEFERRED = new Set(['color-contrast'])

      const blocking = results.violations.filter(
        (v) => (v.impact === 'critical' || v.impact === 'serious') && !DEFERRED.has(v.id),
      )

      const deferred = results.violations.filter((v) => DEFERRED.has(v.id))

      if (blocking.length > 0) {
        console.error(`Violations in ${id}:`, JSON.stringify(blocking, null, 2))
      }
      if (deferred.length > 0) {
        console.warn(
          `[deferred] ${id} has ${deferred.length} ${[...DEFERRED].join('/')} violation(s) — see audit doc`,
        )
      }

      expect(blocking).toEqual([])
    })
  }
})
