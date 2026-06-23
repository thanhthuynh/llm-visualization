export type BeatId =
  | 'hook'
  | 'tokenize'
  | 'embed'
  | 'attention'
  | 'predict-output'
  | 'provenance'
  | 'choose-path'

export interface Beat {
  id: BeatId
  range: readonly [number, number]
}

export const BEATS: readonly Beat[] = [
  { id: 'hook', range: [0, 0.12] },
  { id: 'tokenize', range: [0.12, 0.3] },
  { id: 'embed', range: [0.3, 0.45] },
  { id: 'attention', range: [0.45, 0.58] },
  { id: 'predict-output', range: [0.58, 0.72] },
  { id: 'provenance', range: [0.72, 0.84] },
  { id: 'choose-path', range: [0.84, 1] },
]

/**
 * Pure: which beat is active at scroll progress p (clamped to [0,1]).
 * The last beat covers p===1 (closed interval on the right end).
 */
export function beatAtProgress(p: number): BeatId {
  const clamped = Math.max(0, Math.min(1, p))
  // Last beat is a special case: its range is [0.84, 1] and must cover p===1
  for (let i = 0; i < BEATS.length - 1; i++) {
    const beat = BEATS[i]!
    if (clamped >= beat.range[0] && clamped < beat.range[1]) {
      return beat.id
    }
  }
  // Fallback: last beat covers everything at or beyond its start (including p===1)
  return BEATS[BEATS.length - 1]!.id
}
