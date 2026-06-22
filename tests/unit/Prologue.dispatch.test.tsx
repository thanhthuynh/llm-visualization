import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

// Mock ONLY useScroll + useMotionValueEvent (jsdom has no scroll layout); keep
// the real motion runtime so beats derive their opacity/transform as in production.
vi.mock('motion/react', async () => {
  const actual = await vi.importActual<typeof import('motion/react')>('motion/react')
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: actual.useMotionValue(0) }),
    useMotionValueEvent: () => {},
  }
})

import { Prologue } from '@/prologue/Prologue'
import { DepthProvider } from '@/app/DepthContext'
import { __setReducedMotion } from '../setup'

function renderPrologue(props?: { forceStatic?: boolean }) {
  return render(
    <DepthProvider>
      <Prologue {...props} />
    </DepthProvider>,
  )
}

describe('Prologue dispatcher', () => {
  it('reduced-motion OFF (default) → renders animated tree (.prologue-track present)', () => {
    const { container } = renderPrologue()
    expect(container.querySelector('.prologue-track')).not.toBeNull()
    expect(container.querySelector('.prologue-static')).toBeNull()
  })

  it('__setReducedMotion(true) before render → renders static tree (.prologue-static present)', () => {
    __setReducedMotion(true)
    const { container } = renderPrologue()
    expect(container.querySelector('.prologue-static')).not.toBeNull()
    expect(container.querySelector('.prologue-track')).toBeNull()
  })

  it('forceStatic=true (reduced-motion OFF) → renders static tree', () => {
    const { container } = renderPrologue({ forceStatic: true })
    expect(container.querySelector('.prologue-static')).not.toBeNull()
    expect(container.querySelector('.prologue-track')).toBeNull()
  })
})
