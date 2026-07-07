/**
 * Plate IV·Detail — next-token distribution math.
 *
 * Pure re-implementation of the design prototype's `computeNextToken()`
 * (`design_handoff_atlas_website/The Atlas - Website.dc.html`): softmax over
 * fixed candidate logits at the effective temperature, ranked descending,
 * with a top-p nucleus marked by cumulative probability *before* each row
 * (greedy decoding admits only rank 1). Every derived display string the
 * plate renders is computed here so the component just maps rows.
 */

export type Decoding = 'Sampling' | 'Greedy'

/**
 * Candidate next tokens after "What is a token?" with their logits.
 * Token strings include the quotes (e.g. `"A"`), as drawn on the plate.
 * illustrative — design-reference values, not measured
 */
export const CANDIDATE_LOGITS: ReadonlyArray<readonly [string, number]> = [
  ['"A"', 3.0],
  ['"The"', 2.3],
  ['"In"', 1.4],
  ['"Each"', 0.9],
  ['"Tokens"', 0.7],
  ['"Think"', 0.2],
]

/** The prototype clamps temperature to this floor before dividing logits. */
const MIN_TEMPERATURE = 0.05

export interface NextTokenRow {
  /** Token string, quotes included (e.g. `"A"`). */
  tok: string
  /** Softmax probability at the effective temperature. */
  p: number
  /** Probability formatted to 2dp for display. */
  pStr: string
  /** Bar width relative to the top-ranked probability, e.g. `"37%"`. */
  barWidth: string
  /** Inside the top-p nucleus (greedy ⇒ rank 1 only). */
  inNucleus: boolean
}

export interface NextTokenResult {
  /** Candidate rows sorted by probability, descending. */
  rows: ReadonlyArray<NextTokenRow>
  /** Effective (clamped) temperature, 2dp — e.g. `"0.70"`. */
  tempStr: string
  /** Top-p at 2dp, or `"—"` under greedy decoding. */
  topPStr: string
  /** `"SAMPLING"` or `"GREEDY · argmax"`. */
  decodeStr: string
  /** Deterministic top-1 display token. */
  drawnTok: string
  /** `"n tokens in nucleus (top-p)"` or `"1 token · greedy decode"`. */
  nucleusNote: string
}

/**
 * Compute the ranked next-token distribution and its display strings.
 * Pure: same inputs → same output; no shared state is mutated.
 */
export function computeNextToken(
  temperature: number,
  topP: number,
  decoding: Decoding,
): NextTokenResult {
  const effectiveT = Math.max(MIN_TEMPERATURE, temperature)
  const greedy = decoding === 'Greedy'

  const scored = CANDIDATE_LOGITS.map(([tok, logit]) => ({
    tok,
    weight: Math.exp(logit / effectiveT),
  }))
  const total = scored.reduce((sum, s) => sum + s.weight, 0)
  const ranked = scored
    .map(({ tok, weight }) => ({ tok, p: weight / total }))
    .sort((a, b) => b.p - a.p)

  const top = ranked[0]
  if (!top) throw new Error('computeNextToken: candidate list is empty')

  // Nucleus rule (prototype-exact): a row is in while the cumulative
  // probability *before* it is still under top-p.
  let cum = 0
  const rows: ReadonlyArray<NextTokenRow> = ranked.map((row, rank) => {
    const inTopP = cum < topP
    cum += row.p
    return {
      tok: row.tok,
      p: row.p,
      pStr: row.p.toFixed(2),
      barWidth: `${Math.round((row.p / top.p) * 100)}%`,
      inNucleus: greedy ? rank === 0 : inTopP,
    }
  })

  const nucleusCount = rows.filter((row) => row.inNucleus).length

  return {
    rows,
    tempStr: effectiveT.toFixed(2),
    topPStr: greedy ? '—' : topP.toFixed(2),
    decodeStr: greedy ? 'GREEDY · argmax' : 'SAMPLING',
    drawnTok: top.tok,
    nucleusNote: greedy ? '1 token · greedy decode' : `${nucleusCount} tokens in nucleus (top-p)`,
  }
}
