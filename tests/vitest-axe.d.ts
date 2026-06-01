/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type */
// `T` is required for declaration merging with Vitest's `Assertion<T>` generic.
import type { AxeMatchers } from 'vitest-axe'
import 'vitest'

declare module 'vitest' {
  interface Assertion<T = unknown> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
