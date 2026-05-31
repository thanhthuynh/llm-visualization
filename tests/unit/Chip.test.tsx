import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Chip } from '@/components/Chip'

describe('Chip', () => {
  it('renders as a button when onClick is provided', async () => {
    const onClick = vi.fn()
    render(<Chip onClick={onClick}>The sky is</Chip>)
    await userEvent.click(screen.getByRole('button', { name: 'The sky is' }))
    expect(onClick).toHaveBeenCalled()
  })
  it('renders as a static pill when onClick is omitted', () => {
    render(<Chip>The</Chip>)
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByText('The')).toBeInTheDocument()
  })
  it('marks the active state via aria-pressed', () => {
    render(<Chip onClick={() => {}} active>sky</Chip>)
    expect(screen.getByRole('button', { name: 'sky' })).toHaveAttribute('aria-pressed', 'true')
  })
})
