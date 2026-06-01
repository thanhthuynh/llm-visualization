import { useMemo, useState, type CSSProperties } from 'react'
import { SceneStation } from '@/components/SceneStation'
import { DataBar } from '@/components/DataBar'
import { CaveatNote } from '@/components/CaveatNote'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { useRunningExample } from '@/app/RunningExampleContext'
import { getSceneById } from '@/scenes/scenes.config'
import { accentHex, accentRgba } from '@/utils/accent'
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
    <div className="p-(--stage-padding) flex flex-col gap-4 h-full">
      <div className="font-[family-name:--font-mono] text-[15px] text-(--color-text-muted)">
        P( next token |{' '}
        <span className="text-(--color-text-primary)">&quot;{dataset.prompt}&quot;</span> )
      </div>
      <div className="flex flex-col">
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
      <div className="mt-auto flex flex-col gap-1.5">
        <label
          htmlFor="temperature"
          className="font-[family-name:--font-body] font-semibold text-sm"
        >
          Temperature:{' '}
          <span className="font-[family-name:--font-mono]">{temperature.toFixed(1)}</span>
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
      <p className="mt-3">
        The model produces a probability for every possible next token. Here are the most likely
        few.
      </p>
    </>
  )

  const accentColor = accentHex('predict')
  const accentTint = accentRgba('predict', 0.14)

  const numberBoxClass =
    'flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-[10px] bg-(--color-surface-card) border border-(--color-border) font-[family-name:--font-mono] text-xs text-(--color-text-primary)'
  const tinyLabelClass =
    'font-[family-name:--font-body] font-medium text-[9px] tracking-[0.54px] uppercase text-(--color-text-muted)'
  const arrowClass = 'font-[family-name:--font-mono] text-lg text-(--color-text-muted)'

  const softmaxStyle = {
    '--sm-color': accentColor,
    '--sm-bg': accentTint,
  } as CSSProperties

  const deeper = (
    <div className="flex flex-col gap-3">
      <EyebrowLabel>How those numbers are made</EyebrowLabel>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex flex-col items-center gap-1">
          <span className={tinyLabelClass}>logits</span>
          <div className={numberBoxClass}>
            <span>3.1</span>
            <span>0.9</span>
            <span>0.4</span>
          </div>
        </div>
        <span aria-hidden="true" className={arrowClass}>
          →
        </span>
        <div className="flex flex-col items-center gap-1">
          <span className={tinyLabelClass}>normalize</span>
          <div
            style={softmaxStyle}
            className="border-[1.5px] border-(--sm-color) bg-(--sm-bg) text-(--sm-color) rounded-(--radius-pill) px-[14px] py-2 font-[family-name:--font-body] font-semibold text-xs"
          >
            softmax
          </div>
        </div>
        <span aria-hidden="true" className={arrowClass}>
          →
        </span>
        <div className="flex flex-col items-center gap-1">
          <span className={tinyLabelClass}>probs</span>
          <div className={numberBoxClass}>
            <span>0.71</span>
            <span>0.06</span>
            <span>0.04</span>
          </div>
        </div>
      </div>
      <div className="mt-1">
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
