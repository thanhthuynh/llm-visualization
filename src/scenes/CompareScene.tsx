import { SceneStation } from '@/components/SceneStation'
import { CaveatNote } from '@/components/CaveatNote'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { ClaimTier } from '@/components/ClaimTier'
import { ContextWindowBar } from '@/components/ContextWindowBar'
import { TokenizerCount } from '@/components/TokenizerCount'
import { PhilosophyCard } from '@/components/PhilosophyCard'
import { CompareTable } from '@/components/CompareTable'
import { getSceneById } from '@/scenes/scenes.config'
import { COMPARE_CONFIG } from '@/data/compare.config'

const SCENE = getSceneById('compare')

export function CompareScene() {
  const maxTokens = Math.max(...COMPARE_CONFIG.contextWindows.map((c) => c.tokens))
  const contextRows = COMPARE_CONFIG.contextWindows.map((c) => ({
    vendor: c.vendor,
    family: c.family,
    tokens: c.tokens,
  }))
  const lineupRows = COMPARE_CONFIG.modelLineup.map((m) => ({
    label: m.name,
    value: m.family,
    tier: m.tier,
  }))

  const stage = (
    <div className="p-(--stage-padding) flex flex-col gap-5 h-full">
      <EyebrowLabel>The honest comparison</EyebrowLabel>

      <div className="p-3.5 border border-border rounded-card bg-surface-card">
        <div className="flex items-center gap-2 font-body font-bold text-[15px]">
          Architecture: both <ClaimTier tier="a" />
        </div>
        <p className="mt-1.5 mb-0 font-body text-[13px] text-text-muted leading-5">
          Decoder-only autoregressive transformers, pretrained then post-trained. Everything you
          watched in scenes 1–6 applies to both.
        </p>
      </div>

      <div>
        <EyebrowLabel>Context window (API)</EyebrowLabel>
        <div className="mt-2">
          <ContextWindowBar rows={contextRows} maxTokens={maxTokens} />
        </div>
        <p className="mt-2 mb-0 font-body text-xs text-text-muted">
          The honest story here is <strong>convergence</strong>, not &ldquo;X is bigger.&rdquo;{' '}
          <ClaimTier tier="a" />
        </p>
      </div>

      <div>
        <EyebrowLabel>Tokenizers differ — same text, different counts</EyebrowLabel>
        <div className="mt-2">
          <TokenizerCount examples={[...COMPARE_CONFIG.tokenizerExamples]} />
        </div>
        <p className="mt-2 mb-0 font-body text-xs text-text-muted">
          Best hard difference. Ties back to Scene 1 (Tokenization). <ClaimTier tier="a" />
        </p>
      </div>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>Claude vs ChatGPT</EyebrowLabel>
      <p className="mt-3">
        At the architecture level, these systems are <strong>more alike than different</strong> —
        both decoder-only transformers, pretrained then post-trained with human-feedback
        techniques. Lead with what they share, then rank differences by how durable and verifiable
        they are.
      </p>
    </>
  )

  const deeper = (
    <div className="flex flex-col gap-4.5">
      <div>
        <EyebrowLabel>Post-training philosophy</EyebrowLabel>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {COMPARE_CONFIG.philosophies.map((p) => (
            <PhilosophyCard
              key={p.vendor}
              title={p.title}
              description={p.description}
              publicDoc={p.publicDoc}
              vendor={p.vendor}
            />
          ))}
        </div>
        <p className="mt-2 mb-0 font-body text-xs text-text-muted">
          The existence of each program is public <ClaimTier tier="a" />. Current recipes are
          partial / historical <ClaimTier tier="b" />.
        </p>
      </div>

      <div>
        <EyebrowLabel>Model lineup</EyebrowLabel>
        <div className="mt-2">
          <CompareTable rows={lineupRows} caption="Model lineup" />
        </div>
      </div>

      <CaveatNote>
        Tier (a) claims are public + verifiable; (b) are reasonable inference; (c) age fast — model
        names, exact context-window numbers, and any &ldquo;which is smarter&rdquo; comparison
        change month-to-month.
      </CaveatNote>

      <p className="font-mono text-xs text-text-muted">
        Last updated {COMPARE_CONFIG.lastUpdated}
      </p>
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
