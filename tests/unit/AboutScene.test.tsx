import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AboutScene } from '@/scenes/AboutScene'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

describe('AboutScene', () => {
  it('renders a level-2 heading', () => {
    render(<RunningExampleProvider><AboutScene /></RunningExampleProvider>)
    expect(screen.getByRole('heading', { level: 2, name: /about/i })).toBeInTheDocument()
  })
  it('names the reference model in plain text', () => {
    render(<RunningExampleProvider><AboutScene /></RunningExampleProvider>)
    expect(screen.getByText(/GPT-2/i)).toBeInTheDocument()
    expect(screen.getByText(/illustrative/i)).toBeInTheDocument()
  })
  it('explains why live Claude or ChatGPT internals are not shown', () => {
    render(<RunningExampleProvider><AboutScene /></RunningExampleProvider>)
    const body = screen.getByTestId('about-body').textContent ?? ''
    expect(body.toLowerCase()).toContain('claude')
    expect(body.toLowerCase()).toContain('chatgpt')
    expect(body.toLowerCase()).toMatch(/cannot|do not expose|not accessible/)
  })
})
