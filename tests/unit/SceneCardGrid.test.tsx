import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SceneCardGrid } from '@/landing/SceneCardGrid'

describe('SceneCardGrid', () => {
  it('renders an H2 "What you\'ll see"', () => {
    render(<SceneCardGrid />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/What you'?ll see/i)
  })

  it('renders all 7 pipeline scene cards (prompt → output)', () => {
    render(<SceneCardGrid />)
    const labels = [
      /Prompt/i,
      /Tokenize/i,
      /Embed/i,
      /Attention/i,
      /Predict/i,
      /Decode/i,
      /Output/i,
    ]
    labels.forEach((re) => {
      expect(screen.getAllByText(re).length).toBeGreaterThan(0)
    })
  })

  it('renders the spec-locked teaser for the Prompt card verbatim', () => {
    render(<SceneCardGrid />)
    expect(
      screen.getByText(/Everything starts with a string of characters\. Nothing more\./i),
    ).toBeInTheDocument()
  })

  it('renders the spec-locked teaser for the Output card verbatim', () => {
    render(<SceneCardGrid />)
    expect(
      screen.getByText(/Tokens stream out until the end-of-sequence signal fires\./i),
    ).toBeInTheDocument()
  })

  it('each card is an individually focusable link to its scene anchor', () => {
    render(<SceneCardGrid />)
    const promptCard = screen.getByRole('link', { name: /01.*Prompt/i })
    expect(promptCard).toHaveAttribute('href', '/explorer#prompt')
    const outputCard = screen.getByRole('link', { name: /07.*Output/i })
    expect(outputCard).toHaveAttribute('href', '/explorer#output')
  })

  it('predict card never uses #9D4EDD as a text color (style rule)', () => {
    render(<SceneCardGrid />)
    // Predict label text should NOT inline-style-color the spec accent
    const predictLabel = screen.getByText(/^Predict$/i)
    const style = (predictLabel as HTMLElement).style.color.toLowerCase()
    expect(style).not.toMatch(/#9d4edd/)
    expect(style).not.toMatch(/rgb\(157, 78, 221\)/)
  })

  it('renders the 8th monogram cap card to balance the 4-col grid', () => {
    const { container } = render(<SceneCardGrid />)
    // 7 scene links + 1 cap (any element with role="presentation" or aria-hidden marker)
    const cards = container.querySelectorAll('[data-card]')
    expect(cards.length).toBeGreaterThanOrEqual(8)
  })
})
