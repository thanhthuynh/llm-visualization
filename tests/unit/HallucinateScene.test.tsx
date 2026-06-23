import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HallucinateScene } from '@/scenes/HallucinateScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'
import { SceneNavProvider } from '@/app/SceneNavContext'
import { loadHallucinationCase } from '@/data/loader'

function renderScene() {
  return render(
    <RunningExampleProvider>
      <DepthProvider>
        <SceneNavProvider ids={[]} goTo={() => {}}>
          <HallucinateScene />
        </SceneNavProvider>
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('HallucinateScene', () => {
  it('renders surface text (verbatim excerpt)', () => {
    renderScene()
    expect(screen.getByText(/plausible-sounding text/i)).toBeInTheDocument()
  })

  it('stage: Sydney DataBar is dominant — progressbar with name /Sydney/ has aria-valuenow=46', () => {
    renderScene()
    const sydneyBar = screen.getByRole('progressbar', { name: /Sydney/i })
    expect(sydneyBar).toHaveAttribute('aria-valuenow', '46')
  })

  it('stage: truth marker "✓ truth" is co-located with the Canberra bar row', () => {
    const hc = loadHallucinationCase()
    renderScene()
    // The truth token is hc.truth (" Canberra"). Each token row is a flex div wrapping DataBar + badge.
    // Find the progressbar labelled "Canberra", then walk up to its row container and assert
    // the badge lives inside that same container — not next to Melbourne or Sydney.
    const truthLabel = hc.truth.trim() // "Canberra"
    const canberraBar = screen.getByRole('progressbar', { name: new RegExp(truthLabel, 'i') })
    // The row wrapper is the flex div that contains both the DataBar and the ✓ truth badge.
    // Walking up: progressbar → DataBar root → flex-1 div → row div (parent of flex-1 + badge).
    const rowContainer = canberraBar.closest('.flex.items-center.gap-2')
    expect(rowContainer).not.toBeNull()
    expect(within(rowContainer as HTMLElement).getByText(/✓ truth/i)).toBeInTheDocument()
  })

  it('stage: Sydney fraction > Canberra fraction (from loadHallucinationCase())', () => {
    const hc = loadHallucinationCase()
    const sydney = hc.nextToken.find((c) => c.token.trim() === 'Sydney')
    const canberra = hc.nextToken.find(
      (c) => c.token.trim().toLowerCase() === hc.truth.trim().toLowerCase(),
    )
    expect(sydney).toBeDefined()
    expect(canberra).toBeDefined()
    expect(sydney!.p).toBeGreaterThan(canberra!.p)
  })

  it('stage: caption "The model scores plausibility, not truth."', () => {
    renderScene()
    expect(screen.getByText(/The model scores plausibility, not truth\./i)).toBeInTheDocument()
  })

  it('Deep: failure gallery shows "court filing" and "2023" and tier-a badge', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/court filing.*cases that never existed/i)).toBeInTheDocument()
    expect(screen.getByText(/2023/)).toBeInTheDocument()
    // tier-a badge renders "(a)" text
    expect(screen.getAllByText('(a)').length).toBeGreaterThan(0)
  })

  it('Deep: "what reduces it" section mentions RAG', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/RAG \(earlier in this act\)/i)).toBeInTheDocument()
  })

  it('Deep: CaveatNote "Frontier models hallucinate far less than GPT-2 small"', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(
      screen.getByText(/Frontier models hallucinate far less than GPT-2 small/i),
    ).toBeInTheDocument()
  })

  it('NO "measured" claim anywhere in the rendered body', () => {
    const { container } = renderScene()
    expect(container.textContent).not.toMatch(/\bmeasured\b/i)
  })

  it('has unique landmark label — section#hallucinate with aria-labelledby="hallucinate-title"', () => {
    renderScene()
    const section = document.getElementById('hallucinate')
    expect(section).not.toBeNull()
    expect(section!.tagName.toLowerCase()).toBe('section')
    expect(section!.getAttribute('aria-labelledby')).toBe('hallucinate-title')
  })
})
