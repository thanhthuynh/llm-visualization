import { Fragment, type ComponentType } from 'react'
import { AtlasSection } from '@/components/AtlasSection'
import { VolumeDivider } from '@/components/VolumeDivider'
import { SECTIONS, VOLUME_DIVIDERS, type SectionId } from '@/plates/plates.config'
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

const SECTION_COMPONENTS: Record<SectionId, ComponentType> = {
  home: HomePlate,
  'plate-i': PlateI,
  'plate-ii': PlateII,
  'plate-iii': PlateIII,
  'plate-iv': PlateIV,
  'plate-iv-detail': PlateIVDetail,
  'plate-v': PlateV,
  'plate-vi': PlateVI,
  'plate-vii': PlateVII,
  gazetteer: GazetteerPlate,
  about: ColophonPlate,
}

/**
 * The Atlas — one continuously scrollable page. All screens render on a fixed
 * 1280px design canvas; the stage is scaled to the viewport (M1 fit hook).
 * Sections stack in a 36px-gap column with volume dividers between groups.
 */
export function Site() {
  return (
    <div className="flex min-h-screen items-start justify-center px-[24px] pb-[140px]">
      <a className="skip-link" href="#/home">
        Skip to content
      </a>
      <div data-atlas-stage className="w-[1280px] origin-top">
        {/* Sticky header mounts here in M1 */}
        <main
          aria-label="The Atlas — chart plates"
          className="relative flex w-[1280px] flex-col gap-[36px] pt-[28px]"
        >
          {SECTIONS.map(({ id, title }) => {
            const divider = VOLUME_DIVIDERS.find((d) => d.before === id)
            const Plate = SECTION_COMPONENTS[id]
            return (
              <Fragment key={id}>
                {divider && <VolumeDivider label={divider.label} />}
                <AtlasSection id={id} title={title}>
                  <Plate />
                </AtlasSection>
              </Fragment>
            )
          })}
        </main>
      </div>
    </div>
  )
}
