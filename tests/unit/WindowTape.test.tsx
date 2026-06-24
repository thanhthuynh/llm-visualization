import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WindowTape } from '@/components/WindowTape'

describe('WindowTape', () => {
  it('renders ruler text', () => {
    render(
      <WindowTape
        ruler="0 — 1,024 tokens · GPT-2 small"
        blocks={[{ label: 'system prompt', tone: 'system' }]}
      />,
    )
    expect(screen.getByText(/0 — 1,024 tokens/)).toBeInTheDocument()
  })

  it('renders block labels', () => {
    render(
      <WindowTape
        ruler="ruler"
        blocks={[
          { label: 'your message', tone: 'you' },
          { label: 'reply so far', tone: 'reply' },
        ]}
      />,
    )
    expect(screen.getByText('your message')).toBeInTheDocument()
    expect(screen.getByText('reply so far')).toBeInTheDocument()
  })

  it('renders overflow marker when overflow=true', () => {
    render(
      <WindowTape
        ruler="ruler"
        blocks={[
          { label: 'oldest', tone: 'system' },
          { label: 'newest', tone: 'you' },
        ]}
        overflow
      />,
    )
    expect(screen.getByText(/oldest tokens gone/i)).toBeInTheDocument()
  })

  it('does NOT render overflow marker when overflow is absent', () => {
    render(<WindowTape ruler="ruler" blocks={[{ label: 'block' }]} />)
    expect(screen.queryByText(/oldest tokens gone/i)).toBeNull()
  })
})
