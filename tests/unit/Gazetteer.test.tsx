import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { AtlasNavProvider } from '@/app/AtlasNav'
import { GazetteerPlate } from '@/plates/Gazetteer'
import { GAZETTEER_ENTRIES } from '@/plates/gazetteer.data'

function renderGazetteer(go = vi.fn()) {
  return {
    go,
    ...render(
      <AtlasNavProvider value={{ active: 'gazetteer', go }}>
        <GazetteerPlate />
      </AtlasNavProvider>,
    ),
  }
}

describe('GazetteerPlate — appendix of terms', () => {
  it('renders the title row and lede verbatim', () => {
    renderGazetteer()
    expect(screen.getByText('APPENDIX')).toBeInTheDocument()
    expect(screen.getByText('Gazetteer of Terms')).toBeInTheDocument()
    expect(screen.getByText('REF · ALL PLATES')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Every place named on these charts, listed in order, with the plate on which it is found.',
      ),
    ).toBeInTheDocument()
  })

  it('renders exactly 17 entries, each a RouteLink to its plate', () => {
    renderGazetteer()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(17)
    expect(GAZETTEER_ENTRIES).toHaveLength(17)
    links.forEach((link, index) => {
      const entry = GAZETTEER_ENTRIES[index]
      expect(entry).toBeDefined()
      if (!entry) return
      expect(link).toHaveAttribute('href', `#/${entry.to}`)
      expect(link).toHaveAttribute('data-route', entry.to)
      expect(within(link).getByText(entry.term)).toBeInTheDocument()
      expect(within(link).getByText(entry.plateRef)).toBeInTheDocument()
      expect(within(link).getByText(entry.definition)).toBeInTheDocument()
    })
  })

  it('keeps the reference copy for spot-checked entries', () => {
    renderGazetteer()
    const contextWindow = screen.getByRole('link', {
      name: 'Context Window PL. I The span of tokens a model can hold in view at once.',
    })
    expect(contextWindow).toHaveAttribute('href', '#/plate-i')
    const iteration = screen.getByRole('link', {
      name: 'Iteration PL. VII One turn of the loop — a single reason–act–observe.',
    })
    expect(iteration).toHaveAttribute('href', '#/plate-vii')
  })

  it('navigates through the shared go action when an entry is clicked', () => {
    const { go } = renderGazetteer()
    fireEvent.click(
      screen.getByRole('link', {
        name: 'Agent PL. V A model given a goal, tools, and a loop to act in.',
      }),
    )
    expect(go).toHaveBeenCalledWith('plate-v')
  })

  it('renders the footer credits with the entry count', () => {
    renderGazetteer()
    expect(screen.getByText('THE ATLAS · COMPLETE IN VII PLATES & APPENDIX')).toBeInTheDocument()
    expect(screen.getByText('17 ENTRIES')).toBeInTheDocument()
  })
})
