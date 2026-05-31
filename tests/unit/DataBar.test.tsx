import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DataBar } from '@/components/DataBar'

describe('DataBar', () => {
  it('renders label and value', () => {
    render(<DataBar label="blue" value="71%" fraction={0.71} />)
    expect(screen.getByText('blue')).toBeInTheDocument()
    expect(screen.getByText('71%')).toBeInTheDocument()
  })
  it('sets the fill width to the fraction percentage', () => {
    render(<DataBar label="blue" value="71%" fraction={0.71} />)
    expect(screen.getByTestId('databar-fill').style.width).toBe('71%')
  })
  it('uses bar-inactive color when not dominant', () => {
    render(<DataBar label="not" value="6%" fraction={0.06} />)
    const fill = screen.getByTestId('databar-fill')
    expect(fill.style.backgroundColor.toLowerCase()).toBe('rgb(74, 74, 92)')
  })
  it('applies accent + glow when dominant', () => {
    render(<DataBar label="blue" value="71%" fraction={0.71} dominant accent="predict" />)
    const fill = screen.getByTestId('databar-fill')
    expect(fill.style.backgroundColor.toLowerCase()).toBe('rgb(157, 78, 221)')
    expect(fill.style.boxShadow).toContain('rgba(157, 78, 221')
  })
  it('exposes value via aria-valuenow for screen readers', () => {
    render(<DataBar label="blue" value="71%" fraction={0.71} />)
    const bar = screen.getByRole('progressbar', { name: 'blue' })
    expect(bar).toHaveAttribute('aria-valuenow', '71')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })
})
