import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroPipelinePreview } from '@/landing/HeroPipelinePreview'

describe('HeroPipelinePreview', () => {
  it('renders as a labeled presentation region', () => {
    render(<HeroPipelinePreview />)
    const region = screen.getByRole('img', { name: /pipeline/i })
    expect(region).toBeInTheDocument()
  })

  it('marks decorative animation as aria-hidden under default motion', () => {
    render(<HeroPipelinePreview />)
    const region = screen.getByRole('img', { name: /pipeline/i })
    expect(region).toHaveAttribute('aria-label', expect.stringMatching(/pipeline/i))
  })

  it('exposes the final output text "The sky is blue" in the static fallback', () => {
    render(<HeroPipelinePreview reducedMotion />)
    expect(screen.getByText(/The sky is blue/)).toBeInTheDocument()
  })

  it('renders the reduced-motion caption when reducedMotion=true', () => {
    render(<HeroPipelinePreview reducedMotion />)
    expect(screen.getByText(/One pass through the pipeline/i)).toBeInTheDocument()
  })
})
