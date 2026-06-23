import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SystemScene } from '@/scenes/SystemScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

function renderScene() {
  return render(
    <RunningExampleProvider>
      <DepthProvider>
        <SystemScene />
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('SystemScene', () => {
  it('renders surface text', () => {
    renderScene()
    expect(screen.getByText(/before your first word/i)).toBeInTheDocument()
  })

  it('has a unique landmark label', () => {
    renderScene()
    const section = document.querySelector('section#system')
    expect(section).not.toBeNull()
    expect(section!.getAttribute('aria-labelledby')).toBe('system-title')
  })

  it('Deep shows DistributionPair with Python as base top-1', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    // Token labels rendered in DataBar aria-label — token text has a leading space from JSON
    expect(screen.getAllByRole('progressbar', { name: /Python/ }).length).toBeGreaterThan(0)
  })

  it('Deep shows Rust as conditioned top-1', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getAllByRole('progressbar', { name: /Rust/ }).length).toBeGreaterThan(0)
  })

  it('Deep shows tier-a receipt for Anthropic', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/anthropic publishes claude.*system prompts/i)).toBeInTheDocument()
  })

  it('Deep shows tier-c receipt for ChatGPT', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/chatgpt.*only been extracted/i)).toBeInTheDocument()
  })

  it('Deep shows base-model CaveatNote', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    const note = screen.getByRole('note')
    expect(note.textContent).toMatch(/base model|additionally trained/i)
  })

  it('Deep shows mechanism sentence (brief-required)', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/not a special channel/i)).toBeInTheDocument()
  })

  it('does NOT contain "measured" claim (provenance discipline)', async () => {
    const { container } = renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(container.textContent).not.toMatch(/\bmeasured\b/i)
  })
})
