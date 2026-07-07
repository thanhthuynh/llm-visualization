import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlateIV } from '@/plates/PlateIV'

const STATION_NAMES = [
  'Prompt',
  'Tokenization',
  'Embedding',
  'Attention',
  'Prediction',
  'Sampling',
  'Output',
]

const STATION_CAPTIONS = [
  'Raw text enters the chart.',
  'Cut into tokens with IDs.',
  'Each token becomes a vector.',
  'Tokens weigh each other.',
  'Odds over the vocabulary.',
  'One token is drawn.',
  'Reassembled into language.',
]

describe('PlateIV — The Inference Passage', () => {
  it('renders the canonical title row', () => {
    render(<PlateIV />)
    expect(screen.getByText('PLATE IV')).toBeInTheDocument()
    expect(screen.getByText('The Inference Passage')).toBeInTheDocument()
    expect(screen.getByText('PROJ. TRANSFORMER')).toBeInTheDocument()
  })

  it('renders the lede', () => {
    render(<PlateIV />)
    expect(
      screen.getByText(/The same route, now with a glyph at every station/),
    ).toBeInTheDocument()
  })

  it('renders the seven stations in route order with ST. labels and captions', () => {
    render(<PlateIV />)
    for (let n = 1; n <= 7; n++) {
      expect(screen.getByText(`ST. 0${n}`)).toBeInTheDocument()
    }
    for (const caption of STATION_CAPTIONS) {
      expect(screen.getByText(caption)).toBeInTheDocument()
    }
    const names = STATION_NAMES.map((name) => screen.getByText(name))
    for (let i = 1; i < names.length; i++) {
      const previous = names[i - 1]
      const current = names[i]
      expect(
        previous.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
    }
  })

  it('draws a 118×92 glyph card at every station', () => {
    const { container } = render(<PlateIV />)
    const cards = Array.from(container.querySelectorAll('div')).filter((el) =>
      el.className.includes('w-[118px]'),
    )
    expect(cards).toHaveLength(7)
  })

  it('renders the dashed route line behind the stations', () => {
    const { container } = render(<PlateIV />)
    const route = Array.from(container.querySelectorAll('div')).find(
      (el) => el.className.includes('border-dashed') && el.className.includes('border-gold/55'),
    )
    expect(route).toBeDefined()
  })

  it('fills only the terminus (Output) dot gold', () => {
    const { container } = render(<PlateIV />)
    const dots = Array.from(container.querySelectorAll('div')).filter((el) =>
      el.className.includes('w-[15px]'),
    )
    expect(dots).toHaveLength(7)
    expect(dots.filter((el) => el.className.includes('bg-gold'))).toHaveLength(1)
    expect(dots[6]?.className).toContain('bg-gold')
  })

  it('renders the survey footer with the token scale bar', () => {
    render(<PlateIV />)
    expect(screen.getByText('SURVEYED MMXXVI · THE ATLAS')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('100 TOKENS')).toBeInTheDocument()
  })
})
