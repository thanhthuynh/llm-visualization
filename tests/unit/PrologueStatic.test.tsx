import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { PrologueStatic } from '@/prologue/PrologueStatic'
import { DepthProvider } from '@/app/DepthContext'

function renderStatic() {
  return render(
    <DepthProvider>
      <PrologueStatic />
    </DepthProvider>,
  )
}

describe('PrologueStatic', () => {
  it('renders all 7 unique beat landmark labels', () => {
    const { container } = renderStatic()
    const labels = Array.from(
      container.querySelectorAll('section[aria-label^="Prologue:"]'),
    ).map((el) => el.getAttribute('aria-label'))
    expect(labels).toHaveLength(7)
    expect(new Set(labels).size).toBe(7)
  })

  it('content parity: contains "71" and "blue" and NOT "47" (sky.json G1 guard)', () => {
    const { container } = renderStatic()
    expect(container.textContent).toContain('71')
    expect(container.textContent).toContain('blue')
    expect(container.textContent).not.toContain('47')
  })

  it('has a CTA anchor href="#interlude" with data-umami-event="cta-start-explore"', () => {
    const { container } = renderStatic()
    const cta = container.querySelector('a[href="#interlude"]')
    expect(cta).not.toBeNull()
    expect(cta?.getAttribute('data-umami-event')).toBe('cta-start-explore')
  })

  it('has a secondary CTA anchor href="#prompt"', () => {
    const { container } = renderStatic()
    const cta = container.querySelector('a[href="#prompt"]')
    expect(cta).not.toBeNull()
  })

  it('static layout: no .prologue-track, no .prologue-end-sentinel, has .prologue-static', () => {
    const { container } = renderStatic()
    expect(container.querySelector('.prologue-track')).toBeNull()
    expect(container.querySelector('.prologue-end-sentinel')).toBeNull()
    expect(container.querySelector('.prologue-static')).not.toBeNull()
  })
})
