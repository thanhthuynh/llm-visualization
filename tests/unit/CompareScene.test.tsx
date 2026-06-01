import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CompareScene } from '@/scenes/CompareScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

function renderScene() {
  return render(
    <RunningExampleProvider>
      <DepthProvider>
        <CompareScene />
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('CompareScene', () => {
  it('renders the heading', () => {
    renderScene()
    expect(screen.getByRole('heading', { level: 2, name: /claude vs chatgpt/i })).toBeInTheDocument()
  })

  it("leads with 'more alike than different' framing", () => {
    renderScene()
    expect(screen.getByText(/more alike than different/i)).toBeInTheDocument()
  })

  it('renders at least three tier badges with data-tier attributes', () => {
    renderScene()
    const badges = screen.getAllByText(/^\([abc]\)$/).filter((el) => el.getAttribute('data-tier'))
    expect(badges.length).toBeGreaterThanOrEqual(3)
  })

  it('renders the context-window comparison with two progressbars', () => {
    renderScene()
    expect(screen.getByText(/context window/i)).toBeInTheDocument()
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThanOrEqual(2)
  })

  it('renders the tokenizer count comparison with illustrative labels', () => {
    renderScene()
    expect(screen.getAllByText(/illustrative/i).length).toBeGreaterThanOrEqual(2)
  })

  it('renders both philosophy cards in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/constitutional ai/i)).toBeInTheDocument()
    expect(screen.getByText(/rlhf/i)).toBeInTheDocument()
  })

  it('renders a CaveatNote about (b)/(c) volatility in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const note = screen.getByRole('note')
    expect(note.textContent?.toLowerCase()).toMatch(/age|volatile|change|tier|month/)
  })

  it('renders a "last updated" footnote with the date in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/last updated.*2026/i)).toBeInTheDocument()
  })

  it('renders the model lineup table in Deep', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByRole('table', { name: /model lineup/i })).toBeInTheDocument()
  })
})
