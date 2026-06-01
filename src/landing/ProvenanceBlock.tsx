export function ProvenanceBlock() {
  return (
    <section
      id="provenance"
      aria-labelledby="provenance-heading"
      className="max-w-[52rem] mx-auto px-6 md:px-10 py-32 border-t border-border"
    >
      <div className="flex gap-6">
        <div
          aria-hidden="true"
          className="shrink-0 w-0.5 self-stretch bg-accent-caveat rounded-full"
        />
        <div className="flex flex-col gap-6">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
            METHODS · PROVENANCE
          </p>
          <h2
            id="provenance-heading"
            className="font-display text-4xl font-medium tracking-[-0.01em] text-text-primary"
          >
            Where the numbers come from
          </h2>
          <p className="font-body text-lg leading-relaxed text-text-primary/90">
            Every number, embedding, attention weight, and probability on this site comes from GPT-2
            small, run offline — illustrative, not live frontier internals. Claude and ChatGPT
            don&apos;t expose token-level state for arbitrary input, so this site doesn&apos;t
            pretend to visualize theirs.
          </p>
          <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 font-mono text-sm">
            <dt className="text-text-muted">model</dt>
            <dd className="text-text-primary">gpt2-small</dd>
            <dt className="text-text-muted">source</dt>
            <dd className="text-text-primary">huggingface.co/openai-community/gpt2</dd>
            <dt className="text-text-muted">refresh</dt>
            {/* eslint-disable-next-line no-undef -- vite.config.ts injects __BUILD_COMMIT__ via define */}
            <dd className="text-text-primary">commit {__BUILD_COMMIT__}</dd>
          </dl>
        </div>
      </div>
    </section>
  )
}
