import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TokenizerCount } from '@/components/TokenizerCount'

const examples = [
  {
    vendor: 'anthropic' as const,
    label: 'Claude (proprietary BPE)',
    prompt: 'The cat sat',
    tokenCount: 4,
    note: 'illustrative',
  },
  {
    vendor: 'openai' as const,
    label: 'GPT (tiktoken)',
    prompt: 'The cat sat',
    tokenCount: 3,
    note: 'illustrative',
  },
]

describe('TokenizerCount', () => {
  it('renders both labels', () => {
    render(<TokenizerCount examples={examples} />)
    expect(screen.getByText(/claude/i)).toBeInTheDocument()
    expect(screen.getByText(/gpt/i)).toBeInTheDocument()
  })

  it('shows the same prompt in each cell', () => {
    render(<TokenizerCount examples={examples} />)
    expect(screen.getAllByText(/The cat sat/i).length).toBeGreaterThanOrEqual(2)
  })

  it('shows the token count for each', () => {
    render(<TokenizerCount examples={examples} />)
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows the illustrative note for each', () => {
    render(<TokenizerCount examples={examples} />)
    expect(screen.getAllByText(/illustrative/i).length).toBeGreaterThanOrEqual(2)
  })
})
