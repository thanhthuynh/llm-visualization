import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DepthProvider, useDepth } from '@/app/DepthContext'

function Probe() {
  const { globalDepth, setGlobalDepth } = useDepth()
  return (
    <div>
      <span data-testid="depth">{globalDepth}</span>
      <button onClick={() => setGlobalDepth(globalDepth === 'surface' ? 'deep' : 'surface')}>toggle</button>
    </div>
  )
}

describe('DepthContext', () => {
  it('defaults to surface', () => {
    render(<DepthProvider><Probe /></DepthProvider>)
    expect(screen.getByTestId('depth')).toHaveTextContent('surface')
  })

  it('toggles to deep and back', async () => {
    const user = userEvent.setup()
    render(<DepthProvider><Probe /></DepthProvider>)
    await user.click(screen.getByRole('button', { name: 'toggle' }))
    expect(screen.getByTestId('depth')).toHaveTextContent('deep')
    await user.click(screen.getByRole('button', { name: 'toggle' }))
    expect(screen.getByTestId('depth')).toHaveTextContent('surface')
  })

  it('throws if useDepth is used outside the provider', () => {
    expect(() => render(<Probe />)).toThrow(/DepthProvider/)
  })
})
