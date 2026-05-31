import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AttentionArc } from '@/components/AttentionArc'
import type { ReactNode } from 'react'

function renderInSvg(node: ReactNode) {
  return render(
    <svg width={400} height={120}>
      {node}
    </svg>,
  )
}

describe('AttentionArc', () => {
  it('renders an SVG path with both endpoints anchored', () => {
    renderInSvg(<AttentionArc x1={50} x2={250} baseline={80} weight={0.5} label="cat" />)
    const arc = screen.getByTestId('attention-arc-cat')
    const d = arc.getAttribute('d') ?? ''
    expect(d).toMatch(/^M\s*50/)
    expect(d).toContain('250')
  })

  it('scales stroke-opacity with weight', () => {
    renderInSvg(<AttentionArc x1={50} x2={250} baseline={80} weight={0.9} label="cat" />)
    const arc = screen.getByTestId('attention-arc-cat')
    const opacity = Number(arc.getAttribute('stroke-opacity'))
    expect(opacity).toBeGreaterThan(0.7)
  })

  it('renders a percentage label', () => {
    renderInSvg(<AttentionArc x1={50} x2={250} baseline={80} weight={0.61} label="cat" />)
    expect(screen.getByText(/61/)).toBeInTheDocument()
  })
})
