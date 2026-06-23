import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TopBar } from '@/components/TopBar'
import { getSceneById } from '@/scenes/scenes.config'
import { accentHex } from '@/utils/accent'

describe('TopBar', () => {
  it('shows the wordmark for any scene', () => {
    render(<TopBar scene={getSceneById('predict')} />)
    expect(screen.getByText(/inside an llm/i)).toBeInTheDocument()
  })

  it('shows the scene-aware pill for a prompted scene (predict)', () => {
    render(<TopBar scene={getSceneById('predict')} />)
    // Eyebrow shows the railLabel, not the static "Prompt"
    expect(screen.getByText(/^PREDICT$/)).toBeInTheDocument()
    // Prompt text is present
    expect(screen.getByText(/the sky is/i)).toBeInTheDocument()
    // Eyebrow is accent-tinted
    const eyebrow = screen.getByText(/^PREDICT$/)
    expect(eyebrow).toHaveStyle({ color: accentHex('predict') })
  })

  it('shows a non-empty fallback for a promptless scene (compare)', () => {
    render(<TopBar scene={getSceneById('compare')} />)
    // Pill is still rendered (not hidden), eyebrow = railLabel
    expect(screen.getByText(/^COMPARE$/)).toBeInTheDocument()
    // Fallback content = scene title
    expect(screen.getByText(/claude vs chatgpt/i)).toBeInTheDocument()
  })

  it('shows wordmark-only for prologue (intro) — no pill', () => {
    render(<TopBar scene={getSceneById('intro')} />)
    expect(screen.getByText(/inside an llm/i)).toBeInTheDocument()
    // No pill eyebrow or content should appear
    expect(screen.queryByText(/^INTRO$/)).toBeNull()
    expect(screen.queryByText(/inside an llm: the pill/i)).toBeNull()
  })
})
