import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import type { ComponentType } from 'react'
import { AtlasNavProvider } from '@/app/AtlasNav'
import type { SectionId } from '@/plates/plates.config'
import { HomePlate } from '@/plates/HomePlate'
import { PlateI } from '@/plates/PlateI'
import { PlateII } from '@/plates/PlateII'
import { PlateIII } from '@/plates/PlateIII'
import { PlateIV } from '@/plates/PlateIV'
import { PlateIVDetail } from '@/plates/PlateIVDetail'
import { PlateV } from '@/plates/PlateV'
import { PlateVI } from '@/plates/PlateVI'
import { PlateVII } from '@/plates/PlateVII'
import { GazetteerPlate } from '@/plates/Gazetteer'
import { ColophonPlate } from '@/plates/Colophon'

const PLATES: ReadonlyArray<[SectionId, ComponentType]> = [
  ['home', HomePlate],
  ['plate-i', PlateI],
  ['plate-ii', PlateII],
  ['plate-iii', PlateIII],
  ['plate-iv', PlateIV],
  ['plate-iv-detail', PlateIVDetail],
  ['plate-v', PlateV],
  ['plate-vi', PlateVI],
  ['plate-vii', PlateVII],
  ['gazetteer', GazetteerPlate],
  ['about', ColophonPlate],
]

describe('per-plate a11y', () => {
  for (const [id, Plate] of PLATES) {
    it(`${id} has no axe violations (color-contrast deferred)`, async () => {
      const { container } = render(
        <AtlasNavProvider value={{ active: 'home', go: vi.fn() }}>
          <Plate />
        </AtlasNavProvider>,
      )

      const results = await axe(container, {
        rules: { 'color-contrast': { enabled: false } },
      })

      expect(results).toHaveNoViolations()
    })
  }
})
