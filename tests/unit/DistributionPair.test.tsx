import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DistributionPair } from '@/components/DistributionPair'

const left = {
  label: 'T = 0.2 (PEAKED)',
  bars: [
    { token: 'blue', p: 0.9 },
    { token: 'not', p: 0.05 },
    { token: 'the', p: 0.03 },
    { token: 'a', p: 0.02 },
  ],
}
const right = {
  label: 'T = 1.4 (FLATTER)',
  bars: [
    { token: 'blue', p: 0.34 },
    { token: 'not', p: 0.22 },
    { token: 'the', p: 0.18 },
    { token: 'a', p: 0.14 },
    { token: 'very', p: 0.12 },
  ],
}

describe('DistributionPair', () => {
  it('renders both labels', () => {
    render(<DistributionPair left={left} right={right} accent="decode" />)
    expect(screen.getByText(/PEAKED/)).toBeInTheDocument()
    expect(screen.getByText(/FLATTER/)).toBeInTheDocument()
  })

  it('renders all bars from both distributions', () => {
    render(<DistributionPair left={left} right={right} accent="decode" />)
    // 4 left + 5 right = 9 progressbars
    expect(screen.getAllByRole('progressbar')).toHaveLength(9)
  })

  it('shows the default arrow caption "raise T →" when none provided', () => {
    render(<DistributionPair left={left} right={right} accent="decode" />)
    expect(screen.getByText(/raise t/i)).toBeInTheDocument()
  })

  it('uses a custom arrow caption when provided', () => {
    render(<DistributionPair left={left} right={right} accent="decode" arrowCaption="lower T ←" />)
    expect(screen.getByText(/lower t/i)).toBeInTheDocument()
  })

  it('formats values as percentages', () => {
    render(<DistributionPair left={left} right={right} accent="decode" />)
    // left top bar 0.9 → "90%"
    expect(screen.getAllByText('90%').length).toBeGreaterThanOrEqual(1)
    // right top bar 0.34 → "34%"
    expect(screen.getAllByText('34%').length).toBeGreaterThanOrEqual(1)
  })
})
