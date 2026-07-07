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
})
