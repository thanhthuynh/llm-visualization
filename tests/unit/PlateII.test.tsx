import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlateII } from '@/plates/PlateII'

describe('PlateII', () => {
  it('renders the title row verbatim', () => {
    render(<PlateII />)
    expect(screen.getByText('PLATE II')).toBeInTheDocument()
    expect(screen.getByText('Standing Orders')).toBeInTheDocument()
    expect(screen.getByText('SUBJECT · SYSTEM')).toBeInTheDocument()
  })

  it('renders the lede', () => {
    render(<PlateII />)
    expect(
      screen.getByText(/the model reads its standing orders — a hidden brief, pinned first/),
    ).toBeInTheDocument()
  })

  it('renders the pinned system message and quote verbatim', () => {
    render(<PlateII />)
    expect(screen.getByText('THE ORDER OF READING')).toBeInTheDocument()
    expect(screen.getByText('SYSTEM · PINNED')).toBeInTheDocument()
    expect(screen.getByText('“You are a careful guide to language models…”')).toBeInTheDocument()
  })

  it('renders the conversation stack in reading order', () => {
    render(<PlateII />)
    expect(screen.getAllByText('USER')).toHaveLength(2)
    expect(screen.getByText('ASSISTANT')).toBeInTheDocument()
    expect(screen.getByText('What is a context window?')).toBeInTheDocument()
    expect(screen.getByText('It is the span of tokens held in view…')).toBeInTheDocument()
    expect(screen.getByText('And how does retrieval help?')).toBeInTheDocument()
    expect(
      screen.getByText(
        'The orders sit beneath every exchange. The reader never sees them — only their effect.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the six order entries with glosses', () => {
    const { container } = render(<PlateII />)
    expect(screen.getByText('WHAT THE ORDERS SET')).toBeInTheDocument()
    for (const term of ['Role', 'Voice & Tone', 'Boundaries', 'Tools', 'Format', 'Knowledge']) {
      expect(screen.getByText(term)).toBeInTheDocument()
    }
    expect(screen.getByText('— who the model acts as.')).toBeInTheDocument()
    expect(screen.getByText('— facts and context to assume.')).toBeInTheDocument()
    // Six gold ring bullets, one per entry.
    expect(container.querySelectorAll('[class*="border-[1.5px]"]')).toHaveLength(6)
  })

  it('renders the token-cost callout', () => {
    render(<PlateII />)
    expect(screen.getByText('COST · 412 TOKENS')).toBeInTheDocument()
    expect(
      screen.getByText(
        'The orders occupy the first stretch of the context window — small, but always present.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the footer credits', () => {
    render(<PlateII />)
    expect(screen.getByText('SURVEYED MMXXVI · THE ATLAS')).toBeInTheDocument()
    expect(screen.getByText('READ FIRST · EVERY TURN')).toBeInTheDocument()
  })
})
