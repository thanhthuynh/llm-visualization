import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PromptField } from '@/components/PromptField'

function setReducedMotion(value: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes('reduce') ? value : false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

describe('PromptField', () => {
  beforeEach(() => setReducedMotion(false))

  it('renders the prompt text', () => {
    render(<PromptField text="The sky is" />)
    expect(screen.getByText('The sky is')).toBeInTheDocument()
  })

  it('uses the mono font for the prompt text', () => {
    render(<PromptField text="The sky is" />)
    const txt = screen.getByText('The sky is')
    expect(txt.className).toMatch(/font-\[family-name:--font-mono\]/)
  })

  it('renders a blinking caret element', () => {
    render(<PromptField text="The sky is" />)
    expect(screen.getByTestId('caret')).toBeInTheDocument()
  })

  it('disables caret animation when reduced motion is set', () => {
    setReducedMotion(true)
    render(<PromptField text="The sky is" />)
    const caret = screen.getByTestId('caret')
    expect(caret.style.animation).toBe('none')
  })
})
