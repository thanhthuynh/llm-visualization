import '@testing-library/jest-dom/vitest'
import { afterEach, expect } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as axeMatchers from 'vitest-axe/matchers'

// Type augmentation for the matcher lives in tests/vitest-axe.d.ts.
expect.extend(axeMatchers)

// Mutable flag for reduced-motion; default false so existing tests are unaffected.
let __reducedMotion = false
export function __setReducedMotion(v: boolean) {
  __reducedMotion = v
}

afterEach(() => {
  cleanup()
  __reducedMotion = false
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: (query: string) => ({
    matches: query.includes('prefers-reduced-motion') ? __reducedMotion : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
})

Element.prototype.scrollIntoView = function () {}

// IntersectionObserver stub: a no-op implementation so jsdom doesn't throw when
// code creates an IO instance (e.g. useScrollSpy). observe/unobserve/disconnect
// are intentional no-ops — the callback is never fired — which is correct for a
// headless environment where no real viewport intersection occurs.
//
// SceneStation.test.tsx installs a LOCAL override (saved/restored around each
// test) that fires isIntersecting:true immediately, allowing whileInView to
// reach its final state without affecting App or a11y tests.
type IOCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void
window.IntersectionObserver = class StubIntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = '0px'
  readonly thresholds: ReadonlyArray<number> = []

  constructor(_cb: IOCallback) {}

  observe(_target: Element) {}
  unobserve(_target: Element) {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
} as unknown as typeof IntersectionObserver
