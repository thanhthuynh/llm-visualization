import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SceneStation } from '@/components/SceneStation'
import { DepthProvider } from '@/app/DepthContext'
import { MOTION } from '@/motion/tokens'
import { __setReducedMotion } from '../setup'

// Inline type alias so we don't rely on IntersectionObserverCallback being in
// the ESLint globals list (it isn't in eslint-plugin-globals/browser).
type IOCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void

// Local IntersectionObserver that fires isIntersecting:true immediately when
// observe() is called. Installed only around the motion-path SceneStation tests
// so it does NOT affect useScrollSpy or motion internals in App-level tests.
const originalIO = window.IntersectionObserver
function installFireImmediatelyIO() {
  window.IntersectionObserver = class FireImmediatelyIO {
    private cb: IOCallback
    readonly root: Element | Document | null = null
    readonly rootMargin: string = '0px'
    readonly thresholds: ReadonlyArray<number> = []

    constructor(cb: IOCallback) {
      this.cb = cb
    }

    observe(target: Element) {
      this.cb(
        [{ isIntersecting: true, target, intersectionRatio: 1 } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      )
    }

    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  } as unknown as typeof IntersectionObserver
}
function restoreIO() {
  window.IntersectionObserver = originalIO
}

function renderStation(opts: { withDeeper?: boolean } = {}) {
  return render(
    <DepthProvider>
      <SceneStation
        id="predict"
        title="Next-Token Prediction"
        accent="predict"
        stage={<div data-testid="stage" />}
        surface={<p>surface body</p>}
        {...(opts.withDeeper ? { deeper: <p>deeper body</p> } : {})}
      />
    </DepthProvider>,
  )
}

describe('SceneStation', () => {
  it('renders the visual stage inside a stage frame container', () => {
    renderStation()
    expect(screen.getByTestId('stage').parentElement).toHaveAttribute('data-stage-frame')
  })
  it('renders the title as level-2 heading', () => {
    renderStation()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Next-Token Prediction' }),
    ).toBeInTheDocument()
  })
  it('renders surface text by default', () => {
    renderStation()
    expect(screen.getByText('surface body')).toBeInTheDocument()
  })
  it('does not render a toggle when no deeper content is provided', () => {
    renderStation()
    expect(screen.queryByRole('button', { name: /go deeper/i })).toBeNull()
  })
  it('toggles deep panel open and closed when deeper is provided', async () => {
    renderStation({ withDeeper: true })
    const toggle = screen.getByRole('button', { name: /go deeper/i })
    expect(screen.queryByText('deeper body')).toBeNull()
    await userEvent.click(toggle)
    expect(screen.getByText('deeper body')).toBeInTheDocument()
    expect(toggle).toHaveAccessibleName(/collapse/i)
    await userEvent.click(toggle)
    expect(screen.queryByText('deeper body')).toBeNull()
  })
  it('uses the scene id as the section id (for hash linking)', () => {
    const { container } = renderStation()
    expect(container.querySelector('section')?.id).toBe('predict')
  })

  // --- Entrance animation tests ---

  describe('reduced-motion: instant/visible path', () => {
    beforeEach(() => __setReducedMotion(true))

    it('title and surface content are immediately visible (no hidden initial state)', () => {
      renderStation()
      // With reduced-motion, SceneStation renders plain (non-motion) elements
      // at full opacity — content is present and visible with no hidden initial state.
      expect(screen.getByRole('heading', { level: 2, name: 'Next-Token Prediction' })).toBeVisible()
      expect(screen.getByText('surface body')).toBeVisible()
    })
  })

  describe('motion path: IO mock fires → content is in the document', () => {
    beforeEach(installFireImmediatelyIO)
    afterEach(restoreIO)

    it('title and surface content are present after entrance (IO fires → whileInView triggered)', () => {
      // jsdom does not run CSS transitions, so we assert DOM presence rather than
      // CSS visibility — the brief's documented alternative for jsdom environments.
      // The important guarantee: content is never absent/unmounted; opacity is an
      // animation detail that completes in a real browser.
      renderStation()
      expect(
        screen.getByRole('heading', { level: 2, name: 'Next-Token Prediction' }),
      ).toBeInTheDocument()
      expect(screen.getByText('surface body')).toBeInTheDocument()
    })
  })

  // --- Motion token regression guards ---

  it('MOTION.max is 0.36 (≤360 ms budget guard)', () => {
    expect(MOTION.max).toBe(0.36)
  })

  it('MOTION.stagger is 0.04 (40 ms stagger guard)', () => {
    expect(MOTION.stagger).toBe(0.04)
  })
})
