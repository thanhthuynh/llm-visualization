import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProgressRail } from '@/components/ProgressRail'

describe('ProgressRail', () => {
  it('renders 7 numbered scene segments plus a Compare dot and an About dot', () => {
    render(<ProgressRail activeId="predict" onJump={() => {}} />)
    const nav = screen.getByRole('navigation', { name: /scenes/i })
    expect(within(nav).getAllByRole('button')).toHaveLength(9)
  })
  it('marks the active segment with aria-current=step', () => {
    render(<ProgressRail activeId="predict" onJump={() => {}} />)
    expect(screen.getByRole('button', { name: /predict/i })).toHaveAttribute('aria-current', 'step')
  })
  it('applies the accent glow to the active segment', () => {
    render(<ProgressRail activeId="predict" onJump={() => {}} />)
    const active = screen.getByRole('button', { name: /predict/i })
    expect(active.style.boxShadow).toContain('rgba(157, 78, 221')
  })
  it('calls onJump with the scene id when clicked on an implemented scene', async () => {
    const onJump = vi.fn()
    render(<ProgressRail activeId="predict" onJump={onJump} />)
    await userEvent.click(screen.getByRole('button', { name: /next-token/i }))
    expect(onJump).toHaveBeenCalledWith('predict')
  })
  it('does not call onJump when clicking an unimplemented scene', async () => {
    const onJump = vi.fn()
    render(<ProgressRail activeId="predict" onJump={onJump} />)
    // 'attention' is still unimplemented in Plan 3 Task 4; lands later in Plan 3.
    const attention = screen.getByRole('button', { name: /attention/i })
    expect(attention).toBeDisabled()
    await userEvent.click(attention)
    expect(onJump).not.toHaveBeenCalled()
  })
})
