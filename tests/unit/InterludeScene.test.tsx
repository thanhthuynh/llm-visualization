import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InterludeScene } from '@/scenes/InterludeScene'

function renderInterlude() {
  return render(<InterludeScene />)
}

describe('InterludeScene', () => {
  it('renders the PART 1 eyebrow', () => {
    renderInterlude()
    expect(screen.getByText('PART 1 · AROUND THE MODEL')).toBeInTheDocument()
  })

  it('renders the H2 heading "Around the model."', () => {
    renderInterlude()
    expect(
      screen.getByRole('heading', { level: 2, name: /around the model\./i }),
    ).toBeInTheDocument()
  })

  it('renders the forward lede', () => {
    renderInterlude()
    const lede = screen.getByText(/lives inside a wrapper/i)
    expect(lede).toBeInTheDocument()
    expect(lede.textContent).toContain('seven words')
    expect(lede.textContent).toContain('Part 2')
  })

  it('renders exactly 7 term rows', () => {
    renderInterlude()
    // Each chip is an anchor with an href starting with #
    const chips = screen.getAllByRole('link')
    expect(chips).toHaveLength(7)
  })

  it('has a chip linking to #window', () => {
    renderInterlude()
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('#window')
  })

  it('has a chip linking to #system', () => {
    renderInterlude()
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('#system')
  })

  it('has chips linking to #rag (two rows)', () => {
    renderInterlude()
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs.filter((h) => h === '#rag')).toHaveLength(2)
  })

  it('has a chip linking to #hallucinate', () => {
    renderInterlude()
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('#hallucinate')
  })

  it('has a chip linking to #decode (Temperature → Part 2 forward-ref)', () => {
    renderInterlude()
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('#decode')
  })

  it('has a chip linking to #embed (Embeddings → Part 2 forward-ref)', () => {
    renderInterlude()
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('#embed')
  })

  it('renders all 7 term labels', () => {
    renderInterlude()
    expect(screen.getByText('Context window')).toBeInTheDocument()
    expect(screen.getByText('System prompt')).toBeInTheDocument()
    expect(screen.getByText('Retrieval (RAG)')).toBeInTheDocument()
    expect(screen.getByText('Hallucination')).toBeInTheDocument()
    expect(screen.getByText('Temperature')).toBeInTheDocument()
    expect(screen.getByText('Embeddings')).toBeInTheDocument()
    expect(screen.getByText('Vector database')).toBeInTheDocument()
  })

  it('has a unique landmark label distinct from other scenes', () => {
    renderInterlude()
    const section = document.querySelector('section#interlude')
    expect(section).not.toBeNull()
    expect(section!.getAttribute('aria-labelledby')).toBe('interlude-title')
    const heading = document.getElementById('interlude-title')
    expect(heading).not.toBeNull()
    expect(heading!.textContent).toMatch(/around the model/i)
  })

  it('has no data-umami-event attributes (no analytics event)', () => {
    const { container } = renderInterlude()
    const elementsWithUmami = container.querySelectorAll('[data-umami-event]')
    expect(elementsWithUmami).toHaveLength(0)
  })
})
