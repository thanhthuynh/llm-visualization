import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Site } from '@/App'
import { getMountedSceneIds } from '@/scenes/scenes.config'

describe('App', () => {
  it('mounts scenes in config-derived order (DOM order === getMountedSceneIds())', () => {
    render(<Site />)
    const main = document.querySelector('main.stations')
    expect(main).not.toBeNull()
    const sections = Array.from(main!.querySelectorAll(':scope > section[id]'))
    const domIds = sections.map((s) => s.id)
    expect(domIds).toEqual(getMountedSceneIds())
  })
  it('mounts the prologue by default, with the rail, topbar wordmark, and stations below', () => {
    const { container } = render(<Site />)
    expect(screen.getByRole('navigation', { name: /scenes/i })).toBeInTheDocument()
    expect(screen.getAllByText(/inside an llm/i).length).toBeGreaterThan(0)
    // No hash → the animated prologue mounts (reduced-motion off in jsdom).
    expect(container.querySelector('.prologue-track')).not.toBeNull()
    // Stations still mount below the prologue.
    expect(screen.getByRole('heading', { level: 2, name: /prompt input/i })).toBeInTheDocument()
  })
  it('renders all twelve mounted scene headings', () => {
    render(<Site />)
    expect(screen.getByRole('heading', { level: 2, name: /around the model/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /context window/i })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /the system prompt/i }),
    ).toBeInTheDocument()
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
  it('includes a skip-to-content link pointing at the intro anchor', () => {
    render(<Site />)
    const link = screen.getByRole('link', { name: /skip to content/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#intro')
  })
  it('drives the TopBar pill from the active scene prompt', () => {
    render(<Site />)
    expect(screen.getAllByText(/the sky is/i).length).toBeGreaterThan(0)
  })
})

describe('App — deep-link via hash', () => {
  beforeEach(() => history.replaceState(null, '', '/'))
  afterEach(() => history.replaceState(null, '', '/'))

  it('activates the decode scene when the initial URL is /#decode', () => {
    history.replaceState(null, '', '/#decode')
    render(<Site />)
    const rail = screen.getByRole('navigation', { name: /scenes/i })
    expect(within(rail).getByRole('button', { name: /decode/i })).toHaveAttribute(
      'aria-current',
      'step',
    )
  })

  it('activates the compare scene when the initial URL is /#compare', () => {
    history.replaceState(null, '', '/#compare')
    render(<Site />)
    const rail = screen.getByRole('navigation', { name: /scenes/i })
    expect(within(rail).getByRole('button', { name: /^compare$/i })).toHaveAttribute(
      'aria-current',
      'step',
    )
  })

  it('activates the about scene when the initial URL is /#about', () => {
    history.replaceState(null, '', '/#about')
    render(<Site />)
    const rail = screen.getByRole('navigation', { name: /scenes/i })
    expect(within(rail).getByRole('button', { name: /^about$/i })).toHaveAttribute(
      'aria-current',
      'step',
    )
  })

  it('falls back to the prologue/intro for an unknown scene hash', () => {
    history.replaceState(null, '', '/#nonexistent')
    const { container } = render(<Site />)
    // Unknown hash → showPrologue:true → the prologue mounts; no station is the active fallback.
    expect(container.querySelector('.prologue-track')).not.toBeNull()
  })

  it('falls back to the prologue/intro when there is no hash', () => {
    history.replaceState(null, '', '/')
    const { container } = render(<Site />)
    expect(container.querySelector('.prologue-track')).not.toBeNull()
  })

  it('scrolls the deep-linked scene into view on mount', () => {
    history.replaceState(null, '', '/#decode')
    const spy = vi.spyOn(Element.prototype, 'scrollIntoView')
    render(<Site />)
    const decodeSection = document.getElementById('decode')
    expect(decodeSection).not.toBeNull()
    expect(spy.mock.instances).toContain(decodeSection)
    spy.mockRestore()
  })

  it('does not scroll on mount when there is no deep-link (activeId stays at intro)', () => {
    history.replaceState(null, '', '/')
    const spy = vi.spyOn(Element.prototype, 'scrollIntoView')
    render(<Site />)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
