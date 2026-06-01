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
    <div
      style={{
        padding: 'var(--stage-padding)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        height: '100%',
      }}
    >
      <EyebrowLabel>The honest comparison</EyebrowLabel>

      <div
        style={{
          padding: 14,
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          background: 'var(--color-surface-card)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Architecture: both <ClaimTier tier="a" />
        </div>
        <p
          style={{
            margin: '6px 0 0',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--color-text-muted)',
            lineHeight: '20px',
          }}
        >
          Decoder-only autoregressive transformers, pretrained then post-trained. Everything you
          watched in scenes 1–6 applies to both.
        </p>
      </div>

      <div>
        <EyebrowLabel>Context window (API)</EyebrowLabel>
        <div style={{ marginTop: 8 }}>
          <ContextWindowBar rows={contextRows} maxTokens={maxTokens} />
        </div>
        <p
          style={{
            margin: '8px 0 0',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
          }}
        >
          The honest story here is <strong>convergence</strong>, not &ldquo;X is bigger.&rdquo;{' '}
          <ClaimTier tier="a" />
        </p>
      </div>

      <div>
        <EyebrowLabel>Tokenizers differ — same text, different counts</EyebrowLabel>
        <div style={{ marginTop: 8 }}>
          <TokenizerCount examples={[...COMPARE_CONFIG.tokenizerExamples]} />
        </div>
        <p
          style={{
            margin: '8px 0 0',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
          }}
        >
          Best hard difference. Ties back to Scene 1 (Tokenization). <ClaimTier tier="a" />
        </p>
      </div>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>Claude vs ChatGPT</EyebrowLabel>
      <p style={{ marginTop: 12 }}>
        At the architecture level, these systems are <strong>more alike than different</strong> —
        both decoder-only transformers, pretrained then post-trained with human-feedback
        techniques. Lead with what they share, then rank differences by how durable and verifiable
        they are.
      </p>
    </>
  )

  const deeper = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <EyebrowLabel>Post-training philosophy</EyebrowLabel>
        <div
          style={{
            marginTop: 8,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
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
        <p
          style={{
            margin: '8px 0 0',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
          }}
        >
          The existence of each program is public <ClaimTier tier="a" />. Current recipes are
          partial / historical <ClaimTier tier="b" />.
        </p>
      </div>

      <div>
        <EyebrowLabel>Model lineup</EyebrowLabel>
        <div style={{ marginTop: 8 }}>
          <CompareTable rows={lineupRows} caption="Model lineup" />
        </div>
      </div>

      <CaveatNote>
        Tier (a) claims are public + verifiable; (b) are reasonable inference; (c) age fast — model
        names, exact context-window numbers, and any &ldquo;which is smarter&rdquo; comparison
        change month-to-month.
      </CaveatNote>

      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--color-text-muted)',
        }}
      >
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
