import { SceneStation } from '@/components/SceneStation'
import { PromptField } from '@/components/PromptField'
import { Chip } from '@/components/Chip'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { useRunningExample } from '@/app/RunningExampleContext'
import { getSceneById } from '@/scenes/scenes.config'

const SCENE = getSceneById('prompt')
const EXAMPLE_PROMPTS = ['The sky is', 'The cat sat down because it was tired'] as const

export function PromptScene() {
  const { dataset } = useRunningExample()

  const stage = (
    <div
      style={{
        padding: 48,
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <EyebrowLabel>Your prompt</EyebrowLabel>
        <PromptField text={dataset.prompt} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <EyebrowLabel>Try an example</EyebrowLabel>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {EXAMPLE_PROMPTS.map((p) => (
            <Chip key={p} variant="example" onClick={() => undefined} active={p === dataset.prompt}>
              {p}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>The starting point</EyebrowLabel>
      <p style={{ marginTop: 12 }}>
        Everything starts with a prompt — a string of characters. The model will receive exactly the
        text you see in the stage.
      </p>
    </>
  )

  const deeper = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <EyebrowLabel>The raw input</EyebrowLabel>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 15,
        }}
      >
        <span>&quot;{dataset.prompt}&quot;</span>
        <span style={{ color: 'var(--color-text-muted)' }}>{dataset.prompt.length} chars</span>
      </div>
      <p>
        Before the model sees this, it has to be turned into pieces the network can understand —
        that&apos;s the next step.
      </p>
    </div>
  )

  return (
    <SceneStation
      id={SCENE.id}
      title={SCENE.title}
      accent="prompt"
      stage={stage}
      surface={surface}
      deeper={deeper}
    />
  )
}
