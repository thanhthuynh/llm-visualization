import { loadHallucinationCase } from '@/data/loader'
import { SceneStation } from '@/components/SceneStation'
import { DataBar } from '@/components/DataBar'
import { CaveatNote } from '@/components/CaveatNote'
import { ClaimTier } from '@/components/ClaimTier'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { getSceneById } from '@/scenes/scenes.config'

const SCENE = getSceneById('hallucinate')

// Load once at module level — illustrative dataset, never changes at runtime.
const hc = loadHallucinationCase()

const dominantIndex = hc.nextToken.reduce(
  (best, c, i, arr) => (c.p > (arr[best]?.p ?? -1) ? i : best),
  0,
)

export function HallucinateScene() {
  const stage = (
    <div className="p-(--stage-padding) flex flex-col gap-4 h-full">
      <div className="font-mono text-[15px] text-text-muted">
        P( next token | <span className="text-text-primary">&quot;{hc.prompt}&quot;</span> )
      </div>

      <div className="flex flex-col gap-0.5">
        {hc.nextToken.map((c, i) => {
          const isTruth = c.token.trim().toLowerCase() === hc.truth.trim().toLowerCase()
          const isDominant = i === dominantIndex
          return (
            <div key={c.token} className="flex items-center gap-2">
              <div className="flex-1">
                <DataBar
                  label={c.token.trim()}
                  value={`${Math.round(c.p * 100)}%`}
                  fraction={c.p}
                  dominant={isDominant}
                  {...(isDominant ? { accent: 'hallucinate' as const } : {})}
                />
              </div>
              {isTruth && (
                <span
                  className="font-mono text-xs text-green-400 shrink-0"
                  aria-label="correct answer"
                >
                  ✓ truth
                </span>
              )}
            </div>
          )
        })}
      </div>

      <p className="font-body text-sm text-text-muted mt-auto">
        The model scores plausibility, not truth. Nothing in the loop checks the difference.
      </p>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>Confident and wrong</EyebrowLabel>
      <p className="mt-3">
        Sometimes the model states a falsehood with full confidence — a hallucination. It isn&apos;t
        lying; nothing in next-token prediction checks truth. Plausible-sounding text is exactly
        what it was trained to produce.
      </p>
    </>
  )

  const deeper = (
    <div className="flex flex-col gap-4">
      {/* Failure gallery */}
      <div>
        <EyebrowLabel>Known failure modes</EyebrowLabel>
        <ul className="mt-2 flex flex-col gap-1.5 list-none p-0 m-0">
          <li className="flex items-start gap-2 font-body text-sm text-text-muted">
            <ClaimTier tier="c" />
            <span>Fake citations — sources never written</span>
          </li>
          <li className="flex items-start gap-2 font-body text-sm text-text-muted">
            <ClaimTier tier="c" />
            <span>Invented quotes</span>
          </li>
          <li className="flex items-start gap-2 font-body text-sm text-text-muted">
            <ClaimTier tier="a" />
            <span>A court filing with cases that never existed (documented sanction, 2023)</span>
          </li>
          <li className="flex items-start gap-2 font-body text-sm text-text-muted">
            <ClaimTier tier="c" />
            <span>A library function that doesn&apos;t exist</span>
          </li>
        </ul>
      </div>

      {/* Why section */}
      <div>
        <EyebrowLabel>Why this happens</EyebrowLabel>
        <p className="mt-2 font-body text-sm text-text-muted">
          Predict (Part 2) assigns a probability for every token — even when every option is false.
          Decode (Part 2) sampling picks one anyway. There is no fact-check step in that loop.
        </p>
      </div>

      {/* What reduces it */}
      <div>
        <EyebrowLabel>What reduces it (never eliminates it)</EyebrowLabel>
        <ul className="mt-2 flex flex-col gap-1 list-none p-0 m-0">
          <li className="font-body text-sm text-text-muted">
            •{' '}
            <a href="#rag" className="underline text-text-primary">
              RAG (earlier in this act)
            </a>
          </li>
          <li className="font-body text-sm text-text-muted">• Citations you can click</li>
          <li className="font-body text-sm text-text-muted">
            • Lower temperature for factual tasks (→ Decode, Part 2)
          </li>
          <li className="font-body text-sm text-text-muted">• A human who checks</li>
        </ul>
      </div>

      <CaveatNote>
        Frontier models hallucinate far less than GPT-2 small — but they inherit the same mechanism
        shown here. Vendor accuracy claims age fast; treat them as tier (c).
      </CaveatNote>
    </div>
  )

  return (
    <SceneStation
      id={SCENE.id}
      title={SCENE.title}
      accent="hallucinate"
      stage={stage}
      surface={surface}
      deeper={deeper}
    />
  )
}
