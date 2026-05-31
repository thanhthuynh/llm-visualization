import { motion } from 'motion/react'
import { SceneStation } from '@/components/SceneStation'
import { Chip } from '@/components/Chip'
import { CaveatNote } from '@/components/CaveatNote'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { useRunningExample } from '@/app/RunningExampleContext'
import { getSceneById } from '@/scenes/scenes.config'

const SCENE = getSceneById('tokenize')

function chipDisplay(text: string): string {
  // Mockup convention: a leading-space token renders with a ·-prefix indicating whitespace.
  return text.startsWith(' ') ? `·${text.slice(1)}` : text
}

export function TokenizeScene() {
  const { dataset } = useRunningExample()

  const stage = (
    <div
      style={{
        padding: 'var(--stage-padding)',
        display: 'flex',
        flexDirection: 'column',
        gap: 36,
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <EyebrowLabel>From text to tokens</EyebrowLabel>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22 }}>{dataset.prompt}</div>
        <motion.div
          layout
          data-testid="tokens-group"
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
        >
          {dataset.tokens.map((t) => (
            <Chip key={t.id} variant="token">
              {chipDisplay(t.text)}
            </Chip>
          ))}
        </motion.div>
        <p
          style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)' }}
        >
          · marks the whitespace that belongs to each token.
        </p>
      </div>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>Discrete pieces</EyebrowLabel>
      <p style={{ marginTop: 12 }}>
        The model doesn&apos;t see characters — it sees tokens, learned subword pieces from the
        model&apos;s vocabulary.
      </p>
    </>
  )

  const deeper = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <EyebrowLabel>Subword units</EyebrowLabel>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, max-content)',
          gap: 10,
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
        }}
      >
        {dataset.tokens.map((t) => (
          <div key={t.id} style={{ display: 'contents' }}>
            <span>{chipDisplay(t.text)}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>→</span>
            <span>{t.id}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <EyebrowLabel>When a word is rare, it splits</EyebrowLabel>
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
          }}
        >
          <span>tokenization</span>
          <span style={{ color: 'var(--color-text-muted)' }}>→</span>
          <span>[</span>
          <span>token</span>
          <span style={{ color: 'var(--color-text-muted)' }}>|</span>
          <span>ization</span>
          <span>]</span>
        </div>
      </div>
      <p>Each token is an integer index into the model&apos;s vocabulary.</p>
      <CaveatNote>
        Different models tokenize the same text differently. Claude and ChatGPT each have their own
        tokenizer — same sentence, different counts.
      </CaveatNote>
    </div>
  )

  return (
    <SceneStation
      id={SCENE.id}
      title={SCENE.title}
      accent="tokenize"
      stage={stage}
      surface={surface}
      deeper={deeper}
    />
  )
}
