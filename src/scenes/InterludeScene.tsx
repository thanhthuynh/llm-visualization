import { EyebrowLabel } from '@/components/EyebrowLabel'
import { accentHex } from '@/utils/accent'
import type { AccentToken } from '@/scenes/scenes.config'

interface TermRow {
  term: string
  tag: string
  href: string
  accent: AccentToken
}

const TERM_INDEX: TermRow[] = [
  { term: 'Context window', tag: 'what it can see', href: '#window', accent: 'window' },
  { term: 'System prompt', tag: 'the rules you never see', href: '#system', accent: 'system' },
  { term: 'Retrieval (RAG)', tag: 'look it up, don’t guess', href: '#rag', accent: 'rag' },
  {
    term: 'Hallucination',
    tag: 'when it makes stuff up',
    href: '#hallucinate',
    accent: 'hallucinate',
  },
  {
    term: 'Temperature',
    tag: 'the randomness dial — not creativity',
    href: '#decode',
    accent: 'decode',
  },
  { term: 'Embeddings', tag: 'meaning as numbers', href: '#embed', accent: 'embed' },
  { term: 'Vector database', tag: 'search by meaning', href: '#rag', accent: 'rag' },
]

export function InterludeScene() {
  return (
    <section
      id="interlude"
      aria-labelledby="interlude-title"
      className="min-h-screen pt-26 pb-8 pl-(--gutter-left) pr-(--gutter-right)"
      style={{ maxWidth: 'calc(760px + var(--gutter-left))' }}
    >
      <EyebrowLabel>PART 1 · AROUND THE MODEL</EyebrowLabel>

      <h2
        id="interlude-title"
        tabIndex={-1}
        className="mt-3 m-0 font-display font-bold text-[28px] leading-[34px] tracking-[-1px]"
      >
        Around the model.
      </h2>

      <p className="mt-6 leading-[27px] text-text-secondary max-w-prose">
        The model you just watched race through the intro lives inside a wrapper — rules you never
        see, a token budget, sometimes a search step. Here are the seven words for that layer;
        we&apos;ll open up the machinery itself in Part 2.
      </p>

      <ol className="mt-10 list-none p-0 m-0 flex flex-col gap-5">
        {TERM_INDEX.map(({ term, tag, href, accent }) => (
          <li
            key={`${term}-${href}`}
            className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <span className="font-display font-semibold text-[15px] leading-[22px] text-text-primary min-w-[180px]">
              {term}
            </span>
            <span className="font-mono text-[12px] text-text-muted leading-[22px] flex-1">
              {tag}
            </span>
            <a
              href={href}
              className="font-mono text-[11px] px-2 py-0.5 rounded border self-start sm:self-auto whitespace-nowrap"
              style={{
                color: accentHex(accent),
                borderColor: accentHex(accent),
              }}
            >
              {href}
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
