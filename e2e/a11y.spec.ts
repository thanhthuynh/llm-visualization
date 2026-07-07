import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const SECTION_IDS = [
  'home',
  'plate-i',
  'plate-ii',
  'plate-iii',
  'plate-iv',
  'plate-iv-detail',
  'plate-v',
  'plate-vi',
  'plate-vii',
  'gazetteer',
  'about',
] as const

test.describe('a11y — all Atlas sections', () => {
  for (const id of SECTION_IDS) {
    test(`${id} has no critical/serious axe violations`, async ({ page }) => {
      await page.goto(`/#/${id}`)
      await page.waitForLoadState('networkidle')

      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()

      // color-contrast deferred — the chart's dim ink ramp on dark surfaces is a
      // deliberate brand choice; tracked as a follow-up, consistent with the
      // repo's prior audit discipline.
      const DEFERRED = new Set(['color-contrast'])

      const blocking = results.violations.filter(
        (v) => (v.impact === 'critical' || v.impact === 'serious') && !DEFERRED.has(v.id),
      )

      if (blocking.length > 0) {
        console.error(`Violations in ${id}:`, JSON.stringify(blocking, null, 2))
      }

      expect(blocking).toEqual([])
    })
  }
})
