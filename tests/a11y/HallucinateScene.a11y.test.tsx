import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { HallucinateScene } from '@/scenes/HallucinateScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'
import { SceneNavProvider } from '@/app/SceneNavContext'

describe('HallucinateScene a11y', () => {
  it('has no axe violations (serious/critical)', async () => {
    const { container } = render(
      <RunningExampleProvider>
        <DepthProvider>
          <SceneNavProvider ids={[]} goTo={() => {}}>
            <HallucinateScene />
          </SceneNavProvider>
        </DepthProvider>
      </RunningExampleProvider>,
    )
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } })
    expect(results).toHaveNoViolations()
  })
})
