import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AssembleScene } from '@/scenes/AssembleScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

function renderScene() {
  return render(
    <RunningExampleProvider>
      <DepthProvider>
        <AssembleScene />
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('AssembleScene', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the heading at level 2', () => {
    vi.useRealTimers()
    renderScene()
    expect(screen.getByRole('heading', { level: 2, name: /output assembly/i })).toBeInTheDocument()
  })

  it('shows the STREAMING THE REPLY eyebrow', () => {
    vi.useRealTimers()
    renderScene()
    expect(screen.getByText(/streaming the reply/i)).toBeInTheDocument()
  })

  it('renders the four output token chips', () => {
    vi.useRealTimers()
    renderScene()
    // Output chips: The, ·sky, ·is, ·blue
    expect(screen.getAllByText(/^The$/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/·sky/)).toBeInTheDocument()
    expect(screen.getByText(/·is/)).toBeInTheDocument()
    expect(screen.getByText(/·blue/)).toBeInTheDocument()
  })

  it('eventually shows the full reply text in the bubble after streaming completes', () => {
    renderScene()
    act(() => {
      vi.advanceTimersByTime(40 * 'The sky is blue'.length + 200)
    })
    expect(screen.getByText('The sky is blue')).toBeInTheDocument()
  })

  it('reveals the detokenize chain in Deep with token ID, bytes, and text', async () => {
    vi.useRealTimers()
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText('318')).toBeInTheDocument()
    expect(screen.getByText(/62 6c 75 65/)).toBeInTheDocument()
    expect(screen.getAllByText(/^blue$/).length).toBeGreaterThanOrEqual(1)
  })

  it('exposes an as-text / as-tokens toggle in Deep with aria-pressed', async () => {
    vi.useRealTimers()
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const asText = screen.getByRole('button', { name: /as text/i })
    const asTokens = screen.getByRole('button', { name: /as tokens/i })
    expect(asText).toHaveAttribute('aria-pressed', 'true')
    expect(asTokens).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(asTokens)
    expect(asTokens).toHaveAttribute('aria-pressed', 'true')
    expect(asText).toHaveAttribute('aria-pressed', 'false')
  })

  it('shows the CaveatNote about one-token-at-a-time in Deep', async () => {
    vi.useRealTimers()
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const note = screen.getByRole('note')
    expect(note.textContent?.toLowerCase()).toMatch(/stored outline|one token at a time|fresh decision/)
  })

  it('shows token chips in Deep when as-tokens view is selected', async () => {
    vi.useRealTimers()
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    await userEvent.click(screen.getByRole('button', { name: /as tokens/i }))
    // The view-toggle scope: when "as tokens" is pressed, the bubble area shows token IDs visible.
    // Check token IDs appear inside the tokens-view region.
    const view = screen.getByTestId('assembly-tokens-view')
    expect(within(view).getByText('464')).toBeInTheDocument()
    expect(within(view).getByText('6766')).toBeInTheDocument()
    expect(within(view).getByText('318')).toBeInTheDocument()
  })
})
