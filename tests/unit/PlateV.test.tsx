import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlateV } from '@/plates/PlateV'

describe('PlateV — The Self-Directed Survey', () => {
  it('renders the sheet label and title row verbatim', () => {
    const { container } = render(<PlateV />)
    expect(container.querySelector('[data-screen-label="Plate V — Agents"]')).toBeInTheDocument()
    expect(screen.getByText('PLATE V')).toBeInTheDocument()
    expect(screen.getByText('The Self-Directed Survey')).toBeInTheDocument()
    expect(screen.getByText('SUBJECT · AGENTS')).toBeInTheDocument()
  })

  it('renders the lede verbatim', () => {
    render(<PlateV />)
    expect(
      screen.getByText(
        'Give a model a goal, a set of instruments, and room to act — and it becomes an agent: charting its own course, one observation at a time.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the agent loop panel labels', () => {
    render(<PlateV />)
    expect(screen.getByText('THE AGENT LOOP')).toBeInTheDocument()
    expect(
      screen.getByText((_, el) => el?.tagName === 'DIV' && el.textContent === '1 · Reason'),
    ).toBeInTheDocument()
    expect(
      screen.getByText((_, el) => el?.tagName === 'DIV' && el.textContent === '2 · Act'),
    ).toBeInTheDocument()
    expect(
      screen.getByText((_, el) => el?.tagName === 'DIV' && el.textContent === 'Observe · 3'),
    ).toBeInTheDocument()
    expect(screen.getByText('plan the next step')).toBeInTheDocument()
    expect(screen.getByText('call a tool')).toBeInTheDocument()
    expect(screen.getByText('read the result')).toBeInTheDocument()
    expect(screen.getByText('Agent')).toBeInTheDocument()
    expect(screen.getByText('↻ loops until done')).toBeInTheDocument()
    expect(screen.getByText('GOAL')).toBeInTheDocument()
    expect(screen.getByText('ANSWER')).toBeInTheDocument()
  })

  it('draws the loop as three dashed arcs, three stations with halos, and two I/O lines', () => {
    const { container } = render(<PlateV />)
    expect(container.querySelectorAll('path[stroke-dasharray="2 7"]')).toHaveLength(3)
    // 3 halo circles + 3 station circles
    expect(container.querySelectorAll('circle')).toHaveLength(6)
    expect(container.querySelectorAll('line')).toHaveLength(2)
    // Marker ids are plate-unique (pv- prefix)
    expect(container.querySelector('marker#pv-loopArr')).toBeInTheDocument()
    expect(container.querySelector('marker#pv-ioArr')).toBeInTheDocument()
  })

  it('lists the five instruments with glosses and square gold bullets', () => {
    const { container } = render(<PlateV />)
    expect(screen.getByText('INSTRUMENTS')).toBeInTheDocument()
    const rows: ReadonlyArray<[string, string]> = [
      ['Search', 'the open web'],
      ['Retrieve', 'the document store'],
      ['Code', 'write & run'],
      ['Compute', 'exact arithmetic'],
      ['Memory', 'recall earlier notes'],
    ]
    for (const [name, gloss] of rows) {
      expect(screen.getByText(name)).toBeInTheDocument()
      expect(screen.getByText(gloss)).toBeInTheDocument()
    }
    expect(container.querySelectorAll('.bg-gold')).toHaveLength(5)
  })

  it('renders the three run-log steps with notes, reasons, and mono tool calls', () => {
    render(<PlateV />)
    expect(screen.getByText('RUN LOG')).toBeInTheDocument()
    expect(screen.getByText('STEP 01')).toBeInTheDocument()
    expect(screen.getByText('STEP 02')).toBeInTheDocument()
    expect(screen.getByText('STEP 03')).toBeInTheDocument()
    expect(screen.getByText('▸ 3 sources')).toBeInTheDocument()
    expect(screen.getByText('▸ value = 4.1%')).toBeInTheDocument()
    expect(screen.getByText('✓ done')).toBeInTheDocument()
    expect(screen.getByText(/reason → "I need current figures" ·/)).toBeInTheDocument()
    expect(screen.getByText(/reason → "extract the value" ·/)).toBeInTheDocument()
    expect(screen.getByText(/reason → "the goal is met" ·/)).toBeInTheDocument()
    expect(screen.getByText('search("2026 revenue")')).toBeInTheDocument()
    expect(screen.getByText('read(source 1)')).toBeInTheDocument()
    expect(screen.getByText('finish(answer)')).toBeInTheDocument()
  })

  it('renders the footer credits verbatim', () => {
    render(<PlateV />)
    expect(screen.getByText('SURVEYED MMXXVI · THE ATLAS')).toBeInTheDocument()
    expect(screen.getByText('VOL. II · AGENTS')).toBeInTheDocument()
  })
})
