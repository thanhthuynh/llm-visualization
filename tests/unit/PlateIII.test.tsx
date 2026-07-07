import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlateIII } from '@/plates/PlateIII'

describe('PlateIII', () => {
  it('renders the title row verbatim', () => {
    render(<PlateIII />)
    expect(screen.getByText('PLATE III')).toBeInTheDocument()
    expect(screen.getByText('Bearings from Afar')).toBeInTheDocument()
    expect(screen.getByText('SUBJECT · RETRIEVAL')).toBeInTheDocument()
  })

  it('renders the lede', () => {
    render(<PlateIII />)
    expect(screen.getByText(/retrieval takes bearings on a store of documents/)).toBeInTheDocument()
  })

  it('draws the vector-space survey with 7 bearing lines and 9 nodes', () => {
    const { container } = render(<PlateIII />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('viewBox')).toBe('0 0 760 360')
    // 3 solid near-doc bearings + 4 dashed far-doc bearings.
    expect(svg?.querySelectorAll('line')).toHaveLength(7)
    // Query dot + halo ring + 3 near docs + 4 far docs.
    expect(svg?.querySelectorAll('circle')).toHaveLength(9)
  })

  it('labels the query, near docs, and far docs verbatim', () => {
    render(<PlateIII />)
    expect(screen.getByText('QUERY')).toBeInTheDocument()
    expect(screen.getByText('doc-14 · 0.91')).toBeInTheDocument()
    expect(screen.getByText('doc-22 · 0.84')).toBeInTheDocument()
    expect(screen.getByText('doc-07 · 0.87')).toBeInTheDocument()
    for (const score of ['0.52', '0.47', '0.41', '0.33']) {
      expect(screen.getByText(score)).toBeInTheDocument()
    }
    expect(screen.getByText('VECTOR STORE · 12,400 DOCS')).toBeInTheDocument()
  })

  it('lists the retrieved documents with token sizes and the injected total', () => {
    render(<PlateIII />)
    expect(screen.getByText('RETRIEVED → CONTEXT')).toBeInTheDocument()
    for (const id of ['doc-14', 'doc-07', 'doc-22']) {
      expect(screen.getByText(id)).toBeInTheDocument()
    }
    for (const score of ['0.91', '0.87', '0.84']) {
      expect(screen.getByText(score)).toBeInTheDocument()
    }
    for (const tokens of ['312 TOK', '540 TOK', '352 TOK']) {
      expect(screen.getByText(tokens)).toBeInTheDocument()
    }
    expect(screen.getByText('TOP-3 INJECTED')).toBeInTheDocument()
    expect(screen.getByText('1,204 TOK')).toBeInTheDocument()
  })

  it('renders the five-step retrieval pipeline footer', () => {
    render(<PlateIII />)
    for (const step of [
      'EMBED QUERY',
      'SEARCH STORE',
      'RANK BY DISTANCE',
      'TAKE TOP-3',
      'ANSWER FROM SOURCES',
    ]) {
      expect(screen.getByText(step)).toBeInTheDocument()
    }
    for (const no of ['01', '02', '03', '04', '05']) {
      expect(screen.getByText(no)).toBeInTheDocument()
    }
    // Four gold arrows join the five stations.
    expect(screen.getAllByText('→')).toHaveLength(4)
  })
})
