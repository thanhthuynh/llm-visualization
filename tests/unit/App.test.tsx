import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from '@/App'

describe('App', () => {
  it('renders the rail, topbar wordmark, and predict scene', () => {
    render(<App />)
    expect(screen.getByRole('navigation', { name: /scenes/i })).toBeInTheDocument()
    expect(screen.getAllByText(/inside an llm/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { level: 2, name: /next-token prediction/i })).toBeInTheDocument()
  })
  it('renders the about section', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: /about/i })).toBeInTheDocument()
  })
  it('includes a skip-to-content link', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /skip to content/i })).toBeInTheDocument()
  })
  it('drives the TopBar pill from the active scene prompt', () => {
    render(<App />)
    expect(screen.getAllByText(/the sky is/i).length).toBeGreaterThan(0)
  })
})
