import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { PrologueStatic } from '@/prologue/PrologueStatic'
import { DepthProvider } from '@/app/DepthContext'

describe('PrologueStatic a11y', () => {
  it('has no axe violations (serious/critical) across all 7 in-flow sections', async () => {
    const { container } = render(
      <DepthProvider>
        <PrologueStatic />
      </DepthProvider>,
    )

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    })

    expect(results).toHaveNoViolations()
  })
})
