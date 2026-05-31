import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmbeddingSpace } from '@/components/EmbeddingSpace'
import { ILLUSTRATIVE_DOTS } from '@/data/illustrative-embeddings'

describe('EmbeddingSpace', () => {
  it('renders the meaning-axis labels', () => {
    render(<EmbeddingSpace dots={ILLUSTRATIVE_DOTS} />)
    expect(screen.getAllByText(/meaning/i).length).toBeGreaterThanOrEqual(2)
  })

  it('renders one dot per item', () => {
    render(<EmbeddingSpace dots={ILLUSTRATIVE_DOTS} />)
    ILLUSTRATIVE_DOTS.forEach((d) => {
      expect(screen.getByTestId(`embedding-dot-${d.label}`)).toBeInTheDocument()
    })
  })

  it('renders a cluster ellipse when cluster prop is set', () => {
    render(
      <EmbeddingSpace
        dots={ILLUSTRATIVE_DOTS}
        cluster={{ cx: -0.4, cy: -0.3, rx: 0.3, ry: 0.3 }}
      />,
    )
    expect(screen.getByTestId('embedding-cluster')).toBeInTheDocument()
  })

  it('renders the contextual-shift anchors when shift prop is set', () => {
    render(
      <EmbeddingSpace
        dots={ILLUSTRATIVE_DOTS}
        shift={{ from: 'sky', to: { x: -0.1, y: -0.45 } }}
      />,
    )
    expect(screen.getByTestId('embedding-shift-ghost')).toBeInTheDocument()
    expect(screen.getByTestId('embedding-shift-shifted')).toBeInTheDocument()
    expect(screen.getByTestId('embedding-shift-line')).toBeInTheDocument()
  })
})
