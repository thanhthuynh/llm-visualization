import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from '@/landing/Hero'

describe('Hero', () => {
  it('renders the single H1 "Inside an LLM"', () => {
    render(<Hero />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/Inside an LLM/)
  })

  it('renders the spec-locked lede verbatim', () => {
    render(<Hero />)
    expect(
      screen.getByText(
        /Watch a prompt become an answer, one token at a time\. Seven stages, two reading paths/i,
      ),
    ).toBeInTheDocument()
  })

  it('renders the brand-voice-locked provenance microline (GPT-2 small + illustrative)', () => {
    render(<Hero />)
    expect(
      screen.getByText(
        /Numbers from GPT-2 small, run offline\. Illustrative, not Claude or ChatGPT/i,
      ),
    ).toBeInTheDocument()
  })

  it('exposes a primary CTA linking to /explorer#prompt', () => {
    render(<Hero />)
    const cta = screen.getByRole('link', { name: /Start with the prompt/i })
    expect(cta).toHaveAttribute('href', '/explorer#prompt')
  })

  it('exposes a secondary GitHub link', () => {
    render(<Hero />)
    const gh = screen.getByRole('link', { name: /GitHub/i })
    expect(gh).toHaveAttribute('href', 'https://github.com/thanhthuynh/llm-visualization')
  })
})
