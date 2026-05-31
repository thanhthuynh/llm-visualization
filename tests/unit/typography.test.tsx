import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { AccentRule } from '@/components/AccentRule'

describe('EyebrowLabel', () => {
  it('uppercases its text', () => {
    render(<EyebrowLabel>your prompt</EyebrowLabel>)
    expect(screen.getByText('your prompt')).toHaveStyle({ textTransform: 'uppercase' })
  })
})

describe('AccentRule', () => {
  it('renders a 48x3 block with the requested accent color', () => {
    const { container } = render(<AccentRule accent="predict" />)
    const rule = container.firstElementChild as globalThis.HTMLElement
    expect(rule.style.width).toBe('48px')
    expect(rule.style.height).toBe('3px')
    expect(rule.style.backgroundColor.toLowerCase()).toBe('rgb(157, 78, 221)')
  })
})
