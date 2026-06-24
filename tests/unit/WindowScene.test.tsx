import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WindowScene } from '@/scenes/WindowScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'
import { loadPromptDataset } from '@/data/loader'

function renderScene() {
  return render(
    <RunningExampleProvider>
      <DepthProvider>
        <WindowScene />
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('WindowScene', () => {
  it('renders surface text', () => {
    renderScene()
    expect(screen.getByText(/fixed budget of tokens/i)).toBeInTheDocument()
  })

  it('renders the window tape with overflow marker', () => {
    renderScene()
    expect(screen.getByText(/oldest tokens gone/i)).toBeInTheDocument()
  })

  it('has a unique landmark label', () => {
    renderScene()
    const section = document.querySelector('section#window')
    expect(section).not.toBeNull()
    expect(section!.getAttribute('aria-labelledby')).toBe('window-title')
  })

  it('Deep shows real token count N matching sky dataset', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const skyN = loadPromptDataset('sky').tokens.length
    // The count appears inside a <strong> element within the sentence
    const strong = document.querySelector('strong')
    expect(strong?.textContent).toBe(String(skyN))
  })

  it('Deep shows ContextWindowBar', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0)
  })

  it('Deep shows corrective reframe verbatim', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/it isn.*t memory fading.*it.*s a budget filling/i)).toBeInTheDocument()
  })

  it('Deep shows CaveatNote about frontier memory tricks', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const note = screen.getByRole('note')
    expect(note.textContent).toMatch(/frontier products|memory tricks/i)
  })
})
