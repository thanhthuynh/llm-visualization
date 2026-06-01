import { useMemo, useState } from 'react'
import { SceneStation } from '@/components/SceneStation'
import { Chip } from '@/components/Chip'
import { CaveatNote } from '@/components/CaveatNote'
import { DistributionPair } from '@/components/DistributionPair'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { softmaxWithTemperature } from '@/utils/softmax'
import { getSceneById } from '@/scenes/scenes.config'

const SCENE = getSceneById('decode')

const DECODE_TOKENS = ['blue', 'not', 'the', 'a', 'very'] as const
const DECODE_LOGITS: ReadonlyArray<number> = [3.0, 1.5, 1.0, 0.5, 0.2]
const BASELINE_T = 1.0

function describeTemperature(t: number): string {
  if (t < 0.7) return 'PEAKED'
  if (t > 1.3) return 'FLATTER'
  return 'BALANCED'
}

interface Distribution {
  label: string
  bars: ReadonlyArray<{ token: string; p: number }>
}

function buildDistribution(t: number, label: string): Distribution {
  const probs = softmaxWithTemperature(DECODE_LOGITS, t)
  return {
    label,
    bars: DECODE_TOKENS.map((token, i) => ({ token, p: probs[i] })),
  }
}

export function DecodeScene() {
  const [temperature, setTemperature] = useState(BASELINE_T)

  const baseline = useMemo(
    () => buildDistribution(BASELINE_T, `T = ${BASELINE_T.toFixed(1)} (BASELINE)`),
    [],
  )
  const live = useMemo(
    () =>
      buildDistribution(
        temperature,
        `T = ${temperature.toFixed(1)} (${describeTemperature(temperature)})`,
      ),
    [temperature],
  )

  const stage = (
    <div className="p-(--stage-padding) flex flex-col gap-6 h-full">
      <EyebrowLabel>One token at a time</EyebrowLabel>
      <div className="flex items-center gap-2.5 flex-wrap">
        <Chip variant="token">The</Chip>
        <Chip variant="token">·sky</Chip>
        <Chip variant="token">·is</Chip>
        <span className="font-mono text-lg">+</span>
        <div className="flex flex-col items-center gap-1">
          <Chip variant="token">·blue</Chip>
          <span className="font-mono text-[11px] text-text-muted">↑ just chosen</span>
        </div>
      </div>
      <div className="px-3.5 py-2.5 bg-surface-card border border-border rounded-card font-body text-[13px] text-text-muted">
        the model · predict next token
      </div>
      <Chip variant="example">Updated: &ldquo;The sky is blue&rdquo;</Chip>
      <div className="font-body text-[13px] text-text-muted">feeds back in →</div>
      <div className="mt-auto flex items-center gap-3 font-mono text-[13px] text-text-muted">
        <span aria-hidden="true">↻</span>
        <span>loop until done</span>
      </div>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>The autoregressive loop</EyebrowLabel>
      <p className="mt-3">
        The model writes the reply token by token. It chooses, appends, and runs the network again
        to pick the next token. Repeat until done.
      </p>
    </>
  )

  const deeper = (
    <div className="flex flex-col gap-4">
      <EyebrowLabel>Temperature reshapes the odds</EyebrowLabel>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="decode-temperature" className="font-body font-semibold text-sm">
          Temperature: <span className="font-mono">{temperature.toFixed(1)}</span>
        </label>
        <input
          id="decode-temperature"
          name="decode-temperature"
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          aria-label="Temperature"
        />
        <div className="flex justify-between font-body text-[11px] text-text-muted">
          <span>sharp &amp; predictable</span>
          <span>flat &amp; random</span>
        </div>
      </div>
      <DistributionPair left={baseline} right={live} accent="decode" />
      <div className="flex flex-col gap-2">
        <EyebrowLabel>More sampling controls</EyebrowLabel>
        <div
          className="grid gap-x-4 gap-y-1.5 font-body text-[13px]"
          style={{ gridTemplateColumns: 'max-content 1fr' }}
        >
          <span className="font-mono">top-k = 40</span>
          <span className="text-text-muted">only the 40 likeliest tokens are eligible</span>
          <span className="font-mono">top-p = 0.9</span>
          <span className="text-text-muted">keep the smallest set covering 90% of probability</span>
          <span className="font-mono">&lt;eos&gt;</span>
          <span className="text-text-muted">
            when the model emits this end-of-sequence token, the loop stops
          </span>
        </div>
      </div>
      <CaveatNote>
        Temperature is a randomness dial, not a creativity or intelligence dial. Lowering it makes
        the model more predictable; raising it makes the model more random — neither makes the model
        smarter.
      </CaveatNote>
    </div>
  )

  return (
    <SceneStation
      id={SCENE.id}
      title={SCENE.title}
      accent="decode"
      stage={stage}
      surface={surface}
      deeper={deeper}
    />
  )
}
