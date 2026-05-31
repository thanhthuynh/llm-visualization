import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SceneStation } from '@/components/SceneStation'
import { DepthProvider } from '@/app/DepthContext'

function renderStation(opts: { withDeeper?: boolean } = {}) {
  return render(
    <DepthProvider>
      <SceneStation
        id="predict"
        title="Next-Token Prediction"
        accent="predict"
        stage={<div data-testid="stage" />}
        surface={<p>surface body</p>}
        {...(opts.withDeeper ? { deeper: <p>deeper body</p> } : {})}
      />
    </DepthProvider>,
  )
}

describe('SceneStation', () => {
  it('renders the visual stage as aria-hidden', () => {
    renderStation()
    expect(screen.getByTestId('stage').parentElement).toHaveAttribute('aria-hidden', 'true')
  })
  it('renders the title as level-2 heading', () => {
    renderStation()
    expect(screen.getByRole('heading', { level: 2, name: 'Next-Token Prediction' })).toBeInTheDocument()
  })
  it('renders surface text by default', () => {
    renderStation()
    expect(screen.getByText('surface body')).toBeInTheDocument()
  })
  it('does not render a toggle when no deeper content is provided', () => {
    renderStation()
    expect(screen.queryByRole('button', { name: /go deeper/i })).toBeNull()
  })
  it('toggles deep panel open and closed when deeper is provided', async () => {
    renderStation({ withDeeper: true })
    const toggle = screen.getByRole('button', { name: /go deeper/i })
    expect(screen.queryByText('deeper body')).toBeNull()
    await userEvent.click(toggle)
    expect(screen.getByText('deeper body')).toBeInTheDocument()
    expect(toggle).toHaveAccessibleName(/collapse/i)
    await userEvent.click(toggle)
    expect(screen.queryByText('deeper body')).toBeNull()
  })
  it('uses the scene id as the section id (for hash linking)', () => {
    const { container } = renderStation()
    expect(container.querySelector('section')?.id).toBe('predict')
  })
})
