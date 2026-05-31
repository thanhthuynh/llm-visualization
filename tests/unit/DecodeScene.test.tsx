import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DecodeScene } from '@/scenes/DecodeScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

function renderScene() {
  return render(
    <RunningExampleProvider>
      <DepthProvider>
        <DecodeScene />
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('DecodeScene', () => {
  it('renders the heading at level 2', () => {
    renderScene()
    expect(screen.getByRole('heading', { level: 2, name: /decoding loop/i })).toBeInTheDocument()
  })

  it('shows the ONE TOKEN AT A TIME eyebrow', () => {
    renderScene()
    expect(screen.getByText(/one token at a time/i)).toBeInTheDocument()
  })

  it('shows token chips in the loop UI', () => {
    renderScene()
    // The chips 'The', 'sky', 'is' all render. 'blue' is the newly-chosen token.
    expect(screen.getByText(/just chosen/i)).toBeInTheDocument()
    expect(screen.getByText(/feeds back in/i)).toBeInTheDocument()
  })

  it('shows the surface paragraph', () => {
    renderScene()
    expect(screen.getByText(/one token at a time/i)).toBeInTheDocument()
  })

  it('exposes a temperature slider with the spec range', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const slider = screen.getByRole('slider', { name: /temperature/i })
    expect(slider).toHaveAttribute('min', '0.1')
    expect(slider).toHaveAttribute('max', '2')
  })

  it('shows two side-by-side distributions in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/PEAKED/)).toBeInTheDocument()
    expect(screen.getByText(/FLATTER/)).toBeInTheDocument()
  })

  it('shows the sampling-controls panel (top-k, top-p, eos) in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/top-k/i)).toBeInTheDocument()
    expect(screen.getByText(/top-p/i)).toBeInTheDocument()
    expect(screen.getByText(/eos/i)).toBeInTheDocument()
  })

  it('shows the CaveatNote about randomness vs creativity in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const note = screen.getByRole('note')
    expect(note.textContent?.toLowerCase()).toMatch(/randomness|creativity|intelligence/)
  })
})
