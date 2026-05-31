import { createContext, useContext, type ReactNode } from 'react'
import type { SceneId } from '@/scenes/scenes.config'

interface SceneNavValue {
  ids: ReadonlyArray<SceneId>
  goTo: (id: SceneId) => void
}

const SceneNavCtx = createContext<SceneNavValue | null>(null)

interface SceneNavProviderProps extends SceneNavValue {
  children: ReactNode
}

export function SceneNavProvider({ ids, goTo, children }: SceneNavProviderProps) {
  return <SceneNavCtx.Provider value={{ ids, goTo }}>{children}</SceneNavCtx.Provider>
}

export function useSceneNav(): SceneNavValue | null {
  return useContext(SceneNavCtx)
}
