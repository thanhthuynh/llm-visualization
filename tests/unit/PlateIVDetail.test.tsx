import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { PlateIVDetail } from '@/plates/PlateIVDetail'

function temperatureSlider(): HTMLInputElement {
  return screen.getByLabelText('Temperature') as HTMLInputElement
}

function topPSlider(): HTMLInputElement {
  return screen.getByLabelText('Top-p') as HTMLInputElement
}

describe('PlateIVDetail — The Passage, Sounded', () => {
  it('renders the canonical title row, lede, and worked-example footer', () => {
    render(<PlateIVDetail />)
    expect(screen.getByText('PLATE IV · DETAIL')).toBeInTheDocument()
    expect(screen.getByText('The Passage, Sounded')).toBeInTheDocument()
    expect(screen.getByText('EXAMPLE · 1 PROMPT')).toBeInTheDocument()
    expect(screen.getByText('“What is a token?”')).toBeInTheDocument()
    expect(screen.getByText('WORKED EXAMPLE · THE ATLAS')).toBeInTheDocument()
    expect(screen.getByText('REPEATS ONCE PER TOKEN GENERATED')).toBeInTheDocument()
  })

  it('renders the seven station cards with the worked prompt content', () => {
    render(<PlateIVDetail />)
    for (let n = 1; n <= 7; n++) {
      expect(screen.getByText(`ST. 0${n}`)).toBeInTheDocument()
    }
    // ST. 01 Prompt
    expect(screen.getByText('"What is a token?"')).toBeInTheDocument()
    expect(screen.getByText('raw input · 18 chars')).toBeInTheDocument()
    // ST. 02 Tokenization — chips + BPE ids. 'is'/'a'/'?' also label the
    // attention matrix, so assert the chip render specifically (text-sheet ink).
    for (const text of ['What', 'is', 'a', 'token', '?']) {
      const chips = screen.getAllByText(text).filter((el) => el.className.includes('text-sheet'))
      expect(chips).toHaveLength(1)
    }
    for (const id of ['3923', '374', '264', '4037', '30']) {
      expect(screen.getByText(id)).toBeInTheDocument()
    }
    // ST. 03 Embedding
    expect(screen.getByText(/first 32 of 4096 dims/)).toBeInTheDocument()
    // ST. 04 Attention
    expect(screen.getByText('tokens weigh each other')).toBeInTheDocument()
    expect(screen.getByText('rows attend to columns · causal mask')).toBeInTheDocument()
    // ST. 07 Output
    expect(
      screen.getByText(/A token is the smallest unit of text a model reads/),
    ).toBeInTheDocument()
    expect(screen.getByText('first token · 84 t/s')).toBeInTheDocument()
    // Canvas furniture
    expect(screen.getByText('logits')).toBeInTheDocument()
  })

  it('draws the 32-bar embedding strip and the 5×5 attention matrix', () => {
    const { container } = render(<PlateIVDetail />)
    const dimBars = Array.from(container.querySelectorAll('span')).filter((el) =>
      el.className.includes('w-[9px]'),
    )
    expect(dimBars).toHaveLength(32)
    const attentionCells = Array.from(container.querySelectorAll('span')).filter((el) =>
      el.className.includes('w-[18px]'),
    )
    expect(attentionCells).toHaveLength(25)
  })

  it('draws the single dashed gold connecting polyline', () => {
    const { container } = render(<PlateIVDetail />)
    const polyline = container.querySelector('polyline')
    expect(polyline).not.toBeNull()
    expect(polyline?.getAttribute('points')).toBe(
      '125,58 472,58 891,58 780,293 290,293 215,528 777,528',
    )
    expect(polyline?.getAttribute('stroke-dasharray')).toBe('2 7')
  })

  it('renders the controls with spec ranges and defaults', () => {
    render(<PlateIVDetail />)
    const temp = temperatureSlider()
    expect(temp).toHaveAttribute('min', '0')
    expect(temp).toHaveAttribute('max', '1.5')
    expect(temp).toHaveAttribute('step', '0.05')
    expect(temp.value).toBe('0.7')
    const top = topPSlider()
    expect(top).toHaveAttribute('min', '0.1')
    expect(top).toHaveAttribute('max', '1')
    expect(top).toHaveAttribute('step', '0.05')
    expect(top.value).toBe('0.95')
    expect(screen.getByRole('button', { name: 'SAMPLING' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'GREEDY' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('renders the default distribution (T=0.70, top-p=0.95, sampling)', () => {
    render(<PlateIVDetail />)
    // Readouts
    expect(screen.getByText('0.70')).toBeInTheDocument()
    expect(screen.getByText('0.95')).toBeInTheDocument()
    // Prediction card: ranked rows with 2dp probabilities
    for (const p of ['0.63', '0.23', '0.06', '0.03', '0.02', '0.01']) {
      expect(screen.getByText(p)).toBeInTheDocument()
    }
    for (const tok of ['"The"', '"In"', '"Each"', '"Tokens"', '"Think"']) {
      expect(screen.getByText(tok)).toBeInTheDocument()
    }
    // '"A"' appears in the prediction row and again in the output card.
    expect(screen.getAllByText('"A"')).toHaveLength(2)
    // decodeStr in the prediction subtitle (the chip is a button, this is a span)
    expect(screen.getByText('SAMPLING', { selector: 'span' })).toBeInTheDocument()
    // Nucleus note appears on both the prediction and sampling cards.
    expect(screen.getAllByText('4 tokens in nucleus (top-p)')).toHaveLength(2)
    // Sampling card drawn token
    expect(screen.getByText('→ drawn: "A"')).toBeInTheDocument()
  })

  it('recomputes instantly when temperature slides to 0 (clamped to 0.05)', () => {
    render(<PlateIVDetail />)
    fireEvent.change(temperatureSlider(), { target: { value: '0' } })
    expect(screen.getByText('0.05')).toBeInTheDocument()
    expect(screen.getByText('1.00')).toBeInTheDocument()
    expect(screen.getAllByText('0.00')).toHaveLength(5)
    expect(screen.getAllByText('1 tokens in nucleus (top-p)')).toHaveLength(2)
  })

  it('narrows the nucleus when top-p slides down', () => {
    render(<PlateIVDetail />)
    fireEvent.change(topPSlider(), { target: { value: '0.3' } })
    expect(screen.getAllByText('1 tokens in nucleus (top-p)')).toHaveLength(2)
    fireEvent.change(topPSlider(), { target: { value: '0.65' } })
    expect(screen.getAllByText('2 tokens in nucleus (top-p)')).toHaveLength(2)
  })

  it('switches to greedy decode and back to sampling', () => {
    render(<PlateIVDetail />)
    const greedyChip = screen.getByRole('button', { name: 'GREEDY' })
    fireEvent.click(greedyChip)
    expect(greedyChip).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('GREEDY · argmax')).toBeInTheDocument()
    expect(screen.getAllByText('1 token · greedy decode')).toHaveLength(2)
    // Top-p readout shows the em dash while greedy.
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.getByText('→ drawn: "A"')).toBeInTheDocument()

    const samplingChip = screen.getByRole('button', { name: 'SAMPLING' })
    fireEvent.click(samplingChip)
    expect(samplingChip).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByText('4 tokens in nucleus (top-p)')).toHaveLength(2)
    expect(screen.getByText('0.95')).toBeInTheDocument()
  })
})
