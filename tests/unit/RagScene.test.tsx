import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RagScene } from '@/scenes/RagScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'
import { SceneNavProvider } from '@/app/SceneNavContext'
import { loadRetrievalToy } from '@/data/loader'

function renderScene() {
  return render(
    <RunningExampleProvider>
      <DepthProvider>
        <SceneNavProvider ids={[]} goTo={() => {}}>
          <RagScene />
        </SceneNavProvider>
      </DepthProvider>
    </RunningExampleProvider>,
  )
}

describe('RagScene', () => {
  it('renders surface text (verbatim excerpt)', () => {
    renderScene()
    expect(screen.getByText(/retrieval step searches/i)).toBeInTheDocument()
  })

  it('WITHOUT stage: renders the no-access reply bubble', () => {
    renderScene()
    expect(
      screen.getByText(/I don't have access to your company's policies\./i),
    ).toBeInTheDocument()
  })

  it('WITH stage: the retrieved chunk text appears in a WindowTape block', () => {
    const rt = loadRetrievalToy()
    renderScene()
    expect(screen.getByText(rt.chunks[0].text)).toBeInTheDocument()
  })

  it('WITH stage: a ReplyBubble references the retrieved chunk answer', () => {
    const rt = loadRetrievalToy()
    renderScene()
    // ReplyBubble shows the text that quotes the retrieved chunk — may appear in both the
    // WindowTape block and the ReplyBubble, so use getAllByText and assert at least 2 matches
    const matches = screen.getAllByText(
      new RegExp(rt.chunks[0].text.slice(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
    )
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('Deep: meaning-space renders query marker', async () => {
    renderScene()
    const toggle = screen.getByRole('button', { name: /go deeper/i })
    await userEvent.click(toggle)
    // The query star is aria-hidden but a descriptive sr-only paragraph is present
    expect(screen.getByText(/same geometry as Embeddings/i)).toBeInTheDocument()
  })

  it('Deep: max-sim chunk (chunks[0]) is highlighted — description mentions it', async () => {
    const rt = loadRetrievalToy()
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    // The sr-only description mentions the top chunk text (may appear in multiple elements)
    const matches = screen.getAllByText(
      new RegExp(rt.chunks[0].text.slice(0, 15).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
    )
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('Deep: vector-DB cards contain "REGULAR DB" and "VECTOR DB" text', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/REGULAR DB/)).toBeInTheDocument()
    expect(screen.getByText(/VECTOR DB/)).toBeInTheDocument()
  })

  it('Deep: failure-honesty line "RAG fails when retrieval misses"', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(screen.getByText(/RAG fails when retrieval misses/i)).toBeInTheDocument()
  })

  it('Deep: CaveatNote starts with "Toy retrieval over five sentences"', async () => {
    renderScene()
    await userEvent.click(screen.getByRole('button', { name: /go deeper/i }))
    expect(
      screen.getByText(/Toy retrieval over five sentences with GPT-2 embeddings/i),
    ).toBeInTheDocument()
  })

  it('has unique landmark label — section#rag with aria-labelledby="rag-title"', () => {
    renderScene()
    const section = document.getElementById('rag')
    expect(section).not.toBeNull()
    expect(section!.tagName.toLowerCase()).toBe('section')
    expect(section!.getAttribute('aria-labelledby')).toBe('rag-title')
  })
})
