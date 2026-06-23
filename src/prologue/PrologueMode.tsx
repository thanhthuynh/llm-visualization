import { createContext, useContext } from 'react'

export type PrologueMode = 'scroll' | 'static'

const PrologueModeContext = createContext<PrologueMode>('scroll')

export function usePrologueMode(): PrologueMode {
  return useContext(PrologueModeContext)
}

export { PrologueModeContext }
