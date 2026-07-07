import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
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

  it('renders the three volume dividers with their labels', () => {
    const { getByText } = render(<Site />)
    expect(getByText('VOLUME I · FOUNDATIONS')).toBeInTheDocument()
    expect(getByText('VOLUME II · AGENTS')).toBeInTheDocument()
    expect(getByText('APPENDIX · REFERENCE')).toBeInTheDocument()
  })

  it('renders the sticky header with brand and CHARTS · GLOSSARY · ABOUT nav', () => {
    const { getByText } = render(<Site />)
    expect(getByText('The Atlas')).toBeInTheDocument()
    expect(getByText('CHARTS').closest('a')).toHaveAttribute('href', '#/home')
    expect(getByText('GLOSSARY').closest('a')).toHaveAttribute('href', '#/gazetteer')
    expect(getByText('ABOUT').closest('a')).toHaveAttribute('href', '#/about')
  })

  it('renders the station rail with 11 stations and group captions', () => {
    const { getByLabelText, getByText } = render(<Site />)
    const rail = getByLabelText('Stations')
    expect(rail.querySelectorAll('a[data-route]')).toHaveLength(SECTION_IDS.length)
    expect(getByText('VOLUME I')).toBeInTheDocument()
    expect(getByText('VOLUME II')).toBeInTheDocument()
    expect(getByText('REFERENCE')).toBeInTheDocument()
    expect(getByText('IV·D · SOUNDED')).toBeInTheDocument()
  })

  it('marks the CHARTS nav item active for the initial home section', () => {
    const { getByText } = render(<Site />)
    expect(getByText('CHARTS').closest('a')).toHaveAttribute('aria-current', 'true')
    expect(getByText('GLOSSARY').closest('a')).not.toHaveAttribute('aria-current')
  })
})
