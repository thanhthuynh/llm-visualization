import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Depth = 'surface' | 'deep'

interface DepthContextValue {
  globalDepth: Depth
  setGlobalDepth: (next: Depth) => void
}

const DepthContext = createContext<DepthContextValue | null>(null)

interface DepthProviderProps {
  children: ReactNode
  initial?: Depth
}

export function DepthProvider({ children, initial = 'surface' }: DepthProviderProps) {
  const [globalDepth, setGlobalDepth] = useState<Depth>(initial)
  const value = useMemo(() => ({ globalDepth, setGlobalDepth }), [globalDepth])
  return <DepthContext.Provider value={value}>{children}</DepthContext.Provider>
}

export function useDepth(): DepthContextValue {
  const ctx = useContext(DepthContext)
  if (!ctx) throw new Error('useDepth must be used inside <DepthProvider>')
  return ctx
}
