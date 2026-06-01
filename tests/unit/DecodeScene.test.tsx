import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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

  it('shows a baseline (T=1.0) panel alongside a live panel in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/BASELINE/i)).toBeInTheDocument()
    expect(screen.getByText(/BALANCED/i)).toBeInTheDocument()
  })

  it('relabels the live panel as PEAKED and keeps BASELINE when slider goes low', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const slider = screen.getByRole('slider', { name: /temperature/i })
    fireEvent.change(slider, { target: { value: '0.2' } })
    expect(screen.getByText(/BASELINE/i)).toBeInTheDocument()
    expect(screen.getByText(/PEAKED/i)).toBeInTheDocument()
    expect(screen.queryByText(/BALANCED/i)).not.toBeInTheDocument()
  })

  it('relabels the live panel as FLATTER and keeps BASELINE when slider goes high', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const slider = screen.getByRole('slider', { name: /temperature/i })
    fireEvent.change(slider, { target: { value: '1.8' } })
    expect(screen.getByText(/BASELINE/i)).toBeInTheDocument()
    expect(screen.getByText(/FLATTER/i)).toBeInTheDocument()
    expect(screen.queryByText(/BALANCED/i)).not.toBeInTheDocument()
  })

  it('reshapes the live distribution so blue exceeds the baseline at low T', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const slider = screen.getByRole('slider', { name: /temperature/i })
    fireEvent.change(slider, { target: { value: '0.2' } })
    const blueValues = screen
      .getAllByRole('progressbar', { name: 'blue' })
      .map((el) => Number(el.getAttribute('aria-valuenow') ?? 0))
    expect(Math.max(...blueValues)).toBeGreaterThanOrEqual(95)
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
