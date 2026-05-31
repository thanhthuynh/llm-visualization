import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeepToggle } from '@/components/DeepToggle'

describe('DeepToggle', () => {
  it('shows "Go deeper" and a down chevron when collapsed', () => {
    render(<DeepToggle expanded={false} onToggle={() => {}} />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveTextContent(/go deeper/i)
    expect(btn).toHaveTextContent('⌄')
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })
  it('shows "Collapse" and up chevron when expanded', () => {
    render(<DeepToggle expanded={true} onToggle={() => {}} />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveTextContent(/collapse/i)
    expect(btn).toHaveTextContent('⌃')
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })
  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn()
    render(<DeepToggle expanded={false} onToggle={onToggle} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledOnce()
  })
  it('links to a controlled deep panel via aria-controls', () => {
    render(<DeepToggle expanded={false} onToggle={() => {}} controlsId="predict-deep" />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-controls', 'predict-deep')
  })
})
