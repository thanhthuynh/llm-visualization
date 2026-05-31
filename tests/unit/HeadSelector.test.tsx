import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HeadSelector } from '@/components/HeadSelector'

describe('HeadSelector', () => {
  it('renders 3 head buttons', () => {
    render(<HeadSelector active={0} onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: /head 1/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /head 2/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /head 3/i })).toBeInTheDocument()
  })

  it('marks aria-pressed correctly for the active head', () => {
    render(<HeadSelector active={1} onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: /head 1/i })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: /head 2/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /head 3/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onSelect with the head index when clicked', async () => {
    const onSelect = vi.fn()
    render(<HeadSelector active={0} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: /head 2/i }))
    expect(onSelect).toHaveBeenCalledWith(1)
  })
})
