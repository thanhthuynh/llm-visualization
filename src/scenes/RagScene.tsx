import { loadRetrievalToy } from '@/data/loader'
import { SceneStation } from '@/components/SceneStation'
import { WindowTape } from '@/components/WindowTape'
import { ReplyBubble } from '@/components/ReplyBubble'
import { CaveatNote } from '@/components/CaveatNote'
import { ClaimTier } from '@/components/ClaimTier'
import { EyebrowLabel } from '@/components/EyebrowLabel'
import { Chip } from '@/components/Chip'
import { getSceneById } from '@/scenes/scenes.config'
import { accentHex } from '@/utils/accent'

const SCENE = getSceneById('rag')
const ragAccent = accentHex('rag')

// Load once at module level — illustrative dataset, never changes at runtime.
const retrieval = loadRetrievalToy()
const { chunks } = retrieval
const topChunk = chunks[0]

export function RagScene() {
  const stage = (
    <div className="p-(--stage-padding) flex flex-col gap-4 h-full overflow-y-auto">
      {/* WITHOUT RAG */}
      <div>
        <EyebrowLabel>Without RAG</EyebrowLabel>
        <div className="mt-2 flex flex-col gap-2">
          <Chip variant="example">{retrieval.query}</Chip>
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 bg-surface-card border border-border rounded font-mono text-xs text-text-muted">
              model
            </div>
          </div>
          <ReplyBubble text="I don't have access to your company's policies." />
        </div>
      </div>

      {/* WITH RAG */}
      <div>
        <EyebrowLabel accent={ragAccent}>With RAG</EyebrowLabel>
        <div className="mt-2 flex flex-col gap-2">
          <Chip variant="example">{retrieval.query}</Chip>
          <div
            className="px-3 py-1.5 rounded font-mono text-xs"
            style={{ color: ragAccent, border: `1px solid ${ragAccent}44` }}
          >
            search docs ↓
          </div>
          <WindowTape
            ruler="Retrieved chunk"
            blocks={[{ label: topChunk.text, tone: 'retrieved' }]}
          />
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 bg-surface-card border border-border rounded font-mono text-xs text-text-muted">
              model
            </div>
          </div>
          <ReplyBubble text={`According to the document: "${topChunk.text}"`} />
        </div>
      </div>
    </div>
  )

  const surface = (
    <>
      <EyebrowLabel>Retrieval-augmented generation</EyebrowLabel>
      <p className="mt-3">
        When the answer isn&apos;t in the model&apos;s weights, a retrieval step searches your
        documents and pastes the best chunks into the window — retrieval-augmented generation. The
        model answers from what it just read, not from what it vaguely absorbed in training.
      </p>
    </>
  )

  const deeper = (
    <div className="flex flex-col gap-4">
      {/* Meaning-space: honest sim encoding */}
      <div>
        <EyebrowLabel>Meaning-space: similarity by distance</EyebrowLabel>
        <p className="sr-only">
          A horizontal axis showing query star at the left (highest similarity) and five chunk dots
          placed by distance from the query. Closer dots have higher cosine similarity. The nearest
          chunk ({topChunk.text.slice(0, 30)}…) is highlighted in pink with similarity{' '}
          {topChunk.sim}.
        </p>
        <div
          aria-hidden="true"
          className="relative h-28 bg-surface-card rounded border border-border mt-2 overflow-hidden"
        >
          {/* Axis line */}
          <div
            className="absolute top-1/2 left-4 right-4 h-px bg-border"
            style={{ transform: 'translateY(-50%)' }}
          />
          {/* Query star at left */}
          <div
            className="absolute flex flex-col items-center gap-1"
            style={{ left: '4px', top: '50%', transform: 'translateY(-80%)' }}
          >
            <span className="text-lg" style={{ color: ragAccent }}>
              ★
            </span>
            <span className="font-mono text-[9px] text-text-muted whitespace-nowrap">query</span>
          </div>
          {/* Chunk dots placed by (1 - sim) * 85% from left */}
          {chunks.map((chunk, i) => {
            const leftPct = 8 + (1 - chunk.sim) * 82
            const isTop = i === 0
            return (
              <div
                key={i}
                className="absolute flex flex-col items-center gap-0.5"
                style={{ left: `${leftPct}%`, top: '50%', transform: 'translate(-50%, -80%)' }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full border"
                  style={{
                    backgroundColor: isTop ? ragAccent : 'var(--color-surface-card)',
                    borderColor: isTop ? ragAccent : 'var(--color-border)',
                  }}
                />
                <span
                  className="font-mono text-[8px] whitespace-nowrap max-w-[60px] truncate"
                  style={{ color: isTop ? ragAccent : 'var(--color-text-muted)' }}
                >
                  {chunk.text.slice(0, 18)}…
                </span>
                <span
                  className="font-mono text-[8px]"
                  style={{ color: isTop ? ragAccent : 'var(--color-text-muted)' }}
                >
                  {chunk.sim}
                </span>
              </div>
            )
          })}
        </div>
        <p className="mt-1 font-body text-xs text-text-muted">
          Same geometry as Embeddings (Part 2) — now over whole passages.
        </p>
      </div>

      {/* Vector-DB cards */}
      <div>
        <EyebrowLabel>Why a vector database?</EyebrowLabel>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="px-3 py-3 bg-surface-card border border-border rounded">
            <p className="font-body font-semibold text-xs text-text-primary mb-1">REGULAR DB</p>
            <p className="font-body text-xs text-text-muted">
              exact match: rows containing those literal words
            </p>
          </div>
          <div
            className="px-3 py-3 bg-surface-card rounded"
            style={{ border: `1px solid ${ragAccent}66` }}
          >
            <p className="font-body font-semibold text-xs" style={{ color: ragAccent }}>
              VECTOR DB
            </p>
            <p className="font-body text-xs text-text-muted mt-1">
              closest meaning: vectors nearest your question&apos;s
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-text-muted">Pinecone · Weaviate · pgvector</span>
          <ClaimTier tier="a" />
          <span className="font-body text-xs text-text-muted">
            (confirmed products, as of 2025)
          </span>
        </div>
      </div>

      {/* Failure-honesty line */}
      <p className="font-body text-sm text-text-muted">
        RAG fails when retrieval misses — wrong chunk in, wrong answer out, now with confidence.
      </p>

      <CaveatNote>
        Toy retrieval over five sentences with illustrative embeddings. Real systems use dedicated
        embedding models over millions of chunks — same geometry, different scale.
      </CaveatNote>
    </div>
  )

  return (
    <SceneStation
      id={SCENE.id}
      title={SCENE.title}
      accent="rag"
      stage={stage}
      surface={surface}
      deeper={deeper}
    />
  )
}
