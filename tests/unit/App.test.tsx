import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Site } from '@/App'
import { SECTION_IDS, SECTIONS } from '@/plates/plates.config'

describe('Site — Atlas shell', () => {
  it('renders all 11 sections with canonical ids in scroll order', () => {
    const { container } = render(<Site />)
    const sections = Array.from(container.querySelectorAll('section[id]'))
    expect(sections.map((s) => s.id)).toEqual([...SECTION_IDS])
  })

  it('gives every section landmark a unique aria-label', () => {
    const { container } = render(<Site />)
    const labels = Array.from(container.querySelectorAll('section[id]')).map((s) =>
      s.getAttribute('aria-label'),
    )
    expect(labels).toEqual(SECTIONS.map((s) => s.title))
    expect(new Set(labels).size).toBe(labels.length)
  })

  it('renders a single main landmark and a skip link', () => {
    const { container } = render(<Site />)
    expect(container.querySelectorAll('main')).toHaveLength(1)
    expect(container.querySelector('a.skip-link')).not.toBeNull()
  })

  it('renders the three volume dividers in order between section groups', () => {
    const { container } = render(<Site />)
    const dividers = Array.from(container.querySelectorAll('main > div[aria-hidden="true"]'))
    expect(dividers.map((d) => d.textContent)).toEqual([
      'VOLUME I · FOUNDATIONS',
      'VOLUME II · AGENTS',
      'APPENDIX · REFERENCE',
    ])
  })

  it('renders the sticky header with brand and CHARTS · GLOSSARY · ABOUT nav', () => {
    render(<Site />)
    const header = within(screen.getByRole('banner'))
    expect(header.getByText('The Atlas')).toBeInTheDocument()
    expect(header.getByText('CHARTS').closest('a')).toHaveAttribute('href', '#/home')
    expect(header.getByText('GLOSSARY').closest('a')).toHaveAttribute('href', '#/gazetteer')
    expect(header.getByText('ABOUT').closest('a')).toHaveAttribute('href', '#/about')
  })

  it('renders the station rail with 11 stations and group captions', () => {
    render(<Site />)
    const rail = screen.getByLabelText('Stations')
    const inRail = within(rail)
    expect(rail.querySelectorAll('a[data-route]')).toHaveLength(SECTION_IDS.length)
    expect(inRail.getByText('VOLUME I')).toBeInTheDocument()
    expect(inRail.getByText('VOLUME II')).toBeInTheDocument()
    expect(inRail.getByText('REFERENCE')).toBeInTheDocument()
    expect(inRail.getByText('IV·D · SOUNDED')).toBeInTheDocument()
  })

  it('marks the CHARTS nav item active for the initial home section', () => {
    render(<Site />)
    const header = within(screen.getByRole('banner'))
    expect(header.getByText('CHARTS').closest('a')).toHaveAttribute('aria-current', 'true')
    expect(header.getByText('GLOSSARY').closest('a')).not.toHaveAttribute('aria-current')
  })
})
