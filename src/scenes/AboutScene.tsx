import { SCENES } from '@/scenes/scenes.config'
import { accentHex } from '@/utils/accent'
import { useRunningExample } from '@/app/RunningExampleContext'

const WORDMARK_SCENES = SCENES.filter(
  (s) => s.implemented && (s.part === 'part1' || s.part === 'part2') && s.accent !== null,
)

export function AboutScene() {
  const { dataset } = useRunningExample()
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="min-h-screen pt-26 pb-8 pl-(--gutter-left) pr-(--gutter-right)"
      style={{ maxWidth: 'calc(760px + var(--gutter-left))' }}
    >
      <h2
        id="about-title"
        tabIndex={-1}
        className="m-0 font-display font-bold text-[28px] leading-[34px] tracking-[-1px]"
      >
        About this explainer
      </h2>
      <div data-testid="about-body" className="mt-6 leading-[27px]">
        <p>
          Every number, embedding coordinate, attention weight, and probability shown in this site
          comes from a small open reference model &mdash; <strong>GPT-2 small</strong>, run offline.
          They are <em>illustrative</em>. Frontier providers (Claude, ChatGPT) do not expose
          token-level attention, embedding coordinates, or full next-token distributions for
          arbitrary input, so this site cannot honestly visualize their internals.
        </p>
        <p className="mt-6 font-mono text-[13px] text-text-muted leading-5">
          Source: {dataset.source}
        </p>
      </div>

      <div className="mt-12 pt-6 border-t border-border flex flex-col gap-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
          Built with
        </p>
        <p className="font-mono text-[13px] text-text-muted">
          vite · react 19 · typescript 5.7 · tailwind v4 · motion · d3-scale · zod
        </p>

        <div data-testid="about-wordmark" className="flex items-center gap-3" aria-label="Pipeline">
          {WORDMARK_SCENES.map((s) => {
            const accent = s.accent
            if (!accent) return null
            return (
              <span
                key={s.id}
                role="img"
                aria-label={s.title}
                className="block w-2 h-2 rounded-full"
                style={{ background: accentHex(accent) }}
              />
            )
          })}
        </div>

        <div className="flex items-center gap-6 font-mono text-[13px] text-text-muted">
          <a
            href="https://github.com/thanhthuynh/llm-visualization"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
          <a
            href="https://github.com/thanhthuynh/llm-visualization/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            MIT
          </a>
        </div>
      </div>
    </section>
  )
}
