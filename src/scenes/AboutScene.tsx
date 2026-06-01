import { useRunningExample } from '@/app/RunningExampleContext'

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
    </section>
  )
}
