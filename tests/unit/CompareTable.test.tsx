import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CompareTable } from '@/components/CompareTable'

const rows = [
  { label: 'Claude Opus 4.8', value: 'Opus family', tier: 'a' as const },
  { label: 'GPT-5.5 Thinking', value: 'GPT family', tier: 'a' as const },
]

describe('CompareTable', () => {
  it('renders each row with a label, value, and tier badge', () => {
    render(<CompareTable rows={rows} caption="lineup" />)
    expect(screen.getByText('Claude Opus 4.8')).toBeInTheDocument()
    expect(screen.getByText('GPT-5.5 Thinking')).toBeInTheDocument()
    expect(screen.getAllByText(/family/i).length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('(a)').length).toBe(2)
  })

  it('renders a table with the given caption for screen readers', () => {
    render(<CompareTable rows={rows} caption="Model lineup" />)
    expect(screen.getByRole('table', { name: /model lineup/i })).toBeInTheDocument()
  })
})
