import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { AtlasNavProvider } from '@/app/AtlasNav'
import { HomePlate } from '@/plates/HomePlate'

function renderHome(go = vi.fn()) {
  return {
    go,
    ...render(
      <AtlasNavProvider value={{ active: 'home', go }}>
        <HomePlate />
      </AtlasNavProvider>,
    ),
  }
}

/** Accessible name → expected hash href, one per hero map station label. */
const STATION_LINKS: ReadonlyArray<[string, string]> = [
  ['PLATE I Context Window', '#/plate-i'],
  ['PLATE II System Prompt', '#/plate-ii'],
  ['PLATE III Retrieval · RAG', '#/plate-iii'],
  ['PLATE IV The Pipeline', '#/plate-iv'],
  ['PLATE V Agents', '#/plate-v'],
  ['PLATE VI Subagents', '#/plate-vi'],
  ['PLATE VII Loops', '#/plate-vii'],
]

describe('HomePlate — hero route map', () => {
  it('renders the kicker, title, stat block, and sub verbatim', () => {
    renderHome()
    expect(screen.getByText('CHART NO. 01 — THE TERRITORY · VOL. I–II')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: 'An atlas of language models' }),
    ).toBeInTheDocument()
    // Stat block uses non-breaking spaces and <br> separators, as in the reference.
    expect(
      screen.getByText(
        (_, element) =>
          element?.textContent === 'VII PLATESII VOLUMESSCALE 1:24,000' &&
          element.childElementCount === 2,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'From the boundaries of a context window to the autonomous loops of an agent — the whole territory of a modern LLM, charted as one map.',
      ),
    ).toBeInTheDocument()
  })

  it('charts exactly seven station labels linking to their plates', () => {
    renderHome()
    expect(screen.getAllByRole('link')).toHaveLength(STATION_LINKS.length)
    for (const [name, href] of STATION_LINKS) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
    }
  })

  it('navigates through the shared go action when a station is clicked', () => {
    const { go } = renderHome()
    fireEvent.click(screen.getByRole('link', { name: 'PLATE I Context Window' }))
    expect(go).toHaveBeenCalledWith('plate-i')
    fireEvent.click(screen.getByRole('link', { name: 'PLATE V Agents' }))
    expect(go).toHaveBeenCalledWith('plate-v')
  })

  it('draws the seven-stroke route network on the 1088×600 canvas', () => {
    const { container } = renderHome()
    const svg = container.querySelector('svg[viewBox="0 0 1088 600"]')
    expect(svg).not.toBeNull()
    expect(svg?.querySelectorAll('polyline, line')).toHaveLength(7)
  })

  it('labels the volumes, the north arrow, and the legend row', () => {
    renderHome()
    expect(screen.getByText('FOUNDATIONS')).toBeInTheDocument()
    expect(screen.getByText('AGENTS')).toBeInTheDocument()
    expect(screen.getByText('N↑')).toBeInTheDocument()
    for (const item of [
      '◦ PLATE STATION',
      '◇ GATEWAY',
      '— — ROUTE',
      '▸ FOUNDATIONS LEAD TO AGENTS',
      'SOUNDINGS IN TOKENS',
    ]) {
      expect(screen.getByText(item)).toBeInTheDocument()
    }
  })
})
