import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RunningExampleProvider, useRunningExample } from '@/app/RunningExampleContext'

function Probe() {
  const { dataset, promptId } = useRunningExample()
  return (
    <>
      <span data-testid="id">{promptId}</span>
      <span data-testid="prompt">{dataset.prompt}</span>
      <span data-testid="source">{dataset.source}</span>
    </>
  )
}

describe('RunningExampleContext', () => {
  it('exposes the sky dataset by default', () => {
    render(<RunningExampleProvider><Probe /></RunningExampleProvider>)
    expect(screen.getByTestId('id')).toHaveTextContent('sky')
    expect(screen.getByTestId('prompt')).toHaveTextContent('The sky is')
    expect(screen.getByTestId('source').textContent).toMatch(/illustrative|gpt-2/i)
  })
})
