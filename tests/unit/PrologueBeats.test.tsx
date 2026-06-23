import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useMotionValue, type MotionValue } from 'motion/react'
import { axe } from 'vitest-axe'
import { BeatHook } from '@/prologue/beats/BeatHook'
import { BeatTokenize } from '@/prologue/beats/BeatTokenize'
import { BeatEmbed } from '@/prologue/beats/BeatEmbed'
import { BeatAttention } from '@/prologue/beats/BeatAttention'
import { BeatPredictOutput } from '@/prologue/beats/BeatPredictOutput'
import { BeatProvenanceVow } from '@/prologue/beats/BeatProvenanceVow'
import { BeatChoosePath } from '@/prologue/beats/BeatChoosePath'
import { DepthProvider, useDepth } from '@/app/DepthContext'
import sky from '@/data/prompts/sky.json'

// Render a beat with a real MotionValue at a fixed progress (no scroll needed).
function ProgressHarness({
  progress,
  children,
}: {
  progress: number
  children: (mv: MotionValue<number>) => ReactNode
}) {
  const mv = useMotionValue(progress)
  return <>{children(mv)}</>
}

function renderBeatAt(
  progress: number,
  Beat: (props: { scrollYProgress: MotionValue<number> }) => ReactNode,
) {
  return render(
    <ProgressHarness progress={progress}>
      {(mv) => <Beat scrollYProgress={mv} />}
    </ProgressHarness>,
  )
}

describe('Prologue beats — content', () => {
  it('BeatHook renders the headline "Inside an LLM" and the prompt', () => {
    const { container } = renderBeatAt(0.05, BeatHook)
    expect(container.textContent).toContain('Inside an LLM')
    expect(container.textContent).toContain('The sky is')
  })

  it('BeatTokenize renders the three token ids 464 / 6766 / 318 from sky.json', () => {
    const { container } = renderBeatAt(0.2, BeatTokenize)
    expect(container.textContent).toContain('464')
    expect(container.textContent).toContain('6766')
    expect(container.textContent).toContain('318')
    // Ids are traced to the dataset, not hardcoded literals that could drift.
    sky.tokens.forEach((t) => {
      expect(container.textContent).toContain(String(t.id))
    })
  })

  it('BeatAttention names the attention targets consistent with the sky.json head row', () => {
    const { container } = renderBeatAt(0.5, BeatAttention)
    expect(container.textContent).toContain('attends to')
  })

  it('BeatProvenanceVow contains the canonical provenance phrasing verbatim', () => {
    const { container } = renderBeatAt(0.78, BeatProvenanceVow)
    expect(container.textContent).toContain('illustrative, not live frontier internals')
    expect(container.textContent).toContain("doesn't pretend to visualize theirs")
  })
})

describe('PROVENANCE GUARD (G1) — BeatPredictOutput numbers come from sky.json', () => {
  it('renders blue at 71% as the dominant candidate', () => {
    const { container } = renderBeatAt(0.65, BeatPredictOutput)
    expect(container.textContent).toContain('71')
    expect(container.textContent).toContain('blue')
  })

  it('does NOT contain the stale seed number 47', () => {
    const { container } = renderBeatAt(0.65, BeatPredictOutput)
    expect(container.textContent).not.toContain('47')
  })

  it('the dominant percentage equals Math.round(sky.nextToken[0].p * 100)', () => {
    const expected = Math.round(sky.nextToken[0]!.p * 100)
    expect(expected).toBe(71)
    const { container } = renderBeatAt(0.65, BeatPredictOutput)
    expect(container.textContent).toContain(String(expected))
  })

  it('renders the assembled output "The sky is blue" and the decode tick', () => {
    const { container } = renderBeatAt(0.65, BeatPredictOutput)
    expect(container.textContent).toContain('The sky is blue')
    expect(container.textContent).toContain('decode → blue')
  })
})

describe('BeatChoosePath — live depth toggle + CTAs', () => {
  it('toggle reflects the shared useDepth() state (deep) rather than a local default', () => {
    const { getByRole } = render(
      <DepthProvider initial="deep">
        <ProgressHarness progress={0.92}>
          {(mv) => <BeatChoosePath scrollYProgress={mv} />}
        </ProgressHarness>
      </DepthProvider>,
    )
    expect(getByRole('button', { name: 'Deep' }).getAttribute('aria-pressed')).toBe('true')
    expect(getByRole('button', { name: 'Surface' }).getAttribute('aria-pressed')).toBe('false')
  })

  it('clicking Deep updates the shared DepthContext (live, not local)', () => {
    function DepthProbe() {
      const { globalDepth } = useDepth()
      return <output data-testid="depth">{globalDepth}</output>
    }
    const { getByRole, getByTestId } = render(
      <DepthProvider initial="surface">
        <DepthProbe />
        <ProgressHarness progress={0.92}>
          {(mv) => <BeatChoosePath scrollYProgress={mv} />}
        </ProgressHarness>
      </DepthProvider>,
    )
    expect(getByTestId('depth').textContent).toBe('surface')
    fireEvent.click(getByRole('button', { name: 'Deep' }))
    expect(getByTestId('depth').textContent).toBe('deep')
  })

  it('defaults to surface when the shared provider starts at surface', () => {
    const { getByRole } = render(
      <DepthProvider initial="surface">
        <ProgressHarness progress={0.92}>
          {(mv) => <BeatChoosePath scrollYProgress={mv} />}
        </ProgressHarness>
      </DepthProvider>,
    )
    expect(getByRole('button', { name: 'Surface' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('primary CTA links #interlude and carries the cta-start-explore umami event', () => {
    const { getByText } = render(
      <DepthProvider>
        <ProgressHarness progress={0.92}>
          {(mv) => <BeatChoosePath scrollYProgress={mv} />}
        </ProgressHarness>
      </DepthProvider>,
    )
    const primary = getByText(/Start with the words/)
    expect(primary.getAttribute('href')).toBe('#interlude')
    expect(primary.getAttribute('data-umami-event')).toBe('cta-start-explore')
  })

  it('secondary CTA links #prompt', () => {
    const { getByText } = render(
      <DepthProvider>
        <ProgressHarness progress={0.92}>
          {(mv) => <BeatChoosePath scrollYProgress={mv} />}
        </ProgressHarness>
      </DepthProvider>,
    )
    expect(getByText(/Skip to the mechanism/).getAttribute('href')).toBe('#prompt')
  })
})

describe('Prologue beats — accessibility', () => {
  it('each beat region exposes a unique landmark label', () => {
    const labels = [
      { beat: BeatHook, label: 'Prologue: hook' },
      { beat: BeatTokenize, label: 'Prologue: tokenize' },
      { beat: BeatEmbed, label: 'Prologue: embed' },
      { beat: BeatAttention, label: 'Prologue: attention' },
      { beat: BeatPredictOutput, label: 'Prologue: predict and output' },
      { beat: BeatProvenanceVow, label: 'Prologue: provenance' },
    ] as const

    const seen = new Set<string>()
    labels.forEach(({ beat, label }) => {
      const { container, unmount } = renderBeatAt(0.5, beat)
      const region = container.querySelector(`section[aria-label="${label}"]`)
      expect(region).not.toBeNull()
      expect(seen.has(label)).toBe(false)
      seen.add(label)
      unmount()
    })
    expect(seen.size).toBe(labels.length)
  })

  it('BeatPredictOutput has no serious/critical axe violations', async () => {
    const { container } = renderBeatAt(0.65, BeatPredictOutput)
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } })
    expect(results).toHaveNoViolations()
  })
})
