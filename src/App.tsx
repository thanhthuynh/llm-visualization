import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from 'react'
import { useTrackSceneReach } from '@/analytics/useTrackSceneReach'
import { AtlasNavProvider, type AtlasNav } from '@/app/AtlasNav'
import { scrollToScene } from '@/app/scrollToScene'
import { useAtlasEntrance } from '@/motion/useAtlasEntrance'
import { useHashSync, parseSectionHash, SECTION_JUMP_EVENT } from '@/app/useHashSync'
import { useKeyboardNav } from '@/app/useKeyboardNav'
import { useScaleToFit } from '@/app/useScaleToFit'
import { useScrollSpy } from '@/app/useScrollSpy'
import { AtlasHeader } from '@/components/AtlasHeader'
import { AtlasSection } from '@/components/AtlasSection'
import { StationRail } from '@/components/StationRail'
import { VolumeDivider } from '@/components/VolumeDivider'
import {
  SECTIONS,
  SECTION_IDS,
  VOLUME_DIVIDERS,
  isSectionId,
  type SectionId,
} from '@/plates/plates.config'
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

function readInitialSection(): SectionId {
  if (typeof window === 'undefined') return 'home'
  const raw = parseSectionHash(window.location.hash)
  return isSectionId(raw) ? raw : 'home'
}

/**
 * The Atlas — one continuously scrollable page. All screens render on a fixed
 * 1280px design canvas scaled to the viewport; a sticky header and a fixed
 * station rail (≥1100px) track the scroll-spy-active section, mirrored to the
 * URL as `#/{id}`.
 */
export function Site() {
  const [activeId, setActiveId] = useState<SectionId>(readInitialSection)
  const stageRef = useRef<HTMLDivElement>(null)
  useScaleToFit(stageRef)
  useHashSync(activeId)
  useTrackSceneReach(activeId)
  useAtlasEntrance()

  const go = useCallback((id: SectionId) => {
    setActiveId(id)
    scrollToScene(id, { smooth: true })
  }, [])

  // Honor an incoming deep-link once, after first paint has laid the page out.
  useEffect(() => {
    const initial = readInitialSection()
    if (initial === 'home') return undefined
    const timer = window.setTimeout(() => scrollToScene(initial), 150)
    return () => window.clearTimeout(timer)
  }, [])

  // External hash changes (URL edits, back/forward) re-enter through go().
  useEffect(() => {
    function handle(e: globalThis.Event) {
      const id = (e as globalThis.CustomEvent<{ id: string }>).detail.id
      if (isSectionId(id)) go(id)
    }
    window.addEventListener(SECTION_JUMP_EVENT, handle as globalThis.EventListener)
    return () => window.removeEventListener(SECTION_JUMP_EVENT, handle as globalThis.EventListener)
  }, [go])

  const idx = SECTION_IDS.indexOf(activeId)
  useKeyboardNav({
    onPrev: () => {
      const prev = SECTION_IDS[idx - 1]
      if (idx > 0 && prev) go(prev)
    },
    onNext: () => {
      const next = SECTION_IDS[idx + 1]
      if (idx < SECTION_IDS.length - 1 && next) go(next)
    },
  })

  const handleActiveChange = useCallback((id: string) => {
    if (isSectionId(id)) setActiveId(id)
  }, [])
  useScrollSpy({ ids: SECTION_IDS, onActiveChange: handleActiveChange })

  const nav = useMemo<AtlasNav>(() => ({ active: activeId, go }), [activeId, go])

  return (
    <AtlasNavProvider value={nav}>
      <div className="flex min-h-screen items-start justify-center px-[24px] pb-[140px]">
        <a className="skip-link" href="#/home">
          Skip to content
        </a>
        <StationRail />
        <div ref={stageRef} data-atlas-stage className="w-[1280px]">
          <AtlasHeader />
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
    </AtlasNavProvider>
  )
}
