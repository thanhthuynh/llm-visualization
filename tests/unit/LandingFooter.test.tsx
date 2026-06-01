import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LandingFooter } from '@/landing/LandingFooter'

describe('LandingFooter', () => {
  it('renders inside a <footer> landmark', () => {
    render(<LandingFooter />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders 7 pipeline dots, one per accent, each with an aria-label naming its stage', () => {
    render(<LandingFooter />)
    const stages = ['Prompt', 'Tokenize', 'Embed', 'Attention', 'Predict', 'Decode', 'Output']
    stages.forEach((stage) => {
      expect(screen.getByLabelText(new RegExp(stage, 'i'))).toBeInTheDocument()
    })
  })

  it('renders the Launch CTA linking to /explorer#prompt', () => {
    render(<LandingFooter />)
    const cta = screen.getByRole('link', { name: /Launch the explainer/i })
    expect(cta).toHaveAttribute('href', '/explorer#prompt')
  })

  it('renders a GitHub link and MIT link', () => {
    render(<LandingFooter />)
    const gh = screen.getByRole('link', { name: /GitHub/i })
    expect(gh).toHaveAttribute('href', 'https://github.com/thanhthuynh/llm-visualization')
    const mit = screen.getByRole('link', { name: /MIT/i })
    expect(mit.getAttribute('href')).toMatch(/LICENSE|MIT/i)
  })

  it('renders the trailing mono microline naming the stack', () => {
    render(<LandingFooter />)
    expect(screen.getByText(/built with vite/i)).toBeInTheDocument()
  })
})
