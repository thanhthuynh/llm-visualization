import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { App } from '@/App'

describe('App', () => {
  it('renders the rail, topbar wordmark, and prompt scene as default', () => {
    render(<App />)
    expect(screen.getByRole('navigation', { name: /scenes/i })).toBeInTheDocument()
    expect(screen.getAllByText(/inside an llm/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { level: 2, name: /prompt input/i })).toBeInTheDocument()
  })
  it('renders all nine mounted scene headings', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: /prompt input/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /tokenization/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /embeddings/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /attention/i })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /next-token prediction/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /decoding loop/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /output assembly/i })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /claude vs chatgpt/i }),
    ).toBeInTheDocument()
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

describe('App — deep-link via hash', () => {
  beforeEach(() => history.replaceState(null, '', '/'))
  afterEach(() => history.replaceState(null, '', '/'))

  it('activates the decode scene when the initial URL is /explorer#decode', () => {
    history.replaceState(null, '', '/explorer#decode')
    render(<App />)
    const rail = screen.getByRole('navigation', { name: /scenes/i })
    expect(within(rail).getByRole('button', { name: /decoding loop/i })).toHaveAttribute(
      'aria-current',
      'step',
    )
  })

  it('activates the compare scene when the initial URL is /explorer#compare', () => {
    history.replaceState(null, '', '/explorer#compare')
    render(<App />)
    const rail = screen.getByRole('navigation', { name: /scenes/i })
    expect(within(rail).getByRole('button', { name: /^compare$/i })).toHaveAttribute(
      'aria-current',
      'step',
    )
  })

  it('activates the about scene when the initial URL is /explorer#about', () => {
    history.replaceState(null, '', '/explorer#about')
    render(<App />)
    const rail = screen.getByRole('navigation', { name: /scenes/i })
    expect(within(rail).getByRole('button', { name: /^about$/i })).toHaveAttribute(
      'aria-current',
      'step',
    )
  })

  it('falls back to the prompt scene for an unknown scene hash', () => {
    history.replaceState(null, '', '/explorer#nonexistent')
    render(<App />)
    const rail = screen.getByRole('navigation', { name: /scenes/i })
    expect(within(rail).getByRole('button', { name: /prompt input/i })).toHaveAttribute(
      'aria-current',
      'step',
    )
  })

  it('falls back to the prompt scene when there is no hash', () => {
    history.replaceState(null, '', '/explorer')
    render(<App />)
    const rail = screen.getByRole('navigation', { name: /scenes/i })
    expect(within(rail).getByRole('button', { name: /prompt input/i })).toHaveAttribute(
      'aria-current',
      'step',
    )
  })

  it('scrolls the deep-linked scene into view on mount', () => {
    history.replaceState(null, '', '/explorer#decode')
    const spy = vi.spyOn(Element.prototype, 'scrollIntoView')
    render(<App />)
    const decodeSection = document.getElementById('decode')
    expect(decodeSection).not.toBeNull()
    expect(spy.mock.instances).toContain(decodeSection)
    spy.mockRestore()
  })

  it('does not scroll on mount when there is no deep-link (activeId stays at prompt)', () => {
    history.replaceState(null, '', '/explorer')
    const spy = vi.spyOn(Element.prototype, 'scrollIntoView')
    render(<App />)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
