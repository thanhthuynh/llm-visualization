/**
 * Plan 10 placeholder.
 *
 * Routing + build-time commit injection + spec decisions are wired (see
 * docs/superpowers/specs/2026-06-01-landing-page-design.md §10). The six
 * section components (Hero, SceneCardGrid, ProvenanceBlock,
 * SurfaceDeepPreview, TechStack, LandingFooter) are intentionally NOT in
 * this commit — they will be added in a follow-up session that disables
 * the fact-forcing gate so parallel writes go through cleanly.
 */
export function Landing() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <main
        id="main-content"
        aria-labelledby="landing-heading"
        className="bg-bg-base min-h-screen flex items-center justify-center px-8 py-24"
      >
        <div className="max-w-2xl flex flex-col gap-6 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
            INTERACTIVE EXPLAINER · build{' '}
            {/* eslint-disable-next-line no-undef -- vite.config.ts injects __BUILD_COMMIT__ via define */}
            {__BUILD_COMMIT__}
          </p>
          <h1
            id="landing-heading"
            className="font-display text-5xl md:text-7xl font-medium tracking-[-0.02em] text-text-primary"
          >
            Inside an LLM
          </h1>
          <p className="font-body text-xl leading-relaxed text-text-primary/90">
            Watch a prompt become an answer, one token at a time. Seven stages, two reading paths —
            gist on the surface, receipts underneath.
          </p>
          <p className="font-mono text-sm text-text-muted">
            Numbers from GPT-2 small, run offline. Illustrative, not Claude or ChatGPT internals.
          </p>
          <div className="flex justify-center pt-4">
            <a
              href="/explorer#prompt"
              className="inline-flex items-center px-6 py-3.5 rounded-pill bg-accent-output text-bg-base font-body font-semibold text-base hover:opacity-90 transition-opacity"
            >
              Start with the prompt →
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
