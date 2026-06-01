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
    <div className="p-(--stage-padding) flex flex-col gap-10 h-full justify-center">
      <div className="flex flex-col gap-3">
        <EyebrowLabel>Your prompt</EyebrowLabel>
        <PromptField text={dataset.prompt} />
      </div>
      <div className="flex flex-col gap-3">
        <EyebrowLabel>Try an example</EyebrowLabel>
        <div className="flex gap-3 flex-wrap">
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
      <p className="mt-3">
        Everything starts with a prompt — a string of characters. The model will receive exactly the
        text you see in the stage.
      </p>
    </>
  )

  const deeper = (
    <div className="flex flex-col gap-3">
      <EyebrowLabel>The raw input</EyebrowLabel>
      <div className="flex items-center gap-3 font-mono text-[15px]">
        <span>&quot;{dataset.prompt}&quot;</span>
        <span className="text-text-muted">{dataset.prompt.length} chars</span>
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
