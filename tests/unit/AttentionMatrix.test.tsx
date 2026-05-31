import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AttentionMatrix } from '@/components/AttentionMatrix'

const tokens = ['The', 'cat', 'sat', 'down', 'because', 'it', 'was', 'tired']

const matrix = [
  [1, 0, 0, 0, 0, 0, 0, 0],
  [0.3, 0.7, 0, 0, 0, 0, 0, 0],
  [0.1, 0.6, 0.3, 0, 0, 0, 0, 0],
  [0.05, 0.3, 0.5, 0.15, 0, 0, 0, 0],
  [0.05, 0.1, 0.3, 0.4, 0.15, 0, 0, 0],
  [0.05, 0.61, 0.09, 0.08, 0.14, 0.03, 0, 0],
  [0.05, 0.4, 0.05, 0.05, 0.05, 0.3, 0.1, 0],
  [0.05, 0.4, 0.05, 0.05, 0.1, 0.2, 0.05, 0.1],
]

describe('AttentionMatrix', () => {
  it('renders 64 cells (8x8)', () => {
    render(<AttentionMatrix tokens={tokens} weights={matrix} queryIndex={5} />)
    expect(screen.getAllByTestId(/^attention-cell-/)).toHaveLength(64)
  })

  it('upper-triangle cells (j > i) are marked blank', () => {
    render(<AttentionMatrix tokens={tokens} weights={matrix} queryIndex={5} />)
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 8; j++) {
        const cell = screen.getByTestId(`attention-cell-${i}-${j}`)
        expect(cell.getAttribute('data-blank')).toBe('true')
      }
    }
  })

  it('lower-triangle cells are NOT marked blank and have a numeric fill color', () => {
    render(<AttentionMatrix tokens={tokens} weights={matrix} queryIndex={5} />)
    const cell = screen.getByTestId('attention-cell-5-1')
    expect(cell.getAttribute('data-blank')).toBeNull()
    expect(cell.getAttribute('fill')).toMatch(/^(rgb|#)/)
  })

  it('highlights the query row with a stronger stroke', () => {
    render(<AttentionMatrix tokens={tokens} weights={matrix} queryIndex={5} />)
    const cell = screen.getByTestId('attention-cell-5-1')
    expect(Number(cell.getAttribute('stroke-width') ?? '0')).toBeGreaterThan(0.5)
  })

  it('renders the axis labels keys arrow and queries arrow', () => {
    render(<AttentionMatrix tokens={tokens} weights={matrix} queryIndex={5} />)
    expect(screen.getByText(/keys →/i)).toBeInTheDocument()
    expect(screen.getByText(/queries ↓/i)).toBeInTheDocument()
  })
})
