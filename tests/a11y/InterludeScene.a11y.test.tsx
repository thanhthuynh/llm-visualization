import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { InterludeScene } from '@/scenes/InterludeScene'

describe('InterludeScene a11y', () => {
  it('has no axe violations (serious/critical)', async () => {
    const { container } = render(<InterludeScene />)

    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: false } },
    })

    expect(results).toHaveNoViolations()
  })
})
