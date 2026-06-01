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
    <div className="p-(--stage-padding) flex flex-col gap-9 h-full justify-center">
      <div className="flex flex-col gap-4">
        <EyebrowLabel>From text to tokens</EyebrowLabel>
        <div className="font-mono text-[22px]">{dataset.prompt}</div>
        <motion.div
          layout
          data-testid="tokens-group"
          className="flex gap-2.5 flex-wrap"
        >
          {dataset.tokens.map((t) => (
            <Chip key={t.id} variant="token">
              {chipDisplay(t.text)}
            </Chip>
          ))}
        </motion.div>
        <p className="font-body text-[13px] text-text-muted">
          · marks the whitespace that belongs to each token.
        </p>
      </div>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>Discrete pieces</EyebrowLabel>
      <p className="mt-3">
        The model doesn&apos;t see characters — it sees tokens, learned subword pieces from the
        model&apos;s vocabulary.
      </p>
    </>
  )

  const deeper = (
    <div className="flex flex-col gap-4">
      <EyebrowLabel>Subword units</EyebrowLabel>
      <div
        className="grid items-center gap-2.5 font-mono text-sm"
        style={{ gridTemplateColumns: 'repeat(3, max-content)' }}
      >
        {dataset.tokens.map((t) => (
          <div key={t.id} className="contents">
            <span>{chipDisplay(t.text)}</span>
            <span className="text-text-muted">→</span>
            <span>{t.id}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <EyebrowLabel>When a word is rare, it splits</EyebrowLabel>
        <div className="flex items-center gap-3 font-mono text-sm">
          <span>tokenization</span>
          <span className="text-text-muted">→</span>
          <span>[</span>
          <span>token</span>
          <span className="text-text-muted">|</span>
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
