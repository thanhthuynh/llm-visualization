import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { loadPromptDataset, type PromptId } from '@/data/loader'
import type { PromptDataset } from '@/data/schema'

interface RunningExampleValue {
  promptId: PromptId
  dataset: PromptDataset
  setPromptId: (id: PromptId) => void
}

const RunningExampleContext = createContext<RunningExampleValue | null>(null)

interface ProviderProps {
  children: ReactNode
  initial?: PromptId
}

export function RunningExampleProvider({ children, initial = 'sky' }: ProviderProps) {
  const [promptId, setPromptId] = useState<PromptId>(initial)
  const dataset = useMemo(() => loadPromptDataset(promptId), [promptId])
  const value = useMemo(() => ({ promptId, dataset, setPromptId }), [promptId, dataset])
  return <RunningExampleContext.Provider value={value}>{children}</RunningExampleContext.Provider>
}

export function useRunningExample(): RunningExampleValue {
  const ctx = useContext(RunningExampleContext)
  if (!ctx) throw new Error('useRunningExample must be used inside <RunningExampleProvider>')
  return ctx
}
