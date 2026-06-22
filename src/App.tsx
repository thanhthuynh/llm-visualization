import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
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

const MOUNTED_IDS: SceneId[] = getMountedSceneIds()

function readInitialSceneId(): SceneId {
  if (typeof window === 'undefined') return 'prompt' // FLIP-TO-INTRO GATE (Phase 4)
  const raw = window.location.hash.replace(/^#/, '').toLowerCase()
  return (MOUNTED_IDS as readonly string[]).includes(raw) ? (raw as SceneId) : 'prompt' // FLIP-TO-INTRO GATE (Phase 4)
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
  const { globalDepth } = useDepth()
  useHashSync(activeId)
  useTrackSceneReach(activeId, globalDepth)

  useLayoutEffect(() => {
    if (activeId === 'prompt') return // FLIP-TO-INTRO GATE (Phase 4)
    document.getElementById(activeId)?.scrollIntoView()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: honor deep-link once on mount before scroll-spy fires
  }, [])

  const goTo = useCallback((id: SceneId) => {
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

  const prompt = getSceneById(activeId).prompt

  return (
    <>
      <a className="skip-link" href="#prompt">
        {/* FLIP-TO-INTRO GATE (Phase 4) */}
        Skip to content
      </a>
      <ProgressRail activeId={activeId} onJump={goTo} />
      <TopBar prompt={prompt} />
      <SceneNavProvider ids={MOUNTED_IDS} goTo={goTo}>
        <main className="stations" aria-label="LLM pipeline scenes">
          <PromptScene />
          <TokenizeScene />
          <EmbedScene />
          <AttentionScene />
          <PredictScene />
          <DecodeScene />
          <AssembleScene />
          <CompareScene />
          <AboutScene />
        </main>
      </SceneNavProvider>
    </>
  )
}
