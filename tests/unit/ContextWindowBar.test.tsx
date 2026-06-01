import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContextWindowBar } from '@/components/ContextWindowBar'

const rows = [
  { vendor: 'anthropic' as const, family: 'Claude', tokens: 1_000_000 },
  { vendor: 'openai' as const, family: 'GPT', tokens: 1_000_000 },
]

describe('ContextWindowBar', () => {
  it('renders one progressbar per row with family + token label', () => {
    render(<ContextWindowBar rows={rows} maxTokens={1_000_000} />)
    const bars = screen.getAllByRole('progressbar')
    expect(bars).toHaveLength(2)
    expect(screen.getByText(/^Claude$/i)).toBeInTheDocument()
    expect(screen.getByText(/^GPT$/i)).toBeInTheDocument()
  })

  it('sets aria-valuenow to the token count and aria-valuemax to maxTokens', () => {
    render(<ContextWindowBar rows={rows} maxTokens={1_000_000} />)
    const bars = screen.getAllByRole('progressbar')
    bars.forEach((b) => {
      expect(b.getAttribute('aria-valuenow')).toBe('1000000')
      expect(b.getAttribute('aria-valuemax')).toBe('1000000')
    })
  })

  it('formats large counts with a 1M suffix', () => {
    render(<ContextWindowBar rows={rows} maxTokens={1_000_000} />)
    expect(screen.getAllByText(/1M/i).length).toBeGreaterThanOrEqual(2)
  })
})
