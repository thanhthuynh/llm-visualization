import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PredictScene } from '@/scenes/PredictScene'
import { DepthProvider, type Depth } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

function renderScene(initialDepth: Depth = 'surface') {
  return render(
    <RunningExampleProvider>
      <DepthProvider initial={initialDepth}>
        <PredictScene />
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('PredictScene', () => {
  it('shows 8 probability bars in the visual stage', () => {
    renderScene()
    expect(screen.getAllByRole('progressbar')).toHaveLength(8)
  })
  it('shows " blue" as the dominant candidate at 71%', () => {
    renderScene()
    expect(screen.getByRole('progressbar', { name: 'blue' })).toHaveAttribute('aria-valuenow', '71')
  })
  it('renders the P(next | prompt) header in mono', () => {
    renderScene()
    expect(screen.getByText(/P\(.*next token/i)).toBeInTheDocument()
  })
  it('reveals logits→softmax mini-diagram in Deep', async () => {
    renderScene()
    expect(screen.queryByText(/softmax/i)).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/softmax/i)).toBeInTheDocument()
    expect(screen.getByText('3.1')).toBeInTheDocument()
    expect(screen.getByText('0.71')).toBeInTheDocument()
  })
  it('shows the +50k remainder bar in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/\+50k/i)).toBeInTheDocument()
  })
  it('shows a CaveatNote about illustrative numbers in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const note = screen.getByRole('note')
    expect(note.textContent?.toLowerCase()).toMatch(/illustrative|gpt-2/)
  })
  it('exposes a temperature slider that re-shapes probabilities', () => {
    renderScene()
    const slider = screen.getByRole('slider', { name: /temperature/i })
    expect(slider).toHaveAttribute('min', '0.1')
    expect(slider).toHaveAttribute('max', '2')
    fireEvent.change(slider, { target: { value: '0.2' } })
    const blueBar = screen.getByRole('progressbar', { name: 'blue' })
    expect(Number(blueBar.getAttribute('aria-valuenow'))).toBeGreaterThan(71)
  })
})
