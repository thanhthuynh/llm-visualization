import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ClaimTier } from '@/components/ClaimTier'

describe('ClaimTier', () => {
  it('renders the tier letter in parentheses', () => {
    render(<ClaimTier tier="a" />)
    expect(screen.getByText('(a)')).toBeInTheDocument()
  })

  it('uses a different border color for each tier', () => {
    const { rerender } = render(<ClaimTier tier="a" />)
    const a = screen.getByText('(a)').style.borderColor
    rerender(<ClaimTier tier="c" />)
    const c = screen.getByText('(c)').style.borderColor
    expect(a).not.toBe(c)
  })

  it('exposes tier on a data attribute for tests', () => {
    render(<ClaimTier tier="b" />)
    expect(screen.getByText('(b)').getAttribute('data-tier')).toBe('b')
  })
})
