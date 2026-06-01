import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TechStack } from '@/landing/TechStack'

describe('TechStack', () => {
  it('renders the spec-locked mono line with every named dependency', () => {
    render(<TechStack />)
    const expected = ['vite', 'react 19', 'typescript 5.7', 'tailwind v4', 'motion', 'd3-scale', 'zod']
    expected.forEach((token) => {
      expect(screen.getByText(new RegExp(token.replace('.', '\\.'), 'i'))).toBeInTheDocument()
    })
  })

  it('renders an H2 "Built with"', () => {
    render(<TechStack />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Built with/i)
  })
})
