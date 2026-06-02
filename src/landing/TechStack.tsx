export function TechStack() {
  return (
    <section
      id="tech-stack"
      aria-labelledby="tech-stack-heading"
      className="max-w-[76rem] mx-auto px-6 md:px-10 py-24 border-t border-border"
    >
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-text-muted">BUILT WITH</p>
        <h2
          id="tech-stack-heading"
          className="font-display text-4xl font-medium tracking-[-0.01em] text-text-primary"
        >
          Built with
        </h2>
        <p className="font-mono text-base text-text-primary/90 leading-relaxed">
          vite · react 19 · typescript 5.7 · tailwind v4 · motion · d3-scale · zod
        </p>
      </div>
    </section>
  )
}
