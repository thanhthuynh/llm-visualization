import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from '@/App'

describe('App', () => {
  it('renders the rail, topbar wordmark, and prompt scene as default', () => {
    render(<App />)
    expect(screen.getByRole('navigation', { name: /scenes/i })).toBeInTheDocument()
    expect(screen.getAllByText(/inside an llm/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { level: 2, name: /prompt input/i })).toBeInTheDocument()
  })
  it('renders all six mounted scene headings', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: /prompt input/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /tokenization/i })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /next-token prediction/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /decoding loop/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /output assembly/i })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /about this explainer/i }),
    ).toBeInTheDocument()
  })
  it('includes a skip-to-content link pointing at the prompt scene', () => {
    render(<App />)
    const link = screen.getByRole('link', { name: /skip to content/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#prompt')
  })
  it('drives the TopBar pill from the active scene prompt', () => {
    render(<App />)
    expect(screen.getAllByText(/the sky is/i).length).toBeGreaterThan(0)
  })
})
