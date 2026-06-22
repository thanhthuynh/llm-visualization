import { SCENES } from '@/scenes/scenes.config'
import { PROLOGUE_SNAP_MODE, type PrologueSnapMode } from '@/prologue/snap'
import { useReducedMotionPref } from '@/app/useReducedMotionPref'

const STATION_IDS: ReadonlySet<string> = new Set(
  SCENES.map((s) => s.id).filter((id) => id !== 'intro'),
)

/**
 * Pure: show the prologue only on a fresh entry (empty hash) or #intro;
 * bypass when deep-linked to a real station id.
 */
export function shouldShowPrologue(hash: string): boolean {
  const id = hash.replace(/^#/, '').toLowerCase()
  if (id === '' || id === 'intro') return true
  return !STATION_IDS.has(id) // unknown/garbage hash → still show; a real station id → bypass
}

/**
 * Pure: reduced-motion OR ?prologue=static forces the static (non-scrub) variant.
 */
export function resolveSnapMode(reduced: boolean, search: string): PrologueSnapMode {
  const forcedStatic = new URLSearchParams(search).get('prologue') === 'static'
  return reduced || forcedStatic ? 'static' : PROLOGUE_SNAP_MODE
}

export function usePrologueGate(): { showPrologue: boolean; snapMode: PrologueSnapMode } {
  const reduced = useReducedMotionPref()
  // read window.location.hash + search at call time (the gate is decided on mount; deep-link bypass is one-shot)
  const showPrologue = shouldShowPrologue(
    typeof window === 'undefined' ? '' : window.location.hash,
  )
  const snapMode = resolveSnapMode(
    reduced,
    typeof window === 'undefined' ? '' : window.location.search,
  )
  return { showPrologue, snapMode }
}
