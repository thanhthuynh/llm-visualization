import { createContext, useContext, type ReactNode } from 'react'
import type { SectionId } from '@/plates/plates.config'

/**
 * Navigation context: the active section (scroll-spy derived) and the `go`
 * action every routable element uses (header nav, station rail, hero map
 * stations, gazetteer entries, colophon index).
 */
export interface AtlasNav {
  active: SectionId
  go: (id: SectionId) => void
}

const AtlasNavContext = createContext<AtlasNav | null>(null)

interface AtlasNavProviderProps {
  value: AtlasNav
  children: ReactNode
}

export function AtlasNavProvider({ value, children }: AtlasNavProviderProps) {
  return <AtlasNavContext.Provider value={value}>{children}</AtlasNavContext.Provider>
}

export function useAtlasNav(): AtlasNav {
  const ctx = useContext(AtlasNavContext)
  if (!ctx) throw new Error('useAtlasNav must be used within AtlasNavProvider')
  return ctx
}
