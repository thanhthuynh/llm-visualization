import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmbedScene } from '@/scenes/EmbedScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

function renderScene() {
  return render(
    <RunningExampleProvider>
      <DepthProvider>
        <EmbedScene />
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('EmbedScene', () => {
  it('renders the heading', () => {
    renderScene()
    expect(screen.getByRole('heading', { level: 2, name: /embeddings/i })).toBeInTheDocument()
  })

  it("shows the 'A SPACE OF MEANING' eyebrow", () => {
    renderScene()
    expect(screen.getByText(/space of meaning/i)).toBeInTheDocument()
  })

  it('renders illustrative dots in the meaning space', () => {
    renderScene()
    expect(screen.getByTestId('embedding-dot-sky')).toBeInTheDocument()
    expect(screen.getByTestId('embedding-dot-cat')).toBeInTheDocument()
  })

  it('reveals the contextual-shift dot in Deep', async () => {
    renderScene()
    expect(screen.queryByTestId('embedding-shift-shifted')).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByTestId('embedding-shift-shifted')).toBeInTheDocument()
  })

  it('reveals the dim row in Deep with 768-4096 dims + 2D projection + position info', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/768.*4096/i)).toBeInTheDocument()
    expect(screen.getByText(/2D = projection/i)).toBeInTheDocument()
    expect(screen.getByText(/\+ position/i)).toBeInTheDocument()
  })

  it('shows a CaveatNote about king-man+woman in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const note = screen.getByRole('note')
    expect(note.textContent?.toLowerCase()).toMatch(/king.*man.*woman|word2vec|older idea/i)
  })
})
