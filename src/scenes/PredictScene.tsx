import { useMemo, useState } from 'react'
import { SceneStation } from '@/components/SceneStation'
import { DataBar } from '@/components/DataBar'
import { CaveatNote } from '@/components/CaveatNote'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { useRunningExample } from '@/app/RunningExampleContext'
import { getSceneById } from '@/scenes/scenes.config'
import type { NextTokenCandidate } from '@/data/schema'

const SCENE = getSceneById('predict')

function softmax(logits: number[], temperature: number): number[] {
  const t = Math.max(0.01, temperature)
  const scaled = logits.map((l) => l / t)
  const max = Math.max(...scaled)
  const exps = scaled.map((s) => Math.exp(s - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
}

interface ReshapedCandidate extends NextTokenCandidate {
  reshaped: number
}

export function PredictScene() {
  const { dataset } = useRunningExample()
  const [temperature, setTemperature] = useState(1)

  const candidates = useMemo<ReshapedCandidate[]>(() => {
    if (temperature === 1) {
      return dataset.nextToken.map((c) => ({ ...c, reshaped: c.p }))
    }
    const logits = dataset.nextToken.map((c) => c.logit)
    const probs = softmax(logits, temperature)
    return dataset.nextToken.map((c, i) => ({ ...c, reshaped: probs[i] }))
  }, [dataset.nextToken, temperature])

  const dominantIndex = candidates.reduce(
    (best, c, i, arr) => (c.reshaped > arr[best].reshaped ? i : best),
    0,
  )

  const stage = (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <div
        style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--color-text-muted)' }}
      >
        P( next token |{' '}
        <span style={{ color: 'var(--color-text-primary)' }}>&quot;{dataset.prompt}&quot;</span> )
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {candidates.map((c, i) => (
          <DataBar
            key={c.token}
            label={c.token.trim()}
            value={`${Math.round(c.reshaped * 100)}%`}
            fraction={c.reshaped}
            dominant={i === dominantIndex}
            accent="predict"
          />
        ))}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label
          htmlFor="temperature"
          style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}
        >
          Temperature:{' '}
          <span style={{ fontFamily: 'var(--font-mono)' }}>{temperature.toFixed(1)}</span>
        </label>
        <input
          id="temperature"
          name="temperature"
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          aria-label="Temperature"
        />
      </div>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>Next-token prediction</EyebrowLabel>
      <p style={{ marginTop: 12 }}>
        The model produces a probability for every possible next token. Here are the most likely
        few.
      </p>
    </>
  )

  const deeper = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <EyebrowLabel>How the bars are made</EyebrowLabel>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto auto auto',
          columnGap: 16,
          rowGap: 6,
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
        }}
      >
        <span style={{ color: 'var(--color-text-muted)' }}>logits</span>
        <span aria-hidden="true" style={{ color: 'var(--color-text-muted)' }}>
          →
        </span>
        <span style={{ color: 'var(--color-text-muted)' }}>softmax</span>
        <span>3.1</span>
        <span aria-hidden="true" style={{ color: 'var(--color-text-muted)' }}>
          →
        </span>
        <span>0.71</span>
        <span>0.9</span>
        <span aria-hidden="true" style={{ color: 'var(--color-text-muted)' }}>
          →
        </span>
        <span>0.06</span>
        <span>0.4</span>
        <span aria-hidden="true" style={{ color: 'var(--color-text-muted)' }}>
          →
        </span>
        <span>0.04</span>
      </div>
      <div>
        <DataBar label="+50k more" value="≈14%" fraction={0.14} />
      </div>
      <CaveatNote>
        The probabilities are illustrative — taken from a small open reference model (GPT-2 small)
        run offline, not live Claude or ChatGPT internals.
      </CaveatNote>
    </div>
  )

  return (
    <SceneStation
      id={SCENE.id}
      title={SCENE.title}
      accent="predict"
      stage={stage}
      surface={surface}
      deeper={deeper}
    />
  )
}
