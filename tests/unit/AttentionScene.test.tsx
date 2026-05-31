import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AttentionScene } from '@/scenes/AttentionScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

function renderScene() {
  return render(
    <RunningExampleProvider>
      <DepthProvider>
        <AttentionScene />
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('AttentionScene', () => {
  it('renders the heading', () => {
    renderScene()
    expect(screen.getByRole('heading', { level: 2, name: /attention/i })).toBeInTheDocument()
  })

  it('shows the inline Simplified note on the surface', () => {
    renderScene()
    expect(screen.getByText(/simplified/i)).toBeInTheDocument()
    expect(screen.getByText(/go deeper to see/i)).toBeInTheDocument()
  })

  it('renders surface arcs from the it query to earlier tokens', () => {
    renderScene()
    expect(screen.getByTestId('attention-arc-cat')).toBeInTheDocument()
    expect(screen.getByTestId('attention-arc-because')).toBeInTheDocument()
    expect(screen.getByTestId('attention-arc-sat')).toBeInTheDocument()
  })

  it('renders the 8 cat-prompt tokens on the surface', () => {
    renderScene()
    const stageTokens = ['The', 'cat', 'sat', 'down', 'because', 'it', 'was', 'tired']
    stageTokens.forEach((t) =>
      expect(screen.getAllByText(new RegExp(`^${t}$`)).length).toBeGreaterThanOrEqual(1),
    )
  })

  it('renders the 8x8 matrix in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getAllByTestId(/^attention-cell-/)).toHaveLength(64)
  })

  it('renders the head selector in Deep with Head 1 active by default', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByRole('button', { name: /head 1/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders the mechanism row in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/q.k|SCORE/i)).toBeInTheDocument()
    expect(screen.getByText(/softmax/i)).toBeInTheDocument()
    expect(screen.getByText(/Σ.*w.*v|BLEND|VALUES/i)).toBeInTheDocument()
  })

  it('renders TWO CaveatNotes in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const notes = screen.getAllByRole('note')
    expect(notes).toHaveLength(2)
    const allText = notes.map((n) => n.textContent?.toLowerCase() ?? '').join(' | ')
    expect(allText).toMatch(/information.*flow|reasoning|contested/)
    expect(allText).toMatch(/one head|one layer|feed-?forward|dozens/)
  })

  it('switches matrix when a different head is selected', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const before = screen.getByTestId('attention-cell-5-1').getAttribute('fill')
    await userEvent.click(screen.getByRole('button', { name: /head 2/i }))
    const after = screen.getByTestId('attention-cell-5-1').getAttribute('fill')
    expect(after).not.toBe(before)
  })
})
