import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { App } from '@/App'

describe('App shell a11y', () => {
  it('has no axe violations (serious/critical)', async () => {
    const { container } = render(<App />)

    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: false } },
    })

    expect(results).toHaveNoViolations()
  })
})
