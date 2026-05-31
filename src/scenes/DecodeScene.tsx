import { useState } from 'react'
import { SceneStation } from '@/components/SceneStation'
import { Chip } from '@/components/Chip'
import { CaveatNote } from '@/components/CaveatNote'
import { DistributionPair } from '@/components/DistributionPair'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { getSceneById } from '@/scenes/scenes.config'

const SCENE = getSceneById('decode')

const PEAKED = {
  label: 'T = 0.2 (PEAKED)',
  bars: [
    { token: 'blue', p: 0.9 },
    { token: 'not', p: 0.05 },
    { token: 'the', p: 0.03 },
    { token: 'a', p: 0.02 },
  ],
} as const

const FLATTER = {
  label: 'T = 1.4 (FLATTER)',
  bars: [
    { token: 'blue', p: 0.34 },
    { token: 'not', p: 0.22 },
    { token: 'the', p: 0.18 },
    { token: 'a', p: 0.14 },
    { token: 'very', p: 0.12 },
  ],
} as const

export function DecodeScene() {
  const [temperature, setTemperature] = useState(1)

  const stage = (
    <div style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      <EyebrowLabel>One token at a time</EyebrowLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Chip variant="token">The</Chip>
        <Chip variant="token">·sky</Chip>
        <Chip variant="token">·is</Chip>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18 }}>+</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Chip variant="token">·blue</Chip>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--color-text-muted)',
            }}
          >
            ↑ just chosen
          </span>
        </div>
      </div>
      <div
        style={{
          padding: '10px 14px',
          background: 'var(--color-surface-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--color-text-muted)',
        }}
      >
        the model · predict next token
      </div>
      <Chip variant="example">Updated: &ldquo;The sky is blue&rdquo;</Chip>
      <div
        style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)' }}
      >
        feeds back in →
      </div>
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--color-text-muted)',
        }}
      >
        <span aria-hidden="true">↻</span>
        <span>loop until done</span>
      </div>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>The autoregressive loop</EyebrowLabel>
      <p style={{ marginTop: 12 }}>
        The model writes the reply token by token. It chooses, appends, and runs the network again
        to pick the next token. Repeat until done.
      </p>
    </>
  )

  const deeper = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <EyebrowLabel>Temperature reshapes the odds</EyebrowLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label
          htmlFor="decode-temperature"
          style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}
        >
          Temperature:{' '}
          <span style={{ fontFamily: 'var(--font-mono)' }}>{temperature.toFixed(1)}</span>
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
          }}
        >
          <span>sharp &amp; predictable</span>
          <span>flat &amp; random</span>
        </div>
      </div>
      <DistributionPair left={PEAKED} right={FLATTER} accent="decode" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <EyebrowLabel>More sampling controls</EyebrowLabel>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'max-content 1fr',
            columnGap: 16,
            rowGap: 6,
            fontFamily: 'var(--font-body)',
            fontSize: 13,
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)' }}>top-k = 40</span>
          <span style={{ color: 'var(--color-text-muted)' }}>
            only the 40 likeliest tokens are eligible
          </span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>top-p = 0.9</span>
          <span style={{ color: 'var(--color-text-muted)' }}>
            keep the smallest set covering 90% of probability
          </span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>&lt;eos&gt;</span>
          <span style={{ color: 'var(--color-text-muted)' }}>
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
