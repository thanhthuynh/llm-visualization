import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SceneNav } from '@/components/SceneNav'

function renderNav(overrides: Partial<{ canPrev: boolean; canNext: boolean }> = {}) {
  const onPrev = vi.fn()
  const onNext = vi.fn()
  render(
    <SceneNav
      onPrev={onPrev}
      onNext={onNext}
      canPrev={overrides.canPrev ?? true}
      canNext={overrides.canNext ?? true}
    />,
  )
  return { onPrev, onNext }
}

describe('SceneNav', () => {
  it('renders the Prev button with primary text color when enabled', () => {
    renderNav({ canPrev: true })
    const prev = screen.getByRole('button', { name: /previous scene/i })
    expect(prev).not.toBeDisabled()
    expect(prev.className).toMatch(/text-text-primary/)
    expect(prev.className).not.toMatch(/text-text-muted/)
  })

  it('renders the Prev button with muted text and disabled when canPrev is false', () => {
    renderNav({ canPrev: false })
    const prev = screen.getByRole('button', { name: /previous scene/i })
    expect(prev).toBeDisabled()
    expect(prev.className).toMatch(/text-text-muted/)
    expect(prev.className).toMatch(/opacity-40/)
  })

  it('keeps Next button disabled state working independently', () => {
    renderNav({ canPrev: true, canNext: false })
    const next = screen.getByRole('button', { name: /next scene/i })
    expect(next).toBeDisabled()
  })
})
