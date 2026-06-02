import { HeroPipelinePreview } from './HeroPipelinePreview'

const GITHUB_URL = 'https://github.com/thanhthuynh/llm-visualization'

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="max-w-[76rem] mx-auto px-6 md:px-10 pt-20 pb-32"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-6">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
            INTERACTIVE EXPLAINER · build{' '}
            {/* eslint-disable-next-line no-undef -- vite.config.ts injects __BUILD_COMMIT__ via define */}
            {__BUILD_COMMIT__}
          </p>
          <h1
            id="hero-heading"
            className="font-display text-5xl md:text-7xl font-medium tracking-[-0.02em] text-text-primary"
          >
            Inside an <span style={{ color: 'var(--color-accent-embed)' }}>LLM</span>
          </h1>
          <p className="font-body text-xl leading-relaxed text-text-primary/90 max-w-prose">
            Watch a prompt become an answer, one token at a time. Seven stages, two reading paths —
            gist on the surface, receipts underneath.
          </p>
          <p className="font-mono text-sm text-text-primary/90">
            Numbers from GPT-2 small, run offline. Illustrative, not Claude or ChatGPT internals.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="/explorer#prompt"
              className="inline-flex items-center px-6 py-3.5 rounded-pill bg-accent-output text-bg-base font-body font-semibold text-base hover:opacity-90 transition-opacity"
              data-umami-event="cta-start-explore"
            >
              Start with the prompt →
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3.5 rounded-pill border border-border text-text-primary font-body font-medium text-base hover:border-text-muted transition-colors"
              data-umami-event="cta-github"
            >
              View on GitHub
            </a>
          </div>
        </div>
        <div>
          <HeroPipelinePreview />
        </div>
      </div>
    </section>
  )
}
