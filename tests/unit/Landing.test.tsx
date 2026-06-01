import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Landing } from '@/landing/Landing'

describe('Landing composition', () => {
  it('renders exactly one <h1> ("Inside an LLM")', () => {
    render(<Landing />)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings.length).toBe(1)
    expect(headings[0]).toHaveTextContent(/Inside an LLM/)
  })

  it('renders an <h2> for each content section in spec §5', () => {
    render(<Landing />)
    // §5.2 "What you'll see", §5.3 "Where the numbers come from",
    // §5.4 "Two ways to read it.", §5.5 "Built with"
    const h2s = screen.getAllByRole('heading', { level: 2 })
    const text = h2s.map((h) => h.textContent ?? '').join(' | ')
    expect(text).toMatch(/What you'?ll see/i)
    expect(text).toMatch(/Where the numbers come from/i)
    expect(text).toMatch(/Two ways to read it/i)
    expect(text).toMatch(/Built with/i)
  })

  it('renders the skip link as the first focusable element', () => {
    render(<Landing />)
    expect(screen.getByText(/Skip to content/i)).toHaveAttribute('href', '#main-content')
  })

  it('renders a <main> landmark with id="main-content"', () => {
    const { container } = render(<Landing />)
    const main = container.querySelector('main#main-content')
    expect(main).not.toBeNull()
  })

  it('renders a <footer> landmark', () => {
    render(<Landing />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders the brand-voice provenance phrasing in the hero', () => {
    render(<Landing />)
    expect(
      screen.getByText(
        /Numbers from GPT-2 small, run offline\. Illustrative, not Claude or ChatGPT/i,
      ),
    ).toBeInTheDocument()
  })
})
