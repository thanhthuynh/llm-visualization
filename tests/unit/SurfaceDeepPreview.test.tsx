import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SurfaceDeepPreview } from '@/landing/SurfaceDeepPreview'

describe('SurfaceDeepPreview', () => {
  it('renders an H2 "Two ways to read it."', () => {
    render(<SurfaceDeepPreview />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Two ways to read it/i)
  })

  it('exposes the segmented toggle as two buttons (Surface / Deep)', () => {
    render(<SurfaceDeepPreview />)
    expect(screen.getByRole('button', { name: /^Surface$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Deep$/i })).toBeInTheDocument()
  })

  it('Surface is selected initially', () => {
    render(<SurfaceDeepPreview />)
    const surfaceBtn = screen.getByRole('button', { name: /^Surface$/i })
    expect(surfaceBtn).toHaveAttribute('aria-pressed', 'true')
  })

  it('clicking Deep flips the selection', async () => {
    render(<SurfaceDeepPreview />)
    const deepBtn = screen.getByRole('button', { name: /^Deep$/i })
    await userEvent.click(deepBtn)
    expect(deepBtn).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /^Surface$/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('renders the spec footnote about choosing depth per-scene', () => {
    render(<SurfaceDeepPreview />)
    expect(
      screen.getByText(/Same scene\. Different depth\. You choose per-scene in the explainer\./i),
    ).toBeInTheDocument()
  })
})
