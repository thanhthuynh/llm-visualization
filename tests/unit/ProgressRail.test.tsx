import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProgressRail } from '@/components/ProgressRail'

describe('ProgressRail', () => {
  it('renders 14 buttons: INTRO + 4 Part-1 stations + 7 Part-2 stations + Compare + About', () => {
    render(<ProgressRail activeId="predict" onJump={() => {}} />)
    const nav = screen.getByRole('navigation', { name: /scenes/i })
    expect(within(nav).getAllByRole('button')).toHaveLength(14)
  })

  it('renders INTRO button and clicking it calls onJump("intro")', async () => {
    const onJump = vi.fn()
    render(<ProgressRail activeId="predict" onJump={onJump} />)
    const intro = screen.getByRole('button', { name: /intro/i })
    expect(intro).toBeInTheDocument()
    await userEvent.click(intro)
    expect(onJump).toHaveBeenCalledWith('intro')
  })

  it('INTRO button has aria-current="step" when activeId is "intro"', () => {
    render(<ProgressRail activeId="intro" onJump={() => {}} />)
    const intro = screen.getByRole('button', { name: /intro/i })
    expect(intro).toHaveAttribute('aria-current', 'step')
  })

  it('marks the active segment with aria-current=step', () => {
    render(<ProgressRail activeId="predict" onJump={() => {}} />)
    expect(screen.getByRole('button', { name: /predict/i })).toHaveAttribute('aria-current', 'step')
  })

  it('applies the accent glow to the active segment', () => {
    render(<ProgressRail activeId="predict" onJump={() => {}} />)
    const active = screen.getByRole('button', { name: /predict/i })
    expect(active.style.getPropertyValue('--rail-shadow')).toContain('rgba(157, 78, 221')
  })

  it('calls onJump with the scene id when clicking predict station', async () => {
    const onJump = vi.fn()
    render(<ProgressRail activeId="embed" onJump={onJump} />)
    await userEvent.click(screen.getByRole('button', { name: /predict/i }))
    expect(onJump).toHaveBeenCalledWith('predict')
  })

  it('renders the Compare button and clicking it calls onJump("compare")', async () => {
    const onJump = vi.fn()
    render(<ProgressRail activeId="predict" onJump={onJump} />)
    const compare = screen.getByRole('button', { name: /compare/i })
    expect(compare).not.toBeDisabled()
    await userEvent.click(compare)
    expect(onJump).toHaveBeenCalledWith('compare')
  })

  it('renders Compare button with aria-current="step" when active', () => {
    render(<ProgressRail activeId="compare" onJump={() => {}} />)
    expect(screen.getByRole('button', { name: /compare/i })).toHaveAttribute('aria-current', 'step')
  })

  it('applies the accent glow to the active Compare dot (--rail-shadow)', () => {
    render(<ProgressRail activeId="compare" onJump={() => {}} />)
    const compare = screen.getByRole('button', { name: /compare/i })
    expect(compare.style.getPropertyValue('--rail-shadow')).toContain('rgba(157, 78, 221')
  })

  it('"PART 2" group label is present in the document', () => {
    render(<ProgressRail activeId="predict" onJump={() => {}} />)
    expect(screen.getByText('PART 2')).toBeInTheDocument()
  })

  it('"PART 1" group label is present (window + system are implemented)', () => {
    render(<ProgressRail activeId="predict" onJump={() => {}} />)
    expect(screen.getByText('PART 1')).toBeInTheDocument()
  })

  it('first Part-2 station shows "1"', () => {
    render(<ProgressRail activeId="predict" onJump={() => {}} />)
    // The first station button should have text "1"
    const allButtons = screen.getAllByRole('button')
    const station1 = allButtons.find((btn) => btn.textContent?.trim() === '1')
    expect(station1).toBeDefined()
  })
})
