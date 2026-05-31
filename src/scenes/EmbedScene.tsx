import { SceneStation } from '@/components/SceneStation'
import { CaveatNote } from '@/components/CaveatNote'
import { EmbeddingSpace } from '@/components/EmbeddingSpace'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { getSceneById } from '@/scenes/scenes.config'
import { ILLUSTRATIVE_DOTS } from '@/data/illustrative-embeddings'

const SCENE = getSceneById('embed')

export function EmbedScene() {
  const stage = (
    <div
      style={{
        padding: 'var(--stage-padding)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        height: '100%',
      }}
    >
      <EyebrowLabel>A space of meaning</EyebrowLabel>
      <div style={{ flex: 1, minHeight: 0 }}>
        <EmbeddingSpace
          dots={ILLUSTRATIVE_DOTS}
          cluster={{ cx: -0.4, cy: -0.3, rx: 0.35, ry: 0.35 }}
          accent="embed"
          width={600}
          height={420}
        />
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)' }}>
        Each token gets a position in a shared meaning space. Neighbours are related.
      </p>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>From tokens to vectors</EyebrowLabel>
      <p style={{ marginTop: 12 }}>
        Each token is mapped to a long vector — a position in a space the model has learned during
        training. Related tokens land near each other.
      </p>
    </>
  )

  const deeper = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <EyebrowLabel>Contextual shift</EyebrowLabel>
      <div style={{ width: '100%' }}>
        <EmbeddingSpace
          dots={ILLUSTRATIVE_DOTS}
          shift={{ from: 'sky', to: { x: -0.1, y: -0.45 } }}
          accent="embed"
          width={520}
          height={300}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
        }}
      >
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          768–4096 dims
        </span>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          2D = projection
        </span>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          + position
        </span>
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
