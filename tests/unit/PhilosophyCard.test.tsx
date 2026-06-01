import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PhilosophyCard } from '@/components/PhilosophyCard'

describe('PhilosophyCard', () => {
  it('renders the title, description, and public-doc reference', () => {
    render(
      <PhilosophyCard
        title="Constitutional AI / RLAIF"
        description="Anthropic publishes a constitution."
        publicDoc="Anthropic constitution"
        vendor="anthropic"
      />,
    )
    expect(screen.getByText(/Constitutional AI/i)).toBeInTheDocument()
    expect(screen.getByText(/publishes a constitution/i)).toBeInTheDocument()
    expect(screen.getByText(/Anthropic constitution/i)).toBeInTheDocument()
  })
})
