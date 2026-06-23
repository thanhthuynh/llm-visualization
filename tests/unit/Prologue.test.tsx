import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { axe } from 'vitest-axe'

// Mock ONLY useScroll + useMotionValueEvent (jsdom has no scroll layout); keep
// the real motion runtime (motion.*, useTransform, useMotionValue) so beats
// derive their opacity/transform exactly as in production.
vi.mock('motion/react', async () => {
  const actual = await vi.importActual<typeof import('motion/react')>('motion/react')
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: actual.useMotionValue(0) }),
    useMotionValueEvent: () => {},
  }
})

import { Prologue } from '@/prologue/Prologue'
import { DepthProvider } from '@/app/DepthContext'

function renderPrologue() {
  return render(
    <DepthProvider>
      <Prologue />
    </DepthProvider>,
  )
}

describe('Prologue track', () => {
  it('renders the non-snapping track and an end sentinel', () => {
    const { container } = renderPrologue()
    expect(container.querySelector('.prologue-track')).not.toBeNull()
    expect(container.querySelector('.prologue-end-sentinel')).not.toBeNull()
  })

  it('renders all seven beat regions with unique landmark labels', () => {
    const { container } = renderPrologue()
    const labels = Array.from(container.querySelectorAll('section[aria-label^="Prologue:"]')).map(
      (el) => el.getAttribute('aria-label'),
    )
    expect(labels).toHaveLength(7)
    expect(new Set(labels).size).toBe(7)
  })

  it('exposes a Skip intro affordance from the first beat onward', () => {
    const { getByText } = renderPrologue()
    expect(getByText('Skip intro')).toBeInTheDocument()
  })

  it('Esc key handler is registered (no throw on Escape)', () => {
    renderPrologue()
    // scrollIntoView is stubbed in tests/setup.ts; #interlude is absent, so the
    // fallback sets the hash — assert it does not throw.
    expect(() => fireEvent.keyDown(window, { key: 'Escape' })).not.toThrow()
  })

  it('the predict beat shows blue 71 (from sky.json) and never the stale 47', () => {
    const { container } = renderPrologue()
    expect(container.textContent).toContain('71')
    expect(container.textContent).toContain('blue')
    expect(container.textContent).not.toContain('47')
  })

  it('has no serious/critical axe violations (static end-state)', async () => {
    const { container } = renderPrologue()
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } })
    expect(results).toHaveNoViolations()
  })
})
