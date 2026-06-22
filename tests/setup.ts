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
