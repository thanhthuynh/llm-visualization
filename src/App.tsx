import { useCallback, useEffect, useLayoutEffect, useState, type ComponentType } from 'react'
import { DepthProvider, useDepth } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'
import { SceneNavProvider } from '@/app/SceneNavContext'
import { useHashSync, SCENE_JUMP_EVENT } from '@/app/useHashSync'
import { useKeyboardNav } from '@/app/useKeyboardNav'
import { useScrollSpy } from '@/app/useScrollSpy'
import { useTrackSceneReach } from '@/analytics/useTrackSceneReach'
import { ProgressRail } from '@/components/ProgressRail'
import { TopBar } from '@/components/TopBar'
import { PromptScene } from '@/scenes/PromptScene'
import { TokenizeScene } from '@/scenes/TokenizeScene'
import { EmbedScene } from '@/scenes/EmbedScene'
import { AttentionScene } from '@/scenes/AttentionScene'
import { PredictScene } from '@/scenes/PredictScene'
import { DecodeScene } from '@/scenes/DecodeScene'
import { AssembleScene } from '@/scenes/AssembleScene'
import { CompareScene } from '@/scenes/CompareScene'
import { AboutScene } from '@/scenes/AboutScene'
import { getSceneById, getMountedSceneIds, type SceneId } from '@/scenes/scenes.config'
import { SCROLL_ROOT_SELECTOR } from '@/prologue/snap'
import { usePrologueGate } from '@/prologue/usePrologueGate'
import { Prologue } from '@/prologue/Prologue'

const MOUNTED_IDS: SceneId[] = getMountedSceneIds()

const SCENE_COMPONENTS: Partial<Record<SceneId, ComponentType>> = {
  prompt: PromptScene,
  tokenize: TokenizeScene,
  embed: EmbedScene,
  attention: AttentionScene,
  predict: PredictScene,
  decode: DecodeScene,
  output: AssembleScene, // id 'output' → AssembleScene (id ≠ component name)
  compare: CompareScene,
  about: AboutScene,
  // interlude/window/system/rag/hallucinate added in Phases 6-7 (with implemented:true)
}

function readInitialSceneId(): SceneId {
  if (typeof window === 'undefined') return 'intro'
  const raw = window.location.hash.replace(/^#/, '').toLowerCase()
  return (MOUNTED_IDS as readonly string[]).includes(raw) ? (raw as SceneId) : 'intro'
}

export function Site() {
  return (
    <RunningExampleProvider>
      <DepthProvider>
        <Shell />
      </DepthProvider>
    </RunningExampleProvider>
  )
}

function Shell() {
  const [activeId, setActiveId] = useState<SceneId>(readInitialSceneId)
  const { showPrologue, snapMode } = usePrologueGate()
  const { globalDepth } = useDepth()
  useHashSync(activeId)
  useTrackSceneReach(activeId, globalDepth)

  useLayoutEffect(() => {
    if (activeId === 'intro') return
    document.getElementById(activeId)?.scrollIntoView()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: honor deep-link once on mount before scroll-spy fires
  }, [])

  const goTo = useCallback((id: SceneId) => {
    if (id === 'intro') {
      setActiveId('intro')
      document.getElementById('intro')?.scrollIntoView()
      return
    }
    if (MOUNTED_IDS.includes(id)) {
      setActiveId(id)
      document.getElementById(id)?.scrollIntoView()
    }
  }, [])

  useEffect(() => {
    function handle(e: globalThis.Event) {
      const id = (e as globalThis.CustomEvent<{ id: string }>).detail.id as SceneId
      goTo(id)
    }
    window.addEventListener(SCENE_JUMP_EVENT, handle as globalThis.EventListener)
    return () => window.removeEventListener(SCENE_JUMP_EVENT, handle as globalThis.EventListener)
  }, [goTo])

  const idx = MOUNTED_IDS.indexOf(activeId)
  useKeyboardNav({
    onPrev: () => {
      if (idx > 0) goTo(MOUNTED_IDS[idx - 1])
    },
    onNext: () => {
      if (idx < MOUNTED_IDS.length - 1) goTo(MOUNTED_IDS[idx + 1])
    },
  })

  const handleScrollActiveChange = useCallback((id: string) => {
    if (MOUNTED_IDS.includes(id as SceneId)) {
      setActiveId(id as SceneId)
    }
  }, [])
  useScrollSpy({
    ids: MOUNTED_IDS,
    onActiveChange: handleScrollActiveChange,
    ...(SCROLL_ROOT_SELECTOR !== undefined ? { rootSelector: SCROLL_ROOT_SELECTOR } : {}),
    threshold: 0.5,
  })

  const activeScene = getSceneById(activeId)

  return (
    <>
      <a className="skip-link" href="#intro">
        Skip to content
      </a>
      <ProgressRail activeId={activeId} onJump={goTo} />
      <TopBar scene={activeScene} />
      <main className="stations" aria-label="LLM pipeline scenes">
        <div id="intro">{showPrologue && <Prologue forceStatic={snapMode === 'static'} />}</div>
        <SceneNavProvider ids={MOUNTED_IDS} goTo={goTo}>
          {MOUNTED_IDS.map((id) => {
            const SceneComponent = SCENE_COMPONENTS[id]
            return SceneComponent ? <SceneComponent key={id} /> : null
          })}
        </SceneNavProvider>
      </main>
    </>
  )
}
