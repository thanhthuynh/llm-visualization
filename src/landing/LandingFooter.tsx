import { accentHex } from '@/utils/accent'
import type { AccentToken } from '@/scenes/scenes.config'

const STAGES: { id: AccentToken; label: string }[] = [
  { id: 'prompt', label: 'Prompt' },
  { id: 'tokenize', label: 'Tokenize' },
  { id: 'embed', label: 'Embed' },
  { id: 'attention', label: 'Attention' },
  { id: 'predict', label: 'Predict' },
  { id: 'decode', label: 'Decode' },
  { id: 'output', label: 'Output' },
]

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-bg-base">
      <div className="max-w-[76rem] mx-auto px-6 md:px-10 py-10 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3" aria-label="Pipeline">
            {STAGES.map((stage) => (
              <span
                key={stage.id}
                role="img"
                aria-label={stage.label}
                className="block w-2 h-2 rounded-full"
                style={{ background: accentHex(stage.id) }}
              />
            ))}
          </div>
          <a
            href="/explorer#prompt"
            className="font-display text-xl text-text-primary hover:text-accent-output transition-colors"
          >
            Launch the explainer →
          </a>
          <div className="flex items-center gap-6 font-body text-sm text-text-primary/90">
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
        <p className="font-mono text-xs text-text-muted">
          built with vite · react 19 · tailwind v4 · motion · d3-scale · zod
        </p>
      </div>
    </footer>
  )
}
