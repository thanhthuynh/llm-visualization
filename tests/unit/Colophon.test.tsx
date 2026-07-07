import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { AtlasNavProvider } from '@/app/AtlasNav'
import { ColophonPlate } from '@/plates/Colophon'

function renderColophon(go = vi.fn()) {
  return {
    go,
    ...render(
      <AtlasNavProvider value={{ active: 'about', go }}>
        <ColophonPlate />
      </AtlasNavProvider>,
    ),
  }
}

/** Accessible name → expected hash href, one per IN THIS EDITION row. */
const EDITION_LINKS: ReadonlyArray<[string, string]> = [
  ['PL. I The Boundaries of Memory', '#/plate-i'],
  ['PL. II Standing Orders', '#/plate-ii'],
  ['PL. III Bearings from Afar', '#/plate-iii'],
  ['PL. IV The Inference Passage', '#/plate-iv'],
  ['PL. V The Self-Directed Survey', '#/plate-v'],
  ['PL. VI The Scouting Party', '#/plate-vi'],
  ['PL. VII The Circuit', '#/plate-vii'],
  ['APP. Gazetteer of Terms', '#/gazetteer'],
]

describe('ColophonPlate — about the Atlas', () => {
  it('renders the kicker, title, and premise verbatim', () => {
    renderColophon()
    expect(screen.getByText('CHART NO. 00 — THE COLOPHON')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'About the Atlas' })).toBeInTheDocument()
    expect(
      screen.getByText(/The Atlas treats a language model as territory — a place that can be/),
    ).toBeInTheDocument()
    expect(screen.getByText('THE PREMISE')).toBeInTheDocument()
    expect(
      screen.getByText(/Most explanations of language models reach for mathematics or metaphor/),
    ).toBeInTheDocument()
  })

  it('lists the five-row chart-reading legend', () => {
    renderColophon()
    expect(screen.getByText('HOW TO READ THESE CHARTS')).toBeInTheDocument()
    const rows: ReadonlyArray<[string, string]> = [
      ['◦ STATION', 'A single concept, fixed at a coordinate.'],
      ['— ROUTE', 'The path a process follows, stage to stage.'],
      ['◇ TERMINUS', "Where a route ends — the model's reply."],
      ['DISTANCE', 'On Plate III, nearness means similarity.'],
      ['SOUNDINGS', 'Depths and budgets are measured in tokens.'],
    ]
    for (const [symbol, gloss] of rows) {
      // SOUNDINGS also appears as a colophon-card label; assert presence, not uniqueness.
      expect(screen.getAllByText(symbol).length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText(gloss)).toBeInTheDocument()
    }
  })

  it('renders the colophon card rows with their exact values', () => {
    renderColophon()
    expect(screen.getByText('COLOPHON')).toBeInTheDocument()
    for (const label of ['TYPEFACES', 'PROJECTION', 'VOLUMES', 'EDITION', 'CARTOGRAPHY']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
    expect(screen.getAllByText('SOUNDINGS')).toHaveLength(2)
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'SPAN' &&
          element.textContent === 'Fraunces · HankenSpline Sans Mono',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Transformer')).toBeInTheDocument()
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'SPAN' && element.textContent === 'I FoundationsII Agents',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Tokens')).toBeInTheDocument()
    expect(screen.getByText('First · MMXXVI')).toBeInTheDocument()
    expect(screen.getByText('The Atlas')).toBeInTheDocument()
  })

  it('indexes the edition with eight clickable rows to the right plates', () => {
    renderColophon()
    expect(screen.getByText('IN THIS EDITION')).toBeInTheDocument()
    expect(screen.getByText('VOLUME I · FOUNDATIONS')).toBeInTheDocument()
    expect(screen.getByText('VOLUME II · AGENTS')).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(EDITION_LINKS.length)
    for (const [name, href] of EDITION_LINKS) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
    }
  })

  it('navigates through the shared go action when an index row is clicked', () => {
    const { go } = renderColophon()
    fireEvent.click(screen.getByRole('link', { name: 'APP. Gazetteer of Terms' }))
    expect(go).toHaveBeenCalledWith('gazetteer')
  })

  it('renders the page footer verbatim', () => {
    renderColophon()
    expect(screen.getByText('A FIELD GUIDE TO LANGUAGE MODELS')).toBeInTheDocument()
    expect(screen.getByText('© THE ATLAS · MMXXVI')).toBeInTheDocument()
  })
})
