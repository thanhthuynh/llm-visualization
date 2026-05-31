import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TokenizeScene } from '@/scenes/TokenizeScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

function renderScene() {
  return render(
    <RunningExampleProvider>
      <DepthProvider>
        <TokenizeScene />
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('TokenizeScene', () => {
  it('renders the heading at level 2', () => {
    renderScene()
    expect(screen.getByRole('heading', { level: 2, name: /tokenization/i })).toBeInTheDocument()
  })

  it('shows the FROM TEXT TO TOKENS eyebrow', () => {
    renderScene()
    expect(screen.getByText(/from text to tokens/i)).toBeInTheDocument()
  })

  it('renders the three token chips for The / sky / is', () => {
    renderScene()
    // The chip text is rendered with leading-space markers; assert each chip is present.
    expect(screen.getByText(/^The$/)).toBeInTheDocument()
    expect(screen.getByText(/·sky/)).toBeInTheDocument()
    expect(screen.getByText(/·is/)).toBeInTheDocument()
  })

  it('exposes the motion group container by data-testid', () => {
    renderScene()
    expect(screen.getByTestId('tokens-group')).toBeInTheDocument()
  })

  it('hides token IDs in surface and reveals them in Deep', async () => {
    renderScene()
    expect(screen.queryByText('464')).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText('464')).toBeInTheDocument()
    expect(screen.getByText('6766')).toBeInTheDocument()
    expect(screen.getByText('318')).toBeInTheDocument()
  })

  it('shows the mid-word split illustration in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    // 'Tokenization' appears as the h2 heading; the illustration adds a
    // separate 'tokenization' span. Both count toward at-least-one.
    expect(screen.getAllByText(/^tokenization$/i).length).toBeGreaterThanOrEqual(1)
    // The split pieces are standalone cells — anchored regex makes them unique.
    expect(screen.getByText(/^token$/i)).toBeInTheDocument()
    expect(screen.getByText(/^ization$/i)).toBeInTheDocument()
  })

  it('shows the CaveatNote about different tokenizers in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const note = screen.getByRole('note')
    expect(note.textContent?.toLowerCase()).toMatch(/different models|tokenize|claude|chatgpt/)
  })
})
