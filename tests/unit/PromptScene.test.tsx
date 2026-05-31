import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PromptScene } from '@/scenes/PromptScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

function renderScene() {
  return render(
    <RunningExampleProvider>
      <DepthProvider>
        <PromptScene />
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('PromptScene', () => {
  it('shows the YOUR PROMPT eyebrow', () => {
    renderScene()
    expect(screen.getByText(/your prompt/i)).toBeInTheDocument()
  })

  it('renders the prompt field with the running example text', () => {
    renderScene()
    // "The sky is" appears in both the PromptField and the example Chip
    expect(screen.getAllByText('The sky is').length).toBeGreaterThanOrEqual(1)
  })

  it('renders both example chips', () => {
    renderScene()
    expect(screen.getByRole('button', { name: /the sky is/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /the cat sat down because it was tired/i }),
    ).toBeInTheDocument()
  })

  it('shows the surface paragraph', () => {
    renderScene()
    expect(screen.getByText(/everything starts with a prompt/i)).toBeInTheDocument()
  })

  it('reveals literal-string and char-count row in Deep', async () => {
    renderScene()
    expect(screen.queryByText(/10 chars/i)).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/10 chars/i)).toBeInTheDocument()
    expect(screen.getByText(/"The sky is"/)).toBeInTheDocument()
  })

  it('renders the heading at level 2 with the scene title', () => {
    renderScene()
    expect(screen.getByRole('heading', { level: 2, name: /prompt input/i })).toBeInTheDocument()
  })
})
