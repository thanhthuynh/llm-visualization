import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { AboutScene } from '@/scenes/AboutScene'
import { RunningExampleProvider } from '@/app/RunningExampleContext'
import { SCENES } from '@/scenes/scenes.config'
import { __setReducedMotion } from '../setup'

const WORDMARK_SCENES = SCENES.filter(
  (s) => s.implemented && (s.part === 'part1' || s.part === 'part2') && s.accent !== null,
)

function renderAbout() {
  return render(
    <RunningExampleProvider>
      <AboutScene />
    </RunningExampleProvider>,
  )
}

describe('AboutScene', () => {
  it('renders a level-2 heading', () => {
    renderAbout()
    expect(screen.getByRole('heading', { level: 2, name: /about/i })).toBeInTheDocument()
  })

  it('names the reference model in plain text', () => {
    renderAbout()
    expect(screen.getAllByText(/GPT-2/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/illustrative/i).length).toBeGreaterThan(0)
  })

  it('explains why live Claude or ChatGPT internals are not shown', () => {
    renderAbout()
    const body = screen.getByTestId('about-body').textContent ?? ''
    expect(body.toLowerCase()).toContain('claude')
    expect(body.toLowerCase()).toContain('chatgpt')
    expect(body.toLowerCase()).toMatch(/cannot|do not expose|not accessible/)
  })

  describe('finale block', () => {
    it('displays the built-with tech string', () => {
      renderAbout()
      expect(
        screen.getByText(
          /vite · react 19 · typescript 5\.7 · tailwind v4 · motion · d3-scale · zod/i,
        ),
      ).toBeInTheDocument()
    })

    it('renders the pipeline wordmark with the correct number of station dots', () => {
      renderAbout()
      const wordmark = screen.getByTestId('about-wordmark')
      const dots = within(wordmark).getAllByRole('img')
      // Each station dot has role="img"; count must match config-derived list
      expect(dots.length).toBe(WORDMARK_SCENES.length)
    })

    it('wordmark dots include expected station aria-labels (spot-check)', () => {
      renderAbout()
      expect(screen.getByRole('img', { name: 'Prompt Input' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Output Assembly' })).toBeInTheDocument()
    })

    it('has a GitHub link with the correct href', () => {
      renderAbout()
      const githubLink = screen.getByRole('link', { name: /github/i })
      expect(githubLink).toHaveAttribute('href', 'https://github.com/thanhthuynh/llm-visualization')
      expect(githubLink).toHaveAttribute('target', '_blank')
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('has an MIT license link with the correct href', () => {
      renderAbout()
      const mitLink = screen.getByRole('link', { name: /mit/i })
      expect(mitLink).toHaveAttribute(
        'href',
        'https://github.com/thanhthuynh/llm-visualization/blob/main/LICENSE',
      )
      expect(mitLink).toHaveAttribute('target', '_blank')
      expect(mitLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('does not contain a dead /explorer CTA link', () => {
      renderAbout()
      expect(screen.queryByText(/launch the explainer/i)).not.toBeInTheDocument()
    })
  })

  describe('reduced-motion: instant/visible path', () => {
    beforeEach(() => __setReducedMotion(true))

    it('heading is immediately visible when reduced-motion is preferred', () => {
      renderAbout()
      expect(screen.getByRole('heading', { level: 2, name: /about/i })).toBeVisible()
    })

    it('about-body is immediately visible when reduced-motion is preferred', () => {
      renderAbout()
      expect(screen.getByTestId('about-body')).toBeVisible()
    })

    it('about-wordmark is immediately visible when reduced-motion is preferred', () => {
      renderAbout()
      expect(screen.getByTestId('about-wordmark')).toBeVisible()
    })

    it('GitHub link is immediately visible when reduced-motion is preferred', () => {
      renderAbout()
      expect(screen.getByRole('link', { name: /github/i })).toBeVisible()
    })
  })
})
