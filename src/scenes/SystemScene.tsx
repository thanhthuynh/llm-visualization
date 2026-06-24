import { SceneStation } from '@/components/SceneStation'
import { WindowTape } from '@/components/WindowTape'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { CaveatNote } from '@/components/CaveatNote'
import { ClaimTier } from '@/components/ClaimTier'
import { DistributionPair } from '@/components/DistributionPair'
import { getSceneById } from '@/scenes/scenes.config'
import { loadConditioning } from '@/data/loader'

const SCENE = getSceneById('system')
const cond = loadConditioning()

export function SystemScene() {
  const stage = (
    <div className="p-(--stage-padding) flex flex-col gap-4 h-full">
      <WindowTape
        ruler="0 — 1,024 tokens · GPT-2 small"
        blocks={[
          {
            label:
              'You are a helpful assistant. / Always respond in formal English. / Never recommend a competitor.',
            tone: 'system',
          },
          { label: 'your message', tone: 'you' },
        ]}
      />
      <p className="font-mono text-[11px] text-text-muted mt-auto">
        what the model actually receives = system + your message
      </p>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>The system prompt</EyebrowLabel>
      <p className="mt-3">
        Before your first word, the model has already read instructions you never see — the system
        prompt. Same model, different system prompt: most of the difference between a general
        chatbot and an airline&apos;s support agent.
      </p>
    </>
  )

  const deeper = (
    <div className="flex flex-col gap-4">
      <div>
        <EyebrowLabel>Conditioning demo (illustrative)</EyebrowLabel>
        <div className="mt-1 font-mono text-[11px] text-text-muted">
          Base: &ldquo;{cond.basePrompt}&rdquo;
        </div>
        <div className="mt-0.5 mb-2 font-mono text-[11px] text-text-muted">
          Conditioned: &ldquo;{cond.conditionedPrompt}&rdquo;
        </div>
        <DistributionPair
          left={{ label: 'Base prompt', bars: cond.base.map((c) => ({ token: c.token, p: c.p })) }}
          right={{
            label: '+ system prompt',
            bars: cond.conditioned.map((c) => ({ token: c.token, p: c.p })),
          }}
          accent="system"
          arrowCaption="system prompt prepended →"
        />
      </div>
      <p className="font-body text-sm">
        A system prompt is not a special channel. It is tokens — prepended, attended to by
        everything after them, shifting every prediction downstream.
      </p>
      <p className="font-body text-xs text-text-muted">
        → you&apos;ll see how these bars are computed in Part 2 (Attention, Predict).
      </p>
      <div className="flex flex-col gap-1.5">
        <p className="font-body text-sm">
          Anthropic publishes Claude&apos;s system prompts <ClaimTier tier="a" />
        </p>
        <p className="font-body text-sm">
          ChatGPT&apos;s have only been extracted, not published <ClaimTier tier="c" />
        </p>
      </div>
      <CaveatNote>
        GPT-2 small is a base model — no chat format, no system-prompt training. What it can show
        honestly is conditioning: prepended text reshapes every following prediction. Chat models
        are additionally trained to follow those instructions.
      </CaveatNote>
    </div>
  )

  return (
    <SceneStation
      id={SCENE.id}
      title={SCENE.title}
      accent="system"
      stage={stage}
      surface={surface}
      deeper={deeper}
    />
  )
}
