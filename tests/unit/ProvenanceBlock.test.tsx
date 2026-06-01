import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProvenanceBlock } from '@/landing/ProvenanceBlock'

describe('ProvenanceBlock', () => {
  it('renders an H2 "Where the numbers come from"', () => {
    render(<ProvenanceBlock />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /Where the numbers come from/i,
    )
  })

  it('renders the spec-locked body verbatim (GPT-2 small + illustrative + Claude/ChatGPT)', () => {
    render(<ProvenanceBlock />)
    expect(
      screen.getByText(
        /Every number, embedding, attention weight, and probability on this site comes from GPT-2 small/i,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Claude and ChatGPT don't expose token-level state/i),
    ).toBeInTheDocument()
  })

  it('renders the definition list with model / source / refresh', () => {
    render(<ProvenanceBlock />)
    expect(screen.getByText('model')).toBeInTheDocument()
    expect(screen.getByText('gpt2-small')).toBeInTheDocument()
    expect(screen.getByText('source')).toBeInTheDocument()
    expect(
      screen.getByText(/huggingface\.co\/openai-community\/gpt2/i),
    ).toBeInTheDocument()
    expect(screen.getByText('refresh')).toBeInTheDocument()
  })

  it('renders the build-time commit SHA in the refresh row', () => {
    render(<ProvenanceBlock />)
    expect(screen.getByText(/commit test1234/i)).toBeInTheDocument()
  })

  it('uses a <dl> definition list semantically', () => {
    const { container } = render(<ProvenanceBlock />)
    expect(container.querySelector('dl')).not.toBeNull()
    expect(container.querySelectorAll('dt').length).toBe(3)
    expect(container.querySelectorAll('dd').length).toBe(3)
  })

  it('exposes no CTA inside the provenance section', () => {
    render(<ProvenanceBlock />)
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })
})
