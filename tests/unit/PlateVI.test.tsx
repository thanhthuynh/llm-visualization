import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlateVI } from '@/plates/PlateVI'

describe('PlateVI — The Scouting Party', () => {
  it('renders the sheet label and title row verbatim', () => {
    const { container } = render(<PlateVI />)
    expect(
      container.querySelector('[data-screen-label="Plate VI — Subagents"]'),
    ).toBeInTheDocument()
    expect(screen.getByText('PLATE VI')).toBeInTheDocument()
    expect(screen.getByText('The Scouting Party')).toBeInTheDocument()
    expect(screen.getByText('SUBJECT · SUBAGENTS')).toBeInTheDocument()
  })

  it('renders the lede verbatim', () => {
    render(<PlateVI />)
    expect(
      screen.getByText(
        'No single party can chart everything. A lead agent dispatches subagents — each surveys its own territory in isolation, then returns with findings to be drawn together.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the lead agent card', () => {
    render(<PlateVI />)
    expect(screen.getByText('LEAD AGENT')).toBeInTheDocument()
    expect(screen.getByText('The flagship')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Decomposes the task, dispatches scouts, then draws their findings together into one answer.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('DECOMPOSE')).toBeInTheDocument()
    expect(screen.getByText('SYNTHESIZE')).toBeInTheDocument()
  })

  it('renders the three subagent cards with titles, glosses, and token returns', () => {
    render(<PlateVI />)
    expect(screen.getByText('SUBAGENT · A')).toBeInTheDocument()
    expect(screen.getByText('SUBAGENT · B')).toBeInTheDocument()
    expect(screen.getByText('SUBAGENT · C')).toBeInTheDocument()
    expect(screen.getAllByText('isolated context')).toHaveLength(3)
    expect(screen.getAllByText('RETURNS')).toHaveLength(3)
    expect(screen.getByText('Survey · sources')).toBeInTheDocument()
    expect(screen.getByText('Survey · the web')).toBeInTheDocument()
    expect(screen.getByText('Survey · the code')).toBeInTheDocument()
    expect(screen.getByText('reads the document store')).toBeInTheDocument()
    expect(screen.getByText('searches & reads pages')).toBeInTheDocument()
    expect(screen.getByText('runs & inspects code')).toBeInTheDocument()
    expect(screen.getByText('180 tok')).toBeInTheDocument()
    expect(screen.getByText('240 tok')).toBeInTheDocument()
    expect(screen.getByText('120 tok')).toBeInTheDocument()
  })

  it('renders three blue progress fills with the design-reference widths', () => {
    const { container } = render(<PlateVI />)
    const fills = Array.from(container.querySelectorAll('.bg-blue'))
    expect(fills).toHaveLength(3)
    const widths = fills.map((el) => Array.from(el.classList).find((cls) => cls.startsWith('w-[')))
    expect(widths).toEqual(['w-[55%]', 'w-[72%]', 'w-[38%]'])
  })

  it('draws three dashed gold dispatch curves and three solid blue return curves', () => {
    const { container } = render(<PlateVI />)
    expect(
      container.querySelectorAll('path[stroke="#d8a657"][stroke-dasharray="2 7"]'),
    ).toHaveLength(3)
    expect(container.querySelectorAll('path[stroke="#5b8fb0"]')).toHaveLength(3)
    // Marker ids are plate-unique (pvi- prefix)
    expect(container.querySelector('marker#pvi-arD')).toBeInTheDocument()
    expect(container.querySelector('marker#pvi-arR')).toBeInTheDocument()
  })

  it('renders the floating route labels and the bottom caption', () => {
    render(<PlateVI />)
    expect(screen.getByText('dispatch ▸')).toBeInTheDocument()
    expect(screen.getByText('◂ findings')).toBeInTheDocument()
    expect(
      screen.getByText(
        "Each scout works in isolation and in parallel, returning only a condensed finding — so the lead's own chart stays clear.",
      ),
    ).toBeInTheDocument()
  })

  it('renders the footer credits verbatim', () => {
    render(<PlateVI />)
    expect(screen.getByText('SURVEYED MMXXVI · THE ATLAS')).toBeInTheDocument()
    expect(screen.getByText('PARALLEL · ISOLATED')).toBeInTheDocument()
  })
})
