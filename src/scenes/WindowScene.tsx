import { SceneStation } from '@/components/SceneStation'
import { WindowTape } from '@/components/WindowTape'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { CaveatNote } from '@/components/CaveatNote'
import { ClaimTier } from '@/components/ClaimTier'
import { ContextWindowBar } from '@/components/ContextWindowBar'
import { useRunningExample } from '@/app/RunningExampleContext'
import { getSceneById } from '@/scenes/scenes.config'
import { COMPARE_CONFIG } from '@/data/compare.config'

const SCENE = getSceneById('window')

const contextRows = COMPARE_CONFIG.contextWindows.map((c) => ({
  vendor: c.vendor,
  family: c.family,
  tokens: c.tokens,
}))

const maxTokens = Math.max(...COMPARE_CONFIG.contextWindows.map((c) => c.tokens))

export function WindowScene() {
  const { dataset } = useRunningExample()
  const N = dataset.tokens.length

  const stage = (
    <div className="p-(--stage-padding) flex flex-col gap-4 h-full">
      <WindowTape
        ruler="0 — 1,024 tokens · GPT-2 small"
        blocks={[
          { label: 'system prompt', tone: 'system' },
          { label: 'earlier turns', tone: 'turns' },
          { label: 'your message', tone: 'you' },
          { label: 'reply so far', tone: 'reply' },
        ]}
        overflow
      />
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>Context window</EyebrowLabel>
      <p className="mt-3">
        The model reads a fixed budget of tokens at once — the context window. Prompt, conversation
        so far, pasted documents: all of it competes for the same space.
      </p>
    </>
  )

  const deeper = (
    <div className="flex flex-col gap-4">
      <p className="font-body text-sm text-text-primary">
        This conversation uses <strong>{N}</strong> of GPT-2 small&apos;s 1,024 tokens.
      </p>
      <div>
        <EyebrowLabel>
          Vendor context windows <ClaimTier tier="a" />
        </EyebrowLabel>
        <div className="mt-2">
          <ContextWindowBar rows={contextRows} maxTokens={maxTokens} />
        </div>
        <p className="mt-1.5 font-body text-xs text-text-muted">
          Last updated {COMPARE_CONFIG.lastUpdated}
        </p>
      </div>
      <div>
        <p className="font-body text-sm">
          When the window is full, most models truncate oldest tokens (truncate-oldest){' '}
          <ClaimTier tier="b" /> — some use summarization or sliding-window tricks instead{' '}
          <ClaimTier tier="c" />.
        </p>
      </div>
      <p className="font-body text-sm">
        Why a budget at all? Attention compares every token against every other — cost grows roughly
        with the square of sequence length. → Attention (Part 2).
      </p>
      <p className="font-body text-sm font-semibold">
        It isn&apos;t memory fading — it&apos;s a budget filling. When the window is full, the
        oldest tokens are simply gone.
      </p>
      <CaveatNote>
        &ldquo;Losing the thread&rdquo; in a long chat is usually window overflow — but frontier
        products layer undisclosed memory tricks on top. We can show the mechanism, not their
        recipes.
      </CaveatNote>
    </div>
  )

  return (
    <SceneStation
      id={SCENE.id}
      title={SCENE.title}
      accent="window"
      stage={stage}
      surface={surface}
      deeper={deeper}
    />
  )
}
