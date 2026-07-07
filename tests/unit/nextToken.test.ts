import { describe, expect, it } from 'vitest'
import { CANDIDATE_LOGITS, computeNextToken } from '@/plates/nextToken'

const RANKED_TOKENS = ['"A"', '"The"', '"In"', '"Each"', '"Tokens"', '"Think"']

describe('computeNextToken — Plate IV·Detail distribution math', () => {
  it('holds the six design-reference candidates with quoted token strings', () => {
    expect(CANDIDATE_LOGITS.map(([tok]) => tok)).toEqual(RANKED_TOKENS)
    expect(CANDIDATE_LOGITS.map(([, logit]) => logit)).toEqual([3.0, 2.3, 1.4, 0.9, 0.7, 0.2])
  })

  it('defaults (T=0.7, top-p=0.95, Sampling) reproduce the prototype exactly', () => {
    const result = computeNextToken(0.7, 0.95, 'Sampling')
    expect(result.rows.map((row) => row.tok)).toEqual(RANKED_TOKENS)
    expect(result.rows.map((row) => row.pStr)).toEqual([
      '0.63',
      '0.23',
      '0.06',
      '0.03',
      '0.02',
      '0.01',
    ])
    expect(result.rows.map((row) => row.barWidth)).toEqual(['100%', '37%', '10%', '5%', '4%', '2%'])
    expect(result.rows.map((row) => row.inNucleus)).toEqual([true, true, true, true, false, false])
    expect(result.tempStr).toBe('0.70')
    expect(result.topPStr).toBe('0.95')
    expect(result.decodeStr).toBe('SAMPLING')
    expect(result.drawnTok).toBe('"A"')
    expect(result.nucleusNote).toBe('4 tokens in nucleus (top-p)')
  })

  it('probabilities are a softmax: they sum to 1 and rank descending', () => {
    const result = computeNextToken(0.7, 0.95, 'Sampling')
    const sum = result.rows.reduce((acc, row) => acc + row.p, 0)
    expect(sum).toBeCloseTo(1, 10)
    const ps = result.rows.map((row) => row.p)
    expect([...ps].sort((a, b) => b - a)).toEqual(ps)
  })

  it('T→0 clamps to 0.05 and sharpens to certainty (p1 → 1.00)', () => {
    const result = computeNextToken(0, 0.95, 'Sampling')
    expect(result.tempStr).toBe('0.05')
    expect(result.rows.map((row) => row.pStr)).toEqual([
      '1.00',
      '0.00',
      '0.00',
      '0.00',
      '0.00',
      '0.00',
    ])
    expect(result.rows.map((row) => row.barWidth)).toEqual(['100%', '0%', '0%', '0%', '0%', '0%'])
    expect(result.nucleusNote).toBe('1 tokens in nucleus (top-p)')
  })

  it('high T flattens the distribution and widens the nucleus', () => {
    const low = computeNextToken(0.7, 0.95, 'Sampling')
    const high = computeNextToken(1.5, 0.95, 'Sampling')
    expect(high.rows[0].p).toBeLessThan(low.rows[0].p)
    expect(high.rows[5].p).toBeGreaterThan(low.rows[5].p)
    expect(high.rows.map((row) => row.pStr)).toEqual([
      '0.39',
      '0.24',
      '0.13',
      '0.10',
      '0.08',
      '0.06',
    ])
    expect(high.rows.every((row) => row.inNucleus)).toBe(true)
    expect(high.nucleusNote).toBe('6 tokens in nucleus (top-p)')
    expect(high.tempStr).toBe('1.50')
  })

  it('marks the nucleus by cumulative probability BEFORE each row', () => {
    // cum before rank 1 is 0, so rank 1 is always in — even at top-p = 0.1.
    const tight = computeNextToken(0.7, 0.1, 'Sampling')
    expect(tight.rows.map((row) => row.inNucleus)).toEqual([
      true,
      false,
      false,
      false,
      false,
      false,
    ])
    expect(tight.nucleusNote).toBe('1 tokens in nucleus (top-p)')

    // At 0.65 the cum before rank 2 (0.63…) is still under top-p → 2 in.
    expect(computeNextToken(0.7, 0.65, 'Sampling').nucleusNote).toBe('2 tokens in nucleus (top-p)')

    // At top-p = 1 every row's preceding cum is < 1 → all 6 in.
    const full = computeNextToken(0.7, 1, 'Sampling')
    expect(full.rows.every((row) => row.inNucleus)).toBe(true)
    expect(full.nucleusNote).toBe('6 tokens in nucleus (top-p)')
  })

  it('greedy decode keeps only rank 1 in and switches the derived strings', () => {
    const greedy = computeNextToken(0.7, 0.95, 'Greedy')
    expect(greedy.rows.map((row) => row.inNucleus)).toEqual([
      true,
      false,
      false,
      false,
      false,
      false,
    ])
    expect(greedy.topPStr).toBe('—')
    expect(greedy.decodeStr).toBe('GREEDY · argmax')
    expect(greedy.nucleusNote).toBe('1 token · greedy decode')
    expect(greedy.drawnTok).toBe('"A"')
    // Decoding mode changes nucleus flags only — probabilities are untouched.
    const sampling = computeNextToken(0.7, 0.95, 'Sampling')
    expect(greedy.rows.map((row) => row.pStr)).toEqual(sampling.rows.map((row) => row.pStr))
  })

  it('formats tempStr from the clamped effective temperature', () => {
    expect(computeNextToken(0.03, 0.95, 'Sampling').tempStr).toBe('0.05')
    expect(computeNextToken(0.7, 0.95, 'Sampling').tempStr).toBe('0.70')
    expect(computeNextToken(1.5, 0.95, 'Sampling').tempStr).toBe('1.50')
  })

  it('is pure: repeated calls agree and the candidate table is not mutated', () => {
    const before = CANDIDATE_LOGITS.map(([tok, logit]) => [tok, logit])
    const a = computeNextToken(0.7, 0.95, 'Sampling')
    const b = computeNextToken(0.7, 0.95, 'Sampling')
    expect(a).toEqual(b)
    expect(CANDIDATE_LOGITS.map(([tok, logit]) => [tok, logit])).toEqual(before)
  })
})
