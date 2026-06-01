import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CaveatNote } from '@/components/CaveatNote'

describe('CaveatNote', () => {
  it('renders the warning glyph and message as a single note region', () => {
    render(<CaveatNote>numbers are illustrative</CaveatNote>)
    const note = screen.getByRole('note')
    expect(note).toHaveTextContent('numbers are illustrative')
    expect(note.textContent).toMatch(/⚐/)
  })
  it('borders in the amber CaveatNote accent', () => {
    render(<CaveatNote>x</CaveatNote>)
    const note = screen.getByRole('note')
    expect(note.className).toMatch(/border-\(--color-accent-caveat\)/)
  })
})
