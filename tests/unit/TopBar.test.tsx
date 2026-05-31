import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TopBar } from '@/components/TopBar'

describe('TopBar', () => {
  it('shows the wordmark', () => {
    render(<TopBar prompt="The sky is" />)
    expect(screen.getByText(/inside an llm/i)).toBeInTheDocument()
  })
  it('shows the running-example pill driven by the active scene prompt', () => {
    render(<TopBar prompt="The cat sat down because it was tired" />)
    expect(screen.getByText(/the cat sat down because it was tired/i)).toBeInTheDocument()
    expect(screen.getByText(/prompt/i)).toBeInTheDocument()
  })
})
