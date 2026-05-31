import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PredictScene } from '@/scenes/PredictScene'
import { DepthProvider } from '@/app/DepthContext'
import { RunningExampleProvider } from '@/app/RunningExampleContext'

function setReducedMotion(value: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes('reduce') ? value : false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

describe('prefers-reduced-motion', () => {
  beforeEach(() => setReducedMotion(true))

  it('disables databar width transitions when reduce is set', () => {
    render(
      <RunningExampleProvider>
        <DepthProvider>
          <PredictScene />
        </DepthProvider>
      </RunningExampleProvider>,
    )
    const fills = screen.getAllByTestId('databar-fill')
    fills.forEach((f) => expect(f.style.transition).toBe('none'))
  })
})
