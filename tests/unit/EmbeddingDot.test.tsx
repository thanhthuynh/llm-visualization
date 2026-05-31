import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmbeddingDot } from '@/components/EmbeddingDot'
import type { ReactNode } from 'react'

function renderInSvg(node: ReactNode) {
  return render(
    <svg width={200} height={200}>
      {node}
    </svg>,
  )
}

describe('EmbeddingDot', () => {
  it('renders a circle at the given (x, y)', () => {
    renderInSvg(<EmbeddingDot x={50} y={80} label="sky" />)
    const dot = screen.getByTestId('embedding-dot-sky')
    expect(dot.getAttribute('cx')).toBe('50')
    expect(dot.getAttribute('cy')).toBe('80')
  })

  it('renders the label text near the dot', () => {
    renderInSvg(<EmbeddingDot x={50} y={80} label="sky" />)
    expect(screen.getByText('sky')).toBeInTheDocument()
  })

  it('applies the accent color when accent prop is provided', () => {
    renderInSvg(<EmbeddingDot x={50} y={80} label="sky" accent="embed" />)
    const dot = screen.getByTestId('embedding-dot-sky')
    expect(dot.getAttribute('fill')?.toLowerCase()).toContain('4cc9f0')
  })

  it('renders a ghost variant with dashed stroke + no fill', () => {
    renderInSvg(<EmbeddingDot x={50} y={80} label="sky" ghost />)
    const dot = screen.getByTestId('embedding-dot-sky')
    expect(dot.getAttribute('fill')).toBe('none')
    expect(dot.getAttribute('stroke-dasharray')).toBeTruthy()
  })
})
