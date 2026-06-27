import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { AttentionScene } from '@/scenes/AttentionScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

describe('AttentionScene a11y', () => {
  it('has no axe violations (serious/critical)', async () => {
    const { container } = render(
      <RunningExampleProvider>
        <DepthProvider>
          <AttentionScene />
        </DepthProvider>
      </RunningExampleProvider>,
    )

    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: false } },
    })

    expect(results).toHaveNoViolations()
  })

  it('has no axe violations in the mobile weight-bars layout', async () => {
    // Force the compact breakpoint so the scene renders the DataBar weight-bars
    // path (the desktop arc SVG is replaced below xl). The default test
    // matchMedia mock reports every viewport query as non-matching, so without
    // this override the mobile path is never exercised.
    const realMatchMedia = window.matchMedia
    window.matchMedia = ((query: string) => ({
      matches: query.includes('max-width'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia

    try {
      const { container } = render(
        <RunningExampleProvider>
          <DepthProvider>
            <AttentionScene />
          </DepthProvider>
        </RunningExampleProvider>,
      )

      // Sanity: we are exercising the mobile path (bars), not the arc SVG.
      expect(container.querySelector('[role="progressbar"]')).not.toBeNull()
      expect(container.querySelector('svg[aria-label="Attention arcs"]')).toBeNull()

      const results = await axe(container, {
        rules: { 'color-contrast': { enabled: false } },
      })

      expect(results).toHaveNoViolations()
    } finally {
      window.matchMedia = realMatchMedia
    }
  })
})
