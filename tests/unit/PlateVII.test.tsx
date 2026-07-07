import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlateVII } from '@/plates/PlateVII'

describe('PlateVII — The Circuit', () => {
  it('renders the sheet label and title row verbatim', () => {
    const { container } = render(<PlateVII />)
    expect(container.querySelector('[data-screen-label="Plate VII — Loops"]')).toBeInTheDocument()
    expect(screen.getByText('PLATE VII')).toBeInTheDocument()
    expect(screen.getByText('The Circuit')).toBeInTheDocument()
    expect(screen.getByText('SUBJECT · LOOPS')).toBeInTheDocument()
  })

  it('renders the lede verbatim', () => {
    render(<PlateVII />)
    expect(
      screen.getByText(
        "The agent's route is a circuit, not a line. It runs the same three steps — reason, act, observe — turn after turn, until the goal is reached or the journey is called.",
      ),
    ).toBeInTheDocument()
  })

  it('renders the circuit panel labels and the goal-met exit line', () => {
    render(<PlateVII />)
    expect(screen.getByText('THE CIRCUIT')).toBeInTheDocument()
    expect(screen.getByText('Reason')).toBeInTheDocument()
    expect(screen.getByText('Act')).toBeInTheDocument()
    expect(screen.getByText('Observe')).toBeInTheDocument()
    expect(screen.getByText('Loop')).toBeInTheDocument()
    expect(screen.getByText('turn 3 / 3')).toBeInTheDocument()
    expect(screen.getByText(/goal met\?/)).toBeInTheDocument()
    expect(screen.getByText('no ↺ loop')).toBeInTheDocument()
    expect(screen.getByText('yes ▸ answer')).toBeInTheDocument()
  })

  it('draws three dashed arcs, three r=9 stations, and the r=2.5 center dot', () => {
    const { container } = render(<PlateVII />)
    expect(container.querySelectorAll('path[stroke-dasharray="2 7"]')).toHaveLength(3)
    expect(container.querySelectorAll('circle[r="9"]')).toHaveLength(3)
    expect(container.querySelectorAll('circle[r="2.5"]')).toHaveLength(1)
    // Marker id is plate-unique (pvii- prefix)
    expect(container.querySelector('marker#pvii-arrL')).toBeInTheDocument()
  })

  it('renders the three iteration turns with tools, results, and statuses', () => {
    render(<PlateVII />)
    expect(screen.getByText('ITERATIONS')).toBeInTheDocument()
    expect(screen.getByText('TURN 01')).toBeInTheDocument()
    expect(screen.getByText('TURN 02')).toBeInTheDocument()
    expect(screen.getByText('TURN 03')).toBeInTheDocument()
    expect(screen.getByText('search')).toBeInTheDocument()
    expect(screen.getByText('read')).toBeInTheDocument()
    expect(screen.getByText('finish')).toBeInTheDocument()
    expect(screen.getByText('3 sources found')).toBeInTheDocument()
    expect(screen.getByText('value = 4.1%')).toBeInTheDocument()
    expect(screen.getAllByText('↺ continue')).toHaveLength(2)
    expect(screen.getByText('✓ done')).toBeInTheDocument()
  })

  it('renders the three stop conditions with glyphs and glosses', () => {
    render(<PlateVII />)
    expect(screen.getByText('STOP CONDITIONS')).toBeInTheDocument()
    expect(screen.getByText('✓')).toBeInTheDocument()
    expect(screen.getByText('◷')).toBeInTheDocument()
    expect(screen.getByText('⊘')).toBeInTheDocument()
    // 'goal met' appears both as the TURN 03 result and as a stop-condition term
    expect(screen.getAllByText('goal met')).toHaveLength(2)
    expect(screen.getByText('step limit')).toBeInTheDocument()
    expect(screen.getByText('no progress')).toBeInTheDocument()
    expect(screen.getByText('the answer satisfies the task')).toBeInTheDocument()
    expect(screen.getByText('a maximum number of turns is reached')).toBeInTheDocument()
    expect(screen.getByText('observations stop changing')).toBeInTheDocument()
  })

  it('renders the footer credits verbatim', () => {
    render(<PlateVII />)
    expect(screen.getByText('SURVEYED MMXXVI · THE ATLAS')).toBeInTheDocument()
    expect(screen.getByText('UNTIL GOAL OR LIMIT')).toBeInTheDocument()
  })
})
