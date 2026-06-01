import { SceneStation } from '@/components/SceneStation'
import { CaveatNote } from '@/components/CaveatNote'
import { EmbeddingSpace } from '@/components/EmbeddingSpace'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { getSceneById } from '@/scenes/scenes.config'
import { ILLUSTRATIVE_DOTS } from '@/data/illustrative-embeddings'

const SCENE = getSceneById('embed')

export function EmbedScene() {
  const tagClass =
    'px-2.5 py-1 rounded-pill border border-border text-text-muted'

  const stage = (
    <div className="p-(--stage-padding) flex flex-col gap-4 h-full">
      <EyebrowLabel>A space of meaning</EyebrowLabel>
      <div className="flex-1 min-h-0">
        <EmbeddingSpace
          dots={ILLUSTRATIVE_DOTS}
          cluster={{ cx: -0.4, cy: -0.3, rx: 0.35, ry: 0.35 }}
          accent="embed"
          width={600}
          height={420}
        />
      </div>
      <p className="font-body text-[13px] text-text-muted">
        Each token gets a position in a shared meaning space. Neighbours are related.
      </p>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>From tokens to vectors</EyebrowLabel>
      <p className="mt-3">
        Each token is mapped to a long vector — a position in a space the model has learned during
        training. Related tokens land near each other.
      </p>
    </>
  )

  const deeper = (
    <div className="flex flex-col gap-4">
      <EyebrowLabel>Contextual shift</EyebrowLabel>
      <div className="w-full">
        <EmbeddingSpace
          dots={ILLUSTRATIVE_DOTS}
          shift={{ from: 'sky', to: { x: -0.1, y: -0.45 } }}
          accent="embed"
          width={520}
          height={300}
        />
      </div>
      <div className="flex flex-wrap gap-2.5 font-mono text-xs">
        <span className={tagClass}>768–4096 dims</span>
        <span className={tagClass}>2D = projection</span>
        <span className={tagClass}>+ position</span>
      </div>
      <p>
        You&apos;re seeing a 2D projection of a space with hundreds to thousands of dimensions —
        flattening it distorts the real distances.
      </p>
      <p>
        The model also adds positional info so word order matters, and a token&apos;s spot keeps
        moving — meaning becomes contextual after attention (next step).
      </p>
      <CaveatNote>
        The famous <strong>king − man + woman ≈ queen</strong> story is an older idea (word2vec).
        Transformer embeddings shift with context, so a static-vector arithmetic picture isn&apos;t
        what the model does to your prompt.
      </CaveatNote>
    </div>
  )

  return (
    <SceneStation
      id={SCENE.id}
      title={SCENE.title}
      accent="embed"
      stage={stage}
      surface={surface}
      deeper={deeper}
    />
  )
}
