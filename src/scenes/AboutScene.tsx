import { useRunningExample } from '@/app/RunningExampleContext'

export function AboutScene() {
  const { dataset } = useRunningExample()
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      style={{ minHeight: '100vh', padding: '104px 32px 32px 104px', maxWidth: 760 }}
    >
      <h2
        id="about-title"
        tabIndex={-1}
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 28,
          lineHeight: '34px',
          letterSpacing: '-1px',
          margin: 0,
        }}
      >
        About this explainer
      </h2>
      <div data-testid="about-body" style={{ marginTop: 24, lineHeight: '27px' }}>
        <p>
          Every number, embedding coordinate, attention weight, and probability shown in this site
          comes from a small open reference model &mdash; <strong>GPT-2 small</strong>, run offline.
          They are <em>illustrative</em>. Frontier providers (Claude, ChatGPT) do not expose
          token-level attention, embedding coordinates, or full next-token distributions for
          arbitrary input, so this site cannot honestly visualize their internals.
        </p>
        <p
          style={{
            marginTop: 24,
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--color-text-muted)',
            lineHeight: '20px',
          }}
        >
          Source: {dataset.source}
        </p>
      </div>
    </section>
  )
}
