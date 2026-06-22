import { useReducedMotionPref } from '@/app/useReducedMotionPref'
import { PROLOGUE_SNAP_MODE } from './snap'
import { PrologueAnimated } from './PrologueAnimated'
import { PrologueStatic } from './PrologueStatic'

export interface PrologueProps {
  /** Force the static variant (Task 4.3 passes the resolved gate snapMode here). */
  forceStatic?: boolean
}

export function Prologue({ forceStatic = false }: PrologueProps = {}) {
  const reduced = useReducedMotionPref()
  const isStatic = forceStatic || reduced || PROLOGUE_SNAP_MODE === 'static'
  return isStatic ? <PrologueStatic /> : <PrologueAnimated />
}
