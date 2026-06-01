import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { PredictScene } from '@/scenes/PredictScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

describe('PredictScene a11y', () => {
  it('has no axe violations (serious/critical)', async () => {
    const { container } = render(
      <RunningExampleProvider>
        <DepthProvider>
          <PredictScene />
        </DepthProvider>
      </RunningExampleProvider>,
    )

    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: false } },
    })

    expect(results).toHaveNoViolations()
  })
})
