import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlateI } from '@/plates/PlateI'

describe('PlateI', () => {
  it('renders the title row verbatim', () => {
    render(<PlateI />)
    expect(screen.getByText('PLATE I')).toBeInTheDocument()
    expect(screen.getByText('The Boundaries of Memory')).toBeInTheDocument()
    expect(screen.getByText('SUBJECT · CONTEXT')).toBeInTheDocument()
  })

  it('renders the lede', () => {
    render(<PlateI />)
    expect(
      screen.getByText(/This transect surveys a 128,000-token window — what fills it/),
    ).toBeInTheDocument()
  })

  it('renders the five axis labels', () => {
    render(<PlateI />)
    for (const label of ['0', '32K', '64K', '96K', '128K']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('renders six window segments with token counts and names', () => {
    const { container } = render(<PlateI />)
    const bar = container.querySelector('[class*="h-[78px]"]')
    expect(bar).not.toBeNull()
    expect(bar?.children).toHaveLength(6)

    for (const tokens of ['0.4K', '1.2K', '73K', '0.2K', '4K', '49K']) {
      expect(screen.getByText(tokens)).toBeInTheDocument()
    }
    for (const name of ['System', 'Retrieved', 'Conversation', 'Input', 'Reserved', 'Open']) {
      expect(screen.getByText(name)).toBeInTheDocument()
    }
  })

  it('gives the Reserved segment the 45° gold hatch', () => {
    const { container } = render(<PlateI />)
    const bar = container.querySelector('[class*="h-[78px]"]')
    const reserved = bar?.children[4]
    expect(reserved).toBeInstanceOf(HTMLElement)
    expect((reserved as HTMLElement).style.background).toContain('repeating-linear-gradient(45deg')
  })

  it('renders the three survey notes verbatim', () => {
    render(<PlateI />)
    expect(screen.getByText('WHY IT MATTERS')).toBeInTheDocument()
    expect(screen.getByText('WHEN IT OVERFLOWS')).toBeInTheDocument()
    expect(screen.getByText('THE COST')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Everything the model weighs — instructions, history, sources, your question — must fit inside this single budget.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Fill the window and the oldest soundings slip past the edge — the model can no longer see them.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Attention compares every token with every other, so a longer window is slower and dearer to chart.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the footer credits', () => {
    render(<PlateI />)
    expect(screen.getByText('SURVEYED MMXXVI · THE ATLAS')).toBeInTheDocument()
    expect(screen.getByText('1 SQUARE = 1,024 TOKENS')).toBeInTheDocument()
  })
})
