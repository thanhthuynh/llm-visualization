import { useEffect, useState } from 'react'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'
import { useHashSync, SCENE_JUMP_EVENT } from '@/app/useHashSync'
import { useKeyboardNav } from '@/app/useKeyboardNav'
import { ProgressRail } from '@/components/ProgressRail'
import { TopBar } from '@/components/TopBar'
import { PromptScene } from '@/scenes/PromptScene'
import { TokenizeScene } from '@/scenes/TokenizeScene'
import { PredictScene } from '@/scenes/PredictScene'
import { DecodeScene } from '@/scenes/DecodeScene'
import { AssembleScene } from '@/scenes/AssembleScene'
import { AboutScene } from '@/scenes/AboutScene'
import { getSceneById, getMountedSceneIds, type SceneId } from '@/scenes/scenes.config'

const MOUNTED_IDS: SceneId[] = getMountedSceneIds()

export function App() {
  return (
    <RunningExampleProvider>
      <DepthProvider>
        <Shell />
      </DepthProvider>
    </RunningExampleProvider>
  )
}

function Shell() {
  const [activeId, setActiveId] = useState<SceneId>('prompt')
  useHashSync(activeId)

  useEffect(() => {
    function handle(e: globalThis.Event) {
      const id = (e as globalThis.CustomEvent<{ id: string }>).detail.id as SceneId
      if (MOUNTED_IDS.includes(id)) {
        setActiveId(id)
        document.getElementById(id)?.scrollIntoView()
      }
    }
    window.addEventListener(SCENE_JUMP_EVENT, handle as globalThis.EventListener)
    return () => window.removeEventListener(SCENE_JUMP_EVENT, handle as globalThis.EventListener)
  }, [])

  const idx = MOUNTED_IDS.indexOf(activeId)
  useKeyboardNav({
    onPrev: () => {
      if (idx > 0) {
        const next = MOUNTED_IDS[idx - 1]
        setActiveId(next)
        document.getElementById(next)?.scrollIntoView()
      }
    },
    onNext: () => {
      if (idx < MOUNTED_IDS.length - 1) {
        const next = MOUNTED_IDS[idx + 1]
        setActiveId(next)
        document.getElementById(next)?.scrollIntoView()
      }
    },
  })

  const prompt = getSceneById(activeId).prompt

  return (
    <>
      <a className="skip-link" href="#prompt">
        Skip to content
      </a>
      <ProgressRail
        activeId={activeId}
        onJump={(id) => {
          if (MOUNTED_IDS.includes(id)) {
            setActiveId(id)
            document.getElementById(id)?.scrollIntoView()
          }
        }}
      />
      <TopBar prompt={prompt} />
      <main className="stations" aria-label="LLM pipeline scenes">
        <PromptScene />
        <TokenizeScene />
        <PredictScene />
        <DecodeScene />
        <AssembleScene />
        <AboutScene />
      </main>
    </>
  )
}
