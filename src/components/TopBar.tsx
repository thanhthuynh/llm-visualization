import { EyebrowLabel } from '@/components/EyebrowLabel'
import type { SceneConfig } from '@/scenes/scenes.config'
import { accentHex } from '@/utils/accent'

interface TopBarProps {
  scene: SceneConfig
}

export function TopBar({ scene }: TopBarProps) {
  const isPrologue = scene.id === 'intro'
  const eyebrowLabel = scene.railLabel ?? scene.title
  const pillContent = scene.prompt !== '' ? scene.prompt : scene.title
  const accentColor = scene.accent ? accentHex(scene.accent) : undefined

  return (
    <header className="fixed top-0 right-0 left-[72px] h-18 bg-bg-base border-b border-border flex items-center justify-between px-8 z-[9]">
      <span className="font-display font-bold text-xl tracking-[-0.2px]">Inside an LLM</span>
      {!isPrologue && (
        <div
          data-testid="topbar-pill"
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-pill bg-surface-card border border-border"
        >
          {accentColor ? (
            <EyebrowLabel accent={accentColor}>{eyebrowLabel}</EyebrowLabel>
          ) : (
            <EyebrowLabel>{eyebrowLabel}</EyebrowLabel>
          )}
          <span className="font-mono text-[13px]">{pillContent}</span>
        </div>
      )}
    </header>
  )
}
